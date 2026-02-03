'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Heart, LogOut, Plus, User as UserIcon } from 'lucide-react';

interface User {
  id: number;
  email: string;
  full_name: string;
  neighborhood: string;
  phone?: string;
  bio?: string;
  created_at: string;
}

interface Need {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

interface Helper {
  id: number;
  user_id: number;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [myNeeds, setMyNeeds] = useState<Need[]>([]);
  const [helpingWith, setHelpingWith] = useState<Need[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user
  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch user's needs
        const needsResponse = await fetch(
          `/api/needs?neighborhood=${encodeURIComponent(userData.user.neighborhood)}`
        );
        if (needsResponse.ok) {
          const needsData = await needsResponse.json();
          const userNeeds = needsData.needs.filter((need: Need) => need.user_id === userData.user.id);
          setMyNeeds(userNeeds);
        }
      } catch (error) {
        console.log('[v0] Error fetching dashboard data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your community needs and help</p>
          </div>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-primary" />
              {user.full_name}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Neighborhood</p>
                <p className="font-semibold text-lg">{user.neighborhood}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-lg">{user.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* My Needs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">My Needs</h2>
              <Link href="/needs/create">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Need
                </Button>
              </Link>
            </div>

            {myNeeds.length === 0 ? (
              <Card className="border-muted">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No needs posted yet</p>
                  <Link href="/needs/create">
                    <Button variant="link" className="text-primary">
                      Post your first need
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myNeeds.map((need) => (
                  <Card key={need.id} className="border-primary/20 hover:border-primary/40 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-primary">{need.title}</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {need.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {need.category} • {new Date(need.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground line-clamp-2">{need.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Helping With Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Helping With</h2>

            <Card className="border-muted">
              <CardContent className="pt-6 text-center">
                <Heart className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">You haven't helped anyone yet</p>
                <Link href="/">
                  <Button variant="link" className="text-primary">
                    Browse community needs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Active Needs', value: myNeeds.filter((n) => n.status === 'open').length },
            { label: 'Total Needs Posted', value: myNeeds.length },
            { label: 'People Helped', value: 0 },
          ].map((stat, i) => (
            <Card key={i} className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-primary mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
