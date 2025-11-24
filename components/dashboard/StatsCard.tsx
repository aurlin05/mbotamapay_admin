import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LucideIcon, GripVertical, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onHide?: () => void;
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      title,
      value,
      icon: Icon,
      trend,
      isLoading,
      className,
      isDragging,
      dragHandleProps,
      onHide,
      ...props
    },
    ref
  ) => {
    if (isLoading) {
      return (
        <Card className={className} ref={ref} {...props}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
            {trend && <Skeleton className="mt-2 h-3 w-20" />}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all duration-200',
          isDragging && 'opacity-50 shadow-lg scale-105',
          className
        )}
        role="article"
        aria-label={`${title}: ${value}`}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2 flex-1">
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="cursor-grab active:cursor-grabbing touch-none"
                role="button"
                aria-label={`Drag to reorder ${title} card`}
                tabIndex={0}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" aria-hidden="true" />
              </div>
            )}
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            {onHide && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onHide}
                aria-label={`Hide ${title} card`}
              >
                <EyeOff className="h-3 w-3" aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" aria-live="polite">{value}</div>
          {trend && (
            <p
              className={cn(
                'text-xs mt-2',
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
              aria-label={`Trend: ${trend.isPositive ? 'up' : 'down'} ${Math.abs(trend.value)} percent`}
            >
              <span aria-hidden="true">
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
);

StatsCard.displayName = 'StatsCard';
