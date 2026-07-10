'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [email, setEmail] = useState('zaahid@roadsafe360.go.ke');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#BB2020] text-white shadow-sm">
          <FiShield size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">RoadSafe360</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Driver Demerit & Road Safety Management</p>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-zinc-400 mb-3 text-center">Quick Login</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin', email: 'zaahid@roadsafe360.go.ke', password: 'Admin123!', role: 'admin', name: 'Zaahid Abdulmalik' },
                { label: 'Driver', email: 'zaahid.driver@roadsafe360.go.ke', password: 'Driver123!', role: 'driver', name: 'Zaahid (Driver)' },
                { label: 'Authority', email: 'khalid@roadsafe360.go.ke', password: 'Auth123!', role: 'authority', name: 'Khalid Salad' },
                { label: 'Police', email: 'aisha@roadsafe360.go.ke', password: 'Officer123!', role: 'police', name: 'Aisha Abubakar' },
              ].map((item) => (
                <button key={item.email} onClick={() => quickLogin(item)}
                  className="px-3 py-2 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="block text-zinc-400 truncate">{item.role}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
