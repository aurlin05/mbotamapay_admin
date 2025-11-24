'use client';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { TransactionChart } from '@/components/dashboard/TransactionChart';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { DashboardSettingsDialog } from '@/components/dashboard/DashboardSettingsDialog';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/FadeIn';
import { useStats } from '@/lib/hooks/use-stats';
import { useDashboardSettings, CardId } from '@/lib/hooks/use-dashboard-settings';
import { formatCurrency } from '@/lib/utils';
import { Users, UserCheck, ArrowRightLeft, Wallet, RefreshCw, Settings } from 'lucide-react';
import { toast } from '@/lib/utils/toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

// Sortable card wrapper component
interface SortableStatsCardProps {
  id: string;
  children: (props: {
    dragHandleProps: ReturnType<typeof useSortable>['listeners'];
    isDragging: boolean;
    onHide?: () => void;
  }) => React.ReactElement;
  onHide?: () => void;
}

function SortableStatsCard({ id, children, onHide }: SortableStatsCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ dragHandleProps: listeners, isDragging, onHide })}
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = useStats();
  const {
    settings,
    isLoaded,
    reorderCards,
    hideCard,
    visibleCards,
  } = useDashboardSettings();
  const [showSettings, setShowSettings] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Statistics refreshed successfully');
    } catch {
      toast.error('Failed to refresh statistics');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = settings.cardOrder.indexOf(active.id as CardId);
      const newIndex = settings.cardOrder.indexOf(over.id as CardId);

      const newOrder = arrayMove(settings.cardOrder, oldIndex, newIndex);
      reorderCards(newOrder);
    }
  };

  const handleHideCard = (cardId: CardId) => {
    hideCard(cardId);
    toast.success('Card hidden. Use settings to show it again.');
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the MbotamaPay Admin Dashboard
            </p>
          </div>
        </header>

        <div 
          className="rounded-lg border border-destructive bg-destructive/10 p-6"
          role="alert"
          aria-live="polite"
        >
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load statistics
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An error occurred while loading statistics'}
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Card configuration
  const cardConfig: Record<
    CardId,
    {
      title: string;
      value: string | number;
      icon: typeof Users;
    }
  > = {
    'total-users': {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
    },
    'active-users': {
      title: 'Active Users',
      value: stats?.activeUsers ?? 0,
      icon: UserCheck,
    },
    'total-transactions': {
      title: 'Total Transactions',
      value: stats?.totalTransactions ?? 0,
      icon: ArrowRightLeft,
    },
    'total-volume': {
      title: 'Total Volume',
      value: stats?.totalVolume ? formatCurrency(stats.totalVolume) : '0 XAF',
      icon: Wallet,
    },
  };

  const visible = isLoaded ? visibleCards() : settings.cardOrder;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the MbotamaPay Admin Dashboard
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Dashboard actions">
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            aria-label="Open dashboard settings"
          >
            <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
            Settings
          </Button>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            aria-label="Refresh statistics"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </header>

      <DashboardSettingsDialog open={showSettings} onOpenChange={setShowSettings} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visible} strategy={rectSortingStrategy}>
          <section 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            aria-label="Platform statistics"
          >
            {visible.map((cardId) => {
              const config = cardConfig[cardId];
              return (
                <SortableStatsCard
                  key={cardId}
                  id={cardId}
                  onHide={() => handleHideCard(cardId)}
                >
                  {({ dragHandleProps, isDragging, onHide }) => (
                    <StatsCard
                      title={config.title}
                      value={config.value}
                      icon={config.icon}
                      isLoading={isLoading}
                      isDragging={isDragging}
                      dragHandleProps={dragHandleProps}
                      onHide={onHide}
                    />
                  )}
                </SortableStatsCard>
              );
            })}
          </section>
        </SortableContext>
      </DndContext>

      <section 
        className="grid gap-4 md:grid-cols-1 lg:grid-cols-2"
        aria-label="Transaction analytics"
      >
        {isLoading ? (
          <>
            <TransactionChart data={undefined} isLoading={true} />
            <StatusChart data={undefined} isLoading={true} />
          </>
        ) : (
          <>
            <FadeIn delay={0.1}>
              <TransactionChart
                data={stats?.transactionsByDay}
                isLoading={false}
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <StatusChart
                data={stats?.transactionsByStatus}
                isLoading={false}
              />
            </FadeIn>
          </>
        )}
      </section>
    </div>
  );
}
