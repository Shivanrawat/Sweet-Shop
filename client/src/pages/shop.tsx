import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { SweetCard } from "@/components/sweet-card";
import { SearchFilters } from "@/components/search-filters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Sweet, Category } from "@shared/schema";

function SweetCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-1/3" />
      </div>
      <div className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function Shop() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // FIX: Removed <Sweet[]> generic and added explicit queryFn
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/sweets"],
    queryFn: async () => await apiRequest("GET", "/api/sweets"),
    enabled: !!token,
  });

  // FIX: Cast data to Sweet[]
  const sweets = data as Sweet[] | undefined;

  const maxPrice = useMemo(() => {
    if (!sweets || sweets.length === 0) return 100;
    return Math.ceil(Math.max(...sweets.map((s) => parseFloat(s.price))));
  }, [sweets]);

  const filteredSweets = useMemo(() => {
    if (!sweets) return [];

    return sweets.filter((sweet) => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 ||
        selectedCategories.includes(sweet.category as Category);

      const price = parseFloat(sweet.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [sweets, searchQuery, selectedCategories, priceRange]);

  const purchaseMutation = useMutation({
    mutationFn: async (sweet: Sweet) => {
      return apiRequest("POST", `/api/sweets/${sweet.id}/purchase`, { quantity: 1 });
    },
    onSuccess: (_: unknown, sweet: Sweet) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweets"] });
      toast({
      title: "Purchase successful!",
      description: `You bought 1x ${sweet.name}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Could not complete purchase",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setPurchasingId(null);
    },
  });

  const handlePurchase = (sweet: Sweet) => {
    setPurchasingId(sweet.id);
    purchaseMutation.mutate(sweet);
  };

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
  };

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

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="container px-4 md:px-8 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sweet Collection</h1>
          <p className="text-muted-foreground">
            Browse our delicious selection of sweets and treats
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={maxPrice}
              onClearFilters={handleClearFilters}
            />
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SweetCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredSweets.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sweets found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategories.length > 0
                    ? "Try adjusting your search or filters"
                    : "Check back soon for new treats!"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {filteredSweets.length} {filteredSweets.length === 1 ? "sweet" : "sweets"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSweets.map((sweet) => (
                    <SweetCard
                      key={sweet.id}
                      sweet={sweet}
                      onPurchase={handlePurchase}
                      isPurchasing={purchasingId === sweet.id}
                    />
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}