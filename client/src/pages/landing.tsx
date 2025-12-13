import { Link } from "wouter";
import { ArrowRight, Candy, Star, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import heroImage from "@assets/generated_images/sweet_shop_candy_display.png";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Colorful candy display"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Candy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome to Sweet Shop
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto">
            Discover our delightful collection of handcrafted sweets, artisan chocolates, and classic candies from around the world.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/shop">
                <Button size="lg" className="min-w-[180px]" data-testid="button-shop-now">
                  Browse Sweets
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="min-w-[180px]" data-testid="button-get-started">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="min-w-[180px] bg-white/10 border-white/30 text-white backdrop-blur-sm"
                    data-testid="button-sign-in"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Sweet Shop?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're passionate about bringing joy through the finest confectionery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every sweet is carefully selected for exceptional taste and quality
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Checkout</h3>
              <p className="text-muted-foreground">
                Quick and easy purchasing with instant inventory updates
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data and transactions are protected with industry-standard security
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-card border-t">
        <div className="container px-4 md:px-8 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Satisfy Your Sweet Tooth?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of happy customers enjoying our sweet collection
          </p>
          {user ? (
            <Link href="/shop">
              <Button size="lg" data-testid="button-explore-collection">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button size="lg" data-testid="button-create-account">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <footer className="py-8 border-t bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Candy className="h-5 w-5 text-primary" />
              <span className="font-semibold">Sweet Shop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for sweet lovers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
