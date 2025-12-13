import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORIES, type Category } from "@shared/schema";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onClearFilters,
}: SearchFiltersProps) {
  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Categories</Label>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category.value} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category.value}`}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => onCategoryToggle(category.value)}
                data-testid={`checkbox-category-${category.value}`}
              />
              <label
                htmlFor={`category-${category.value}`}
                className="text-sm cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={maxPrice}
            min={0}
            step={0.5}
            className="w-full"
            data-testid="slider-price-range"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0].toFixed(2)}</span>
          <span>${priceRange[1].toFixed(2)}</span>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" data-testid="button-filters-mobile">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:text-foreground"
                data-testid="button-clear-search"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {CATEGORIES.find((c) => c.value === category)?.label}
              <button
                onClick={() => onCategoryToggle(category)}
                className="ml-1 hover:text-foreground"
                data-testid={`button-remove-category-${category}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <Badge variant="secondary" className="gap-1">
              ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
            </Badge>
          )}
        </div>
      )}

      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </div>
  );
}
