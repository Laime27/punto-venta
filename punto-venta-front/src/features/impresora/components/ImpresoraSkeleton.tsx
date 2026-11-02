import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ImpresoraSkeleton() {
  return (
    <Card className="max-w-2xl">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-5 w-64" />
        {Array.from({ length: 2 }).map((_, indice) => (
          <div key={indice} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between border-t pt-6">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-48" />
      </CardFooter>
    </Card>
  );
}
