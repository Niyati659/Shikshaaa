'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRole } from '@/components/providers/RoleProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function NGOAuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: '',
    contactPerson: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { setRole } = useRole();
  const { theme, toggleTheme } = useTheme();

  // If already logged in, redirect to dashboard (skip sign-in page)
  React.useEffect(() => {
    const ngo = sessionStorage.getItem('currentNGO');
    if (ngo) {
      router.push('/ngo/dashboard');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      // Mock login - check sessionStorage for registered NGO
      const ngoUsers = JSON.parse(sessionStorage.getItem('ngoUsers') || '[]');
      const user = ngoUsers.find((u: any) => u.email === formData.email && u.password === formData.password);

      if (user) {
        sessionStorage.setItem('currentNGO', JSON.stringify(user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/ngo/dashboard');
        }, 1000);
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Signup logic
      if (!formData.email || !formData.password || !formData.organizationName || !formData.contactPerson || !formData.phone) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Mock signup - save to sessionStorage
      const ngoUsers = JSON.parse(sessionStorage.getItem('ngoUsers') || '[]');
      
      if (ngoUsers.find((u: any) => u.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      const newNGO = {
        id: `NGO-${Date.now()}`,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        organizationName: formData.organizationName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        registrationDate: new Date().toISOString(),
        profileComplete: false,
      };

      ngoUsers.push(newNGO);
      sessionStorage.setItem('ngoUsers', JSON.stringify(ngoUsers));
      sessionStorage.setItem('currentNGO', JSON.stringify(newNGO));

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/ngo/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Gradient Header */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary via-accent to-background" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={toggleTheme}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </Button>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={() => router.push('/')}
          size="sm"
          className="bg-card text-foreground hover:bg-card/80 border border-border"
        >
          ← Back
        </Button>
      </div>

      {/* Auth Form */}
      <div className="max-w-md w-full relative z-10 pt-20">
        <div className="bg-card rounded-2xl border-2 border-primary/30 p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center text-foreground mb-2">
            {isLogin ? 'NGO Login' : 'NGO Signup'}
          </h1>
          <p className="text-center text-foreground/70 mb-8 text-sm">
            {isLogin ? 'Access your NGO dashboard' : 'Join us in making a difference'}
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 border border-success/50 text-success px-4 py-3 rounded-lg mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Your NGO name"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2 rounded-lg mt-6"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-foreground/70 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFormData({
                    email: '',
                    password: '',
                    organizationName: '',
                    contactPerson: '',
                    phone: '',
                  });
                }}
                className="text-accent font-semibold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
