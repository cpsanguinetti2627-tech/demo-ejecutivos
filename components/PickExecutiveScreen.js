import { EXECUTIVES } from '@/lib/executives';

export default function PickExecutiveScreen({ onPick }) {
  const list = Object.values(EXECUTIVES);

  return (
    <div className="flex flex-col h-full px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-xl font-semibold text-ink">
          Elige con quién quieres hablar
        </h1>
        <p className="text-slate text-sm mt-1">
          Ambos están disponibles ahora mismo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((exec) => (
          <button
            key={exec.id}
            onClick={() => onPick(exec.id)}
            className="flex items-center gap-4 bg-paper border border-line rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: exec.accent }}
            >
              <span className="font-display text-paper font-semibold">{exec.initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{exec.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
              </div>
              <p className="text-slate text-sm">{exec.role} · {exec.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
