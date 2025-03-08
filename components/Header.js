import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { normalizeUserData, getDisplayName } from "@/app/lib/userUtils";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      // Normalize user data to ensure both apartment and discord_name are available
      setUser(normalizeUserData(JSON.parse(storedUser)));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Vipe
        </Link>
        
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/create">
                <Button variant="outline">Create Post</Button>
              </Link>
              <span className="text-sm text-gray-600">
                {user.username} <span title="Discord">{getDisplayName(user)}</span>
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