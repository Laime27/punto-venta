import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EmpresaSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-44 w-44 rounded-lg" />
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, indice) => (
              <div key={indice} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
