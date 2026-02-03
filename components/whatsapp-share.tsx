'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { shareNeedViaWhatsApp, shareNeedViaWhatsAppDirect } from '@/lib/whatsapp';
import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Need {
  id: number;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
}

interface WhatsAppShareProps {
  need: Need;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function WhatsAppShare({ need, variant = 'outline', size = 'default' }: WhatsAppShareProps) {
  const [showDirectModal, setShowDirectModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleDirectMessage = () => {
    if (!phoneNumber) return;
    shareNeedViaWhatsAppDirect(phoneNumber, need);
    setPhoneNumber('');
    setShowDirectModal(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => shareNeedViaWhatsApp(need)}
            className="cursor-pointer flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDirectModal(true)}
            className="cursor-pointer flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Message Someone
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Direct Message Dialog */}
      <Dialog open={showDirectModal} onOpenChange={setShowDirectModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Send via WhatsApp</DialogTitle>
            <DialogDescription>
              Enter a phone number to send this need directly
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="+212 6XX XXX XXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-primary/20 focus-visible:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Include country code (e.g., +212 for Morocco)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDirectMessage}
                disabled={!phoneNumber}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDirectModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
