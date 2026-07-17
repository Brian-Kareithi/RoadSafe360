'use client';

import { useEffect, useRef, useState } from 'react';
import { FiCrosshair } from 'react-icons/fi';

interface MapPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const initStarted = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    let destroyed = false;

    async function init() {
      if (!mapRef.current) return;
      const Lmod = await import('leaflet');
      if (destroyed || !mapRef.current) return;
      const L = Lmod.default || Lmod;

      await import('leaflet/dist/leaflet.css');
      if (destroyed || !mapRef.current) return;

      const map = L.map(mapRef.current, { zoomControl: false }).setView([-1.2921, 36.8219], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([-1.2921, 36.8219], { icon: defaultIcon, draggable: true }).addTo(map);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updateValue(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        updateValue(e.latlng.lat, e.latlng.lng);
      });

      if (destroyed) { map.remove(); return; }

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setMapReady(true);
      updateValue(-1.2921, 36.8219);
    }

    init();

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateValue = async (lat: number, lng: number) => {
    onChange(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddress(data.display_name?.split(',')?.slice(0, 3)?.join(', ') || 'Unknown location');
    } catch { setAddress('Location captured'); }
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]);
        }
        updateValue(latitude, longitude);
        setLocating(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text" value={value} readOnly
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text)] shadow-sm"
          placeholder="Click map or use to set location"
        />
        <button type="button" onClick={locateMe} disabled={locating}
          className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2.5 text-sm hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-50">
          <FiCrosshair size={16} className={locating ? 'animate-spin' : 'text-[var(--text-muted)]'} />
        </button>
      </div>
      {address && <p className="text-xs text-[var(--text-muted)]">{address}</p>}
      <div ref={mapRef} className="h-52 w-full rounded-xl border border-[var(--border)] overflow-hidden" style={{ zIndex: 1 }} />
      {!mapReady && <div className="h-52 w-full rounded-xl bg-[var(--bg-muted)] animate-shimmer" />}
    </div>
  );
}
