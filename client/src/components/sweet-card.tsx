import { ShoppingCart, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Sweet, Category } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet) => void;
  isPurchasing?: boolean;
}

function getCategoryLabel(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.label || category;
}

function getStockStatus(quantity: number): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (quantity === 0) {
    return { label: "Out of Stock", variant: "destructive" };
  }
  if (quantity <= 5) {
    return { label: `Low Stock (${quantity})`, variant: "secondary" };
  }
  return { label: `In Stock (${quantity})`, variant: "default" };
}

export function SweetCard({ sweet, onPurchase, isPurchasing }: SweetCardProps) {
  const stockStatus = getStockStatus(sweet.quantity);
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="overflow-hidden flex flex-col h-full" data-testid={`card-sweet-${sweet.id}`}>
      <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground/50" />
        )}
        <Badge
          variant={stockStatus.variant}
          className="absolute top-2 right-2"
          data-testid={`badge-stock-${sweet.id}`}
        >
          {stockStatus.label}
        </Badge>
      </div>
      <CardContent className="flex-1 p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight" data-testid={`text-sweet-name-${sweet.id}`}>
            {sweet.name}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {getCategoryLabel(sweet.category as Category)}
          </Badge>
        </div>
        {sweet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sweet.description}
          </p>
        )}
        <p className="text-xl font-bold text-primary" data-testid={`text-price-${sweet.id}`}>
          ${parseFloat(sweet.price).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onPurchase(sweet)}
          disabled={isOutOfStock || isPurchasing}
          data-testid={`button-purchase-${sweet.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isPurchasing ? "Purchasing..." : isOutOfStock ? "Out of Stock" : "Purchase"}
        </Button>
      </CardFooter>
    </Card>
  );
}
