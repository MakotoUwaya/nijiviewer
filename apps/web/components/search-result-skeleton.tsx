import { Card, CardBody, Skeleton } from "@heroui/react";

export function SearchResultSkeleton() {
  return (
    <Card>
      <CardBody>
        <div className="flex gap-4">
          <div className="w-24 h-24">
            <Skeleton className="rounded-lg w-full h-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="w-3/4 h-6 rounded-lg mb-2" />
            <Skeleton className="w-1/2 h-4 rounded-lg" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function SearchResultSkeletonList() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 5 }).map((_, _i) => (
        <SearchResultSkeleton key={`skeleton-${crypto.randomUUID()}`} />
      ))}
    </div>
  );
}
