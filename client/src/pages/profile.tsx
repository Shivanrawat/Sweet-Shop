import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Sweet, Purchase } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

type PurchaseWithSweet = Purchase & { sweet: Sweet };

export default function Profile() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/user/purchases"],
    queryFn: async () => await apiRequest("GET", "/api/user/purchases"),
  });

  // FIX: Cast the data here instead
  const history = data as PurchaseWithSweet[] | undefined;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Loading history...</div>
      ) : !history?.length ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground pb-6">
            No purchases yet. Go buy some sweets!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 rounded bg-muted flex items-center justify-center overflow-hidden">
                    {order.sweet.imageUrl ? (
                      <img 
                        src={order.sweet.imageUrl} 
                        alt={order.sweet.name}
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{order.sweet.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(order.purchasedAt), "PPP p")}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-bold text-lg text-primary">
                    ${order.totalPrice}
                  </div>
                  <div className="mt-1">
                    <Badge variant="secondary">Qty: {order.quantity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}