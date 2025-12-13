import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Sweet } from "@shared/schema";

const restockSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

type RestockFormValues = z.infer<typeof restockSchema>;

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
}

export function RestockDialog({ open, onOpenChange, sweet }: RestockDialogProps) {
  const { toast } = useToast();

  const form = useForm<RestockFormValues>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      quantity: 10,
    },
  });

  const restockMutation = useMutation({
    mutationFn: async (data: RestockFormValues) => {
      return apiRequest("POST", `/api/sweets/${sweet!.id}/restock`, data);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweets"] });
      toast({
        title: "Stock updated",
        description: `Added ${data.quantity} units to ${sweet?.name}`,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Restock failed",
        description: error.message || "Could not update stock",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: RestockFormValues) {
    restockMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" />
            Restock
          </DialogTitle>
          <DialogDescription>
            Add more units of "{sweet?.name}" to inventory.
            <br />
            Current stock: <strong>{sweet?.quantity || 0}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity to Add</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      data-testid="input-restock-quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-restock"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={restockMutation.isPending}
                data-testid="button-confirm-restock"
              >
                {restockMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Add Stock"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
