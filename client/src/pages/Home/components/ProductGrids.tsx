import { useEffect, useState } from "react";
import { useProductStore } from "../../../store/productStore";
import type { Property } from "../../../store/productStore";
import PropertyCard from "../../../components/properties/PropertyCard";


export default function ProductGrid() {
  const { products, fetchProducts, loading, error } = useProductStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Detect screen size and update on resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (loading) {
    return (
      <section className="py-16 text-center">
        <span className="loading loading-spinner loading-lg bg-primary-blue"></span>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-500">
        Failed to load properties: {error}
      </section>
    );
  }

  // Limit properties: 6 on mobile, 9 on desktop
  const maxProperties = isMobile ? 6 : 9;
  const displayedProducts = products.slice(0, maxProperties);

  return (
    <section className="bg-gray-200 py-8 px-8 text-center">
      <h2 className="text-2xl font-head font-bold mb-8">Top Listings You’ll Love</h2>

      {displayedProducts.length === 0 ? (
        <p>No properties available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedProducts.map((p: Property) => (
            <PropertyCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}
