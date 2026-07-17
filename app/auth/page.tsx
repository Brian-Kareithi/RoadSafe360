'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { FiMail, FiLock, FiEye, FiEyeOff, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [email, setEmail] = useState('aisha@roadsafe360.go.ke');
  const [password, setPassword] = useState('Admin123!');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && profile && !loading) {
      const role = profile.role;
      const path = role === 'admin' ? '/dashboard/admin'
        : role === 'police' ? '/dashboard/police'
        : role === 'driver' ? '/dashboard/driver'
        : role === 'authority' ? '/dashboard/authority'
        : '/dashboard/admin';
      router.replace(path);
    }
  }, [user, profile, loading, router]);

  if (submitting || (user && !loading)) {
    return <SkeletonLoader />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome to RoadSafe360');
      setSubmitting(false);
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      setSubmitting(false);
    }
  };

  const quickLogin = async (creds: { email: string; password: string }) => {
    setSubmitting(true);
    try {
      await login(creds.email, creds.password);
      toast.success('Logged in successfully');
      setSubmitting(false);
    } catch (err: any) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="mb-8 flex items-center gap-3 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-card)] shadow-lg overflow-hidden ring-1 ring-[var(--border)]">
            <img src="/logo.png" alt="RoadSafe360" className="h-full w-full object-contain p-2" />
          </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">RoadSafe360</h1>
          <p className="text-sm text-[var(--text-muted)]">Driver Demerit &amp; Road Safety Management</p>
        </div>
      </div>

      <Card className="relative w-full max-w-md animate-fade-in-up shadow-[var(--shadow-card-hover)]">
        <CardHeader className="pb-5">
          <CardTitle className="text-xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-semibold mb-2 block text-[var(--text)]">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" size={16} />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-11" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-[var(--text)]">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)]" size={16} />
                <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="pl-11 pr-11" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--text-muted)] transition-colors">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="default" className="w-full gap-2 h-12 text-base" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
              {!submitting && <FiChevronRight size={16} />}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">Quick Login</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Admin', email: 'aisha@roadsafe360.go.ke', password: 'Admin123!', role: 'admin', name: 'Aisha Abubakar' },
                { label: 'Police', email: 'mohammed@roadsafe360.go.ke', password: 'Officer123!', role: 'police', name: 'Mohammed Karshe' },
                { label: 'Driver', email: 'zaahid.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', name: 'Zaahid Abdulmalik' },
                { label: 'Authority', email: 'khalid@roadsafe360.go.ke', password: 'Auth123!', role: 'authority', name: 'Khalid Salad' },
              ].map((item) => (
                <button key={item.email} onClick={() => quickLogin(item)}
                  className="group px-3 py-3 text-xs font-medium rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/[0.03] transition-all duration-200 text-left">
                  <span className="block font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{item.name}</span>
                  <span className="block text-[var(--text-light)] truncate mt-0.5">{item.role}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-[var(--text-light)] text-center max-w-xs">
        RoadSafe360 &mdash; Intelligent Driver Demerit &amp; Road Safety Management System
      </p>
    </div>
  );
}
