'use client';

import { Card, CardBody, Skeleton } from '@heroui/react';

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 animate-pulse">
      {/* 組織ヘッダースケルトン */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-default-50 border border-default-200">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-6 rounded-md" />
            <Skeleton className="w-24 h-4 rounded-md" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-24 h-8 rounded-lg" />
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>
      </div>

      {/* 検索バースケルトン */}
      <div className="max-w-md">
        <Skeleton className="w-full h-10 rounded-xl" />
      </div>

      {/* アコーディオン・カードスケルトン */}
      <div className="space-y-4">
        {[1, 2, 3].map((groupIndex) => (
          <div
            key={groupIndex}
            className="border border-default-200 rounded-xl p-4 space-y-4 bg-background"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-40 h-6 rounded-md" />
              <Skeleton className="w-12 h-5 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((cardIndex) => (
                <Card key={cardIndex} className="border border-default-200 p-3">
                  <CardBody className="p-0 flex flex-row gap-3">
                    <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-28 h-4 rounded-md" />
                      <Skeleton className="w-16 h-3 rounded-md" />
                      <Skeleton className="w-20 h-3 rounded-md" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
