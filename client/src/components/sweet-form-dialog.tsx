import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Sweet } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

const sweetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.enum([
    "chocolates",
    "gummies",
    "hard_candies",
    "lollipops",
    "caramels",
    "jellies",
    "licorice",
    "mints",
  ]),
  price: z.string().regex(/^\d+\.?\d{0,2}$/, "Invalid price format"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type SweetFormValues = z.infer<typeof sweetFormSchema>;

interface SweetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
}

export function SweetFormDialog({ open, onOpenChange, sweet }: SweetFormDialogProps) {
  const { toast } = useToast();
  const isEditing = !!sweet;

  const form = useForm<SweetFormValues>({
    resolver: zodResolver(sweetFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "chocolates",
      price: "",
      quantity: 0,
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (sweet) {
      form.reset({
        name: sweet.name,
        description: sweet.description || "",
        category: sweet.category as SweetFormValues["category"],
        price: sweet.price,
        quantity: sweet.quantity,
        imageUrl: sweet.imageUrl || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "chocolates",
        price: "",
        quantity: 0,
        imageUrl: "",
      });
    }
  }, [sweet, form]);

  const createMutation = useMutation({
    mutationFn: async (data: SweetFormValues) => {
      return apiRequest("POST", "/api/sweets", {
        ...data,
        imageUrl: data.imageUrl || null,
        description: data.description || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweets"] });
      toast({
        title: "Sweet added",
        description: "The new sweet has been added to inventory",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add sweet",
        description: error.message || "Could not add sweet",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SweetFormValues) => {
      return apiRequest("PUT", `/api/sweets/${sweet!.id}`, {
        ...data,
        imageUrl: data.imageUrl || null,
        description: data.description || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweets"] });
      toast({
        title: "Sweet updated",
        description: "The sweet has been updated",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update sweet",
        description: error.message || "Could not update sweet",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: SweetFormValues) {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Sweet" : "Add New Sweet"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Dark Chocolate Truffles"
                      data-testid="input-sweet-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this sweet..."
                      className="resize-none"
                      data-testid="input-sweet-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0.00"
                        data-testid="input-sweet-price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      data-testid="input-sweet-quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      data-testid="input-sweet-image"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-form"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} data-testid="button-submit-sweet">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : isEditing ? (
                  "Update Sweet"
                ) : (
                  "Add Sweet"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
