import { Card, CardFooter, Skeleton } from "@nextui-org/react";

export default function VideoCardSkeleton(): JSX.Element {
  return (
    <div className="p-2 w-full md:w-[33%] xl:w-[20%]">
      <Card>
        <Skeleton className="rounded-lg">
          <div className="h-28 rounded-lg bg-default-300" />
        </Skeleton>
        <CardFooter className="bottom-0 p-0 z-10 my-2">
          <div className="flex flex-col w-full px-1">
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-3/5 rounded-lg mt-1">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg mt-1">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
