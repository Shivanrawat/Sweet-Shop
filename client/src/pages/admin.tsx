import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  PackagePlus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SweetFormDialog } from "@/components/sweet-form-dialog";
import { RestockDialog } from "@/components/restock-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Sweet, Category } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

function getCategoryLabel(category: Category): string {
  return CATEGORIES.find((c) => c.value === category)?.label || category;
}

function getStockBadge(quantity: number) {
  if (quantity === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (quantity <= 5) {
    return <Badge variant="secondary">Low Stock ({quantity})</Badge>;
  }
  return <Badge variant="default">{quantity} in stock</Badge>;
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const { token, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [deletingSweet, setDeletingSweet] = useState<Sweet | null>(null);
  const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);

  const { data: sweets, isLoading, error } = useQuery<Sweet[]>({
    queryKey: ["/api/sweets"],
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/sweets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweets"] });
      toast({
        title: "Sweet deleted",
        description: "The sweet has been removed from inventory",
      });
      setDeletingSweet(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete sweet",
        variant: "destructive",
      });
    },
  });

  if (!isAdmin) {
    return (
      <div className="container px-4 md:px-8 py-8 mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 md:px-8 py-8 mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load sweets. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalSweets = sweets?.length || 0;
  const totalStock = sweets?.reduce((sum, s) => sum + s.quantity, 0) || 0;
  const lowStockCount = sweets?.filter((s) => s.quantity > 0 && s.quantity <= 5).length || 0;
  const outOfStockCount = sweets?.filter((s) => s.quantity === 0).length || 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="container px-4 md:px-8 py-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your sweet shop inventory
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} data-testid="button-add-sweet">
            <Plus className="h-4 w-4 mr-2" />
            Add Sweet
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid="stat-total-products">
                {isLoading ? <Skeleton className="h-8 w-12" /> : totalSweets}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid="stat-total-stock">
                {isLoading ? <Skeleton className="h-8 w-16" /> : totalStock}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-500" data-testid="stat-low-stock">
                {isLoading ? <Skeleton className="h-8 w-8" /> : lowStockCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive" data-testid="stat-out-of-stock">
                {isLoading ? <Skeleton className="h-8 w-8" /> : outOfStockCount}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : !sweets || sweets.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sweets yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first sweet to the inventory
                </p>
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sweet
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sweets.map((sweet) => (
                      <TableRow key={sweet.id} data-testid={`row-sweet-${sweet.id}`}>
                        <TableCell>
                          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {sweet.imageUrl ? (
                              <img
                                src={sweet.imageUrl}
                                alt={sweet.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground/50" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{sweet.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getCategoryLabel(sweet.category as Category)}
                          </Badge>
                        </TableCell>
                        <TableCell>${parseFloat(sweet.price).toFixed(2)}</TableCell>
                        <TableCell>{getStockBadge(sweet.quantity)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setRestockingSweet(sweet)}
                              data-testid={`button-restock-${sweet.id}`}
                            >
                              <PackagePlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingSweet(sweet);
                                setIsFormOpen(true);
                              }}
                              data-testid={`button-edit-${sweet.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingSweet(sweet)}
                              data-testid={`button-delete-${sweet.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SweetFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingSweet(null);
        }}
        sweet={editingSweet}
      />

      <RestockDialog
        open={!!restockingSweet}
        onOpenChange={(open) => !open && setRestockingSweet(null)}
        sweet={restockingSweet}
      />

      <AlertDialog open={!!deletingSweet} onOpenChange={(open) => !open && setDeletingSweet(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sweet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSweet?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSweet && deleteMutation.mutate(deletingSweet.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
