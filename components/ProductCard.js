import { findProductById } from '@/lib/catalog';

export default function ProductCard({ productId }) {
  const product = findProductById(productId);
  if (!product) return null;

  return (
    <div className="animate-rise self-start max-w-[85%] bg-paper border border-line rounded-2xl overflow-hidden shadow-sm">
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover object-top" />
      <div className="p-3">
        <p className="text-[11px] uppercase tracking-wide text-slate font-medium">{product.brand}</p>
        <p className="text-[14px] font-medium text-ink leading-snug mt-0.5">{product.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[13px] text-slate line-through">
            ${product.normalPrice.toLocaleString('es-CL')}
          </span>
        </div>
        <p className="text-[12px] text-success font-medium mt-1">{product.promo}</p>
        <p className="text-[11px] text-slate mt-1">Compra mínima: {product.minQty}</p>
      </div>
    </div>
  );
}
