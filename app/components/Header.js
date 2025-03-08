"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Vipe
        </Link>
        
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <>
              <Link href="/create">
                <Button variant="outline">Create Post</Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {user.username} ({user.apartment})
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 