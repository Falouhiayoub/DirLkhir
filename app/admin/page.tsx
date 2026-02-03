import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BarChart3, Users, Heart, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard - Dir-Khir',
  description: 'Administration panel for Dir-Khir community aid platform',
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Redirect if not logged in or not admin
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage Dir-Khir platform and community</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">--</div>
              <p className="text-xs text-muted-foreground mt-1">Loading...</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Active Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">--</div>
              <p className="text-xs text-muted-foreground mt-1">Loading...</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Neighborhoods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">--</div>
              <p className="text-xs text-muted-foreground mt-1">Loading...</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pending Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">--</div>
              <p className="text-xs text-muted-foreground mt-1">Loading...</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">User Management</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access comprehensive user management tools including account moderation and role assignments.
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Needs Moderation</CardTitle>
              <CardDescription>Review and moderate community needs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Monitor all posted needs, verify content quality, and take action on inappropriate submissions.
              </p>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Moderate Needs
              </Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">Analytics & Reports</CardTitle>
              <CardDescription>View platform analytics and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate reports on platform usage, community engagement, and neighborhood activity.
              </p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Configure platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage platform configuration, categories, neighborhoods, and general system settings.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Platform Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Welcome, {user.full_name}
            </CardTitle>
            <CardDescription>
              You have admin privileges for the Dir-Khir community platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              As an administrator, you have access to all management tools and can help ensure the platform runs smoothly for all community members. Use your admin dashboard to moderate content, manage users, and maintain platform integrity.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
