import { useEffect, useState } from "react";
import { useProductStore } from "../../../store/productStore";
import type { Property } from "../../../store/productStore";
import PropertyCard from "../../../sharedComponents/properties/PropertyCard";

// Custom hook to detect mobile screen size (safe for SSR and reactive)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Initial check (only runs client-side)
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile(); // Run once on mount

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default function ProductGrid() {
  const isMobile = useIsMobile();
  const { products, fetchProducts, loading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <span className="loading loading-spinner loading-lg bg-primary-blue"></span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center text-red-500">
        Failed to load properties: {error}
      </section>
    );
  }

  // Responsively show 6 items on mobile, 9 on desktop
  const displayedProducts = products.slice(0, isMobile ? 10 : 18);

  return (
    <section className="bg-gray-200 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-head font-bold mb-12 text-gray-800">
          Top Listings You’ll Love
        </h2>

        {displayedProducts.length === 0 ? (
          <p className="text-gray-500 text-lg">No properties available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {displayedProducts.map((p: Property) => (
              <PropertyCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}