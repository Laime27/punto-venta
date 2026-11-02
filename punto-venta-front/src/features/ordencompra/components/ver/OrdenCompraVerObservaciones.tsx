import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  observaciones?: string | null;
}

export function OrdenCompraVerObservaciones({ observaciones }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Observaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-md text-sm text-foreground">
          {observaciones ? (
            <p className="whitespace-pre-wrap">{observaciones}</p>
          ) : (
            <p className="text-muted-foreground italic">Sin observaciones agregadas.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
