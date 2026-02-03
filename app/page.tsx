import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { NeedsFeed } from '@/components/needs-feed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Heart, Users, MapPin, Zap } from 'lucide-react';

export const metadata = {
  title: 'Dir-Khir - Community Aid Platform',
  description: 'Coordinating neighborhood mutual aid across Morocco',
};

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Moroccan Zellig Pattern */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Content */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  <span className="block">Entraide de</span>
                  <span className="block text-primary">Quartier</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Connect with your neighbors and build stronger communities through mutual support and collaboration.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {user ? (
                  <>
                    <Link href="/needs/create">
                      <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        <Heart className="w-5 h-5 mr-2" />
                        Post a Need
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" size="lg">
                        <Users className="w-5 h-5 mr-2" />
                        My Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="outline" size="lg">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Moroccan Zellig Pattern Decoration */}
            <div className="relative hidden md:flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-24 h-24 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-colors ${
                      i % 3 === 0
                        ? 'border-primary bg-primary/10 text-primary'
                        : i % 3 === 1
                          ? 'border-secondary bg-secondary/10 text-secondary'
                          : 'border-accent bg-accent/10 text-accent'
                    }`}
                  >
                    ◆
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Dir-Khir?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: 'Community Care',
                description: 'Connect with neighbors who genuinely want to help and support each other.',
              },
              {
                icon: MapPin,
                title: 'Local Focus',
                description: 'Find help and helpers in your neighborhood, strengthening local bonds.',
              },
              {
                icon: Zap,
                title: 'Quick & Easy',
                description: 'Post needs and find helpers quickly through our simple interface.',
              },
            ].map((feature, i) => (
              <Card key={i} className="border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Needs Feed Section */}
      {user && (
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-primary">
                  Needs in {user.neighborhood}
                </h2>
                <p className="text-muted-foreground">
                  See how your community is helping each other
                </p>
              </div>
              <NeedsFeed neighborhood={user.neighborhood} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section for Non-Logged In Users */}
      {!user && (
        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Join Your Community Today</CardTitle>
                <CardDescription className="text-base mt-2">
                  Be part of the mutual aid movement in your neighborhood
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </main>
  );
}
