'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/db';
import { Heart, Home, LogOut } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              Dir Khir
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>

            {user && (
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                  <Heart className="w-4 h-4 mr-2" />
                  {user.role === 'admin' ? 'Admin Panel' : 'My Space'}
                </Button>
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {user.full_name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-1 mt-3 pt-3 border-t border-border/20">
          <Link href="/" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full text-foreground hover:text-primary justify-start">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>

          {user && (
            <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full text-foreground hover:text-primary justify-start">
                <Heart className="w-4 h-4 mr-2" />
                {user.role === 'admin' ? 'Admin' : 'My Space'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
