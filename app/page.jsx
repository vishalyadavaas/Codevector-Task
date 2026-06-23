"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./components/ProductCard";

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Toys",
  "Sports",
  "Beauty",
  "Automotive",
  "Garden",
  "Health",
];

const pageSize = 12;

function ProductSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="h-1 w-24 rounded-full bg-zinc-200" />
      <div className="mt-7 flex items-start justify-between">
        <div className="h-7 w-28 rounded-md bg-zinc-200" />
        <div className="h-10 w-10 rounded-lg bg-zinc-200" />
      </div>
      <div className="mt-10 h-6 w-4/5 rounded bg-zinc-200" />
      <div className="mt-3 h-6 w-3/5 rounded bg-zinc-200" />
      <div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div className="h-4 w-12 rounded bg-zinc-200" />
        <div className="h-8 w-24 rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const latestRequestRef = useRef(0);

  const fetchProducts = useCallback(
    async ({ mode, category = "", cursor = null, requestId }) => {
      try {
        const params = new URLSearchParams({ limit: String(pageSize) });

        if (category) {
          params.set("category", category);
        }

        if (cursor?.cursorId && cursor?.cursorUpdatedAt) {
          params.set("cursorId", cursor.cursorId);
          params.set("cursorUpdatedAt", cursor.cursorUpdatedAt);
        }

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Unable to fetch products.");
        }

        const data = await response.json();

        if (latestRequestRef.current !== requestId) {
          return;
        }

        const fetchedProducts = Array.isArray(data.products) ? data.products : [];

        setProducts((currentProducts) =>
          mode === "reset" ? fetchedProducts : [...currentProducts, ...fetchedProducts],
        );
        setNextCursor(data.nextCursor ?? null);
        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        if (latestRequestRef.current === requestId) {
          setError(err.message || "Something went wrong while loading products.");
          setHasMore(false);
        }
      } finally {
        if (latestRequestRef.current === requestId) {
          setIsInitialLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    fetchProducts({ mode: "reset", requestId });
  }, [fetchProducts]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    setSelectedCategory(category);
    setProducts([]);
    setNextCursor(null);
    setHasMore(false);
    setError("");
    setIsInitialLoading(true);

    fetchProducts({ mode: "reset", category, requestId });
  };

  const handleLoadMore = () => {
    if (!hasMore || isInitialLoading || isLoadingMore || !nextCursor) {
      return;
    }

    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    setError("");
    setIsLoadingMore(true);

    fetchProducts({
      mode: "append",
      category: selectedCategory,
      cursor: nextCursor,
      requestId,
    });
  };

  const showEmptyState = !isInitialLoading && !error && products.length === 0;
  const canLoadMore = hasMore && !isInitialLoading && !isLoadingMore;

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              Cursor catalog
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
              Products built for fast browsing.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
              Explore the seeded inventory with category filtering and smooth cursor-based loading.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-zinc-700">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              disabled={isInitialLoading}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        {isInitialLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: pageSize }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!isInitialLoading && products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : null}

        {showEmptyState ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              No results
            </p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-950">No products found</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
              Try another category or clear the filter to browse the full catalog.
            </p>
          </div>
        ) : null}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={!canLoadMore}
            className="inline-flex h-12 min-w-40 items-center justify-center rounded-lg bg-zinc-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 disabled:shadow-none"
          >
            {isLoadingMore ? "Loading..." : hasMore ? "Load More" : "No More Products"}
          </button>
        </div>
      </section>
    </main>
  );
}
