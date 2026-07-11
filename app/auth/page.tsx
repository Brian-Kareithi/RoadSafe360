'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff, FiChevronRight } from 'react-icons/fi';
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-100/30 via-transparent to-transparent dark:from-red-950/10 pointer-events-none" />

      <div className="relative mb-8 flex items-center gap-3 animate-fade-in">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#BB2020] to-[#8B0000] text-white shadow-lg shadow-red-900/20">
          <FiShield size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RoadSafe360</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Driver Demerit &amp; Road Safety Management</p>
        </div>
      </div>

      <Card className="relative w-full max-w-md animate-fade-in-up shadow-xl border-zinc-200/80 dark:border-zinc-700/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 h-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 h-10" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="kenyan" className="w-full gap-2 h-10" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
              {!submitting && <FiChevronRight size={16} />}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-950">Quick Login</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin', email: 'aisha@roadsafe360.go.ke', password: 'Admin123!', role: 'admin', name: 'Aisha Abubakar' },
                { label: 'Police', email: 'mohammed@roadsafe360.go.ke', password: 'Officer123!', role: 'police', name: 'Mohammed Karshe' },
                { label: 'Driver', email: 'zaahid.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', name: 'Zaahid Abdulmalik' },
                { label: 'Authority', email: 'khalid@roadsafe360.go.ke', password: 'Auth123!', role: 'authority', name: 'Khalid Salad' },
              ].map((item) => (
                <button key={item.email} onClick={() => quickLogin(item)}
                  className="group px-3 py-2.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#BB2020]/30 hover:bg-red-50/50 dark:hover:bg-red-950/20 dark:hover:border-red-800/30 transition-all duration-200 text-left">
                  <span className="block font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#BB2020] dark:group-hover:text-[#FF4444] transition-colors">{item.name}</span>
                  <span className="block text-zinc-400 truncate mt-0.5">{item.role}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="relative mt-8 text-xs text-zinc-400 text-center max-w-xs">
        RoadSafe360 &mdash; Intelligent Driver Demerit &amp; Road Safety Management System
      </p>
    </div>
  );
}
