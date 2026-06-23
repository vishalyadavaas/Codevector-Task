const categoryAccent = {
  Electronics: "from-sky-500 to-cyan-400",
  Books: "from-violet-500 to-fuchsia-400",
  Clothing: "from-rose-500 to-pink-400",
  Home: "from-emerald-500 to-teal-400",
  Toys: "from-amber-500 to-yellow-300",
  Sports: "from-lime-500 to-green-400",
  Beauty: "from-red-400 to-orange-300",
  Automotive: "from-zinc-600 to-slate-400",
  Garden: "from-green-600 to-emerald-300",
  Health: "from-blue-500 to-indigo-400",
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  const accent = categoryAccent[product.category] ?? "from-zinc-500 to-neutral-300";

  return (
    <article className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />

      <div className="mb-8 flex items-start justify-between gap-4">
        <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          {product.category}
        </span>
        <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${accent} opacity-90 shadow-sm transition group-hover:scale-105`} />
      </div>

      <h2 className="line-clamp-2 min-h-14 text-xl font-semibold leading-7 text-zinc-950">
        {product.name}
      </h2>

      <div className="mt-8 flex items-end justify-between border-t border-zinc-100 pt-4">
        <span className="text-sm font-medium text-zinc-500">Price</span>
        <strong className="text-2xl font-bold text-zinc-950">
          {priceFormatter.format(product.price)}
        </strong>
      </div>
    </article>
  );
}
