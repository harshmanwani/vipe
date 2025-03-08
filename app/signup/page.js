"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser, createUser } from '@/app/lib/supabaseData';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    apartment: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Check if username already exists
      const existingUser = await getUser(formData.username);
      
      if (existingUser) {
        setError('Username already exists');
        return;
      }

      // Create new user
      const newUser = await createUser(formData);
      
      if (!newUser) {
        setError('Failed to create user');
        return;
      }
      
      // Store user in localStorage for client-side access
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Apartment Number</label>
                  <Input
                    name="apartment"
                    placeholder="e.g., 4B"
                    value={formData.apartment}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 