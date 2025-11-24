import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CardId, useDashboardSettings } from '@/lib/hooks/use-dashboard-settings';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { toast } from '@/lib/utils/toast';
import { useState } from 'react';

interface DashboardSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CARD_LABELS: Record<CardId, string> = {
  'total-users': 'Total Users',
  'active-users': 'Active Users',
  'total-transactions': 'Total Transactions',
  'total-volume': 'Total Volume',
};

export function DashboardSettingsDialog({
  open,
  onOpenChange,
}: DashboardSettingsDialogProps) {
  const { settings, toggleCardVisibility, resetToDefaults, isCardVisible } =
    useDashboardSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggleCard = (cardId: CardId) => {
    toggleCardVisibility(cardId);
    const isNowVisible = !isCardVisible(cardId);
    toast.success(
      isNowVisible
        ? `${CARD_LABELS[cardId]} card shown`
        : `${CARD_LABELS[cardId]} card hidden`
    );
  };

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    resetToDefaults();
    setShowResetConfirm(false);
    toast.success('Dashboard layout reset to defaults');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Customize which cards are visible on your dashboard. You can also drag cards to
            reorder them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Card Visibility</Label>
            <div className="space-y-2">
              {settings.cardOrder.map((cardId) => {
                const visible = isCardVisible(cardId);
                return (
                  <div
                    key={cardId}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{CARD_LABELS[cardId]}</span>
                    <Button
                      variant={visible ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleCard(cardId)}
                      className="gap-2"
                    >
                      {visible ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Hidden
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant={showResetConfirm ? 'destructive' : 'outline'}
              onClick={handleReset}
              className="w-full gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {showResetConfirm ? 'Click again to confirm reset' : 'Reset to Defaults'}
            </Button>
            {showResetConfirm && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This will restore the default card order and visibility
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
