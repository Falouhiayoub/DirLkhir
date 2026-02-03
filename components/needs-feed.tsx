'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { WhatsAppShare } from './whatsapp-share';

interface Need {
  id: number;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  status: string;
  created_at: string;
}

interface NeedsFeedProps {
  neighborhood: string;
}

export function NeedsFeed({ neighborhood }: NeedsFeedProps) {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNeeds() {
      try {
        const response = await fetch(`/api/needs?neighborhood=${encodeURIComponent(neighborhood)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch needs');
        }
        const data = await response.json();
        setNeeds(data.needs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching needs');
      } finally {
        setLoading(false);
      }
    }

    fetchNeeds();
  }, [neighborhood]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (needs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No needs posted in {neighborhood} yet</p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      medical: 'bg-red-100 text-red-800',
      food: 'bg-amber-100 text-amber-800',
      shelter: 'bg-blue-100 text-blue-800',
      education: 'bg-green-100 text-green-800',
      household: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-4">
      {needs.map((need) => (
        <Card
          key={need.id}
          className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-primary">{need.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{need.neighborhood}</p>
              </div>
              <Badge variant="outline" className={getCategoryColor(need.category)}>
                {need.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground">{need.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {new Date(need.created_at).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <WhatsAppShare need={need} size="sm" />
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
