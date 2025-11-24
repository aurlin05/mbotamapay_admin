import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * TableSkeleton component provides a loading state that matches table layout
 * Includes smooth transitions for better UX
 */
export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <Card className="transition-opacity duration-200">
      <div className="p-4 space-y-4">
        {/* Search and filter bar */}
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Table header */}
        <div className="flex gap-4 pb-2 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-3">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </Card>
  );
}
