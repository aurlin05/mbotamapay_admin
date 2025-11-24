import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * ChartSkeleton component provides a loading state that matches chart layout
 * Includes smooth transitions for better UX
 */
export function ChartSkeleton() {
  return (
    <Card className="transition-opacity duration-200">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Chart bars/lines simulation */}
          <div className="flex items-end gap-2 h-48">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1"
                style={{
                  height: `${Math.random() * 60 + 40}%`,
                }}
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-12" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
