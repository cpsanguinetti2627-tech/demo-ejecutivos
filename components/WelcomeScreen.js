export default function WelcomeScreen({ onStart }) {
  return (
    <div className="flex flex-col justify-between h-full px-7 py-10">
      <div />
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center">
          <span className="font-display text-paper text-xl font-semibold">AC</span>
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Bienvenido a Atención Comercial
          </h1>
          <p className="text-slate mt-2 text-[15px] leading-relaxed">
            Estamos preparando tu atención personalizada.
          </p>
        </div>
      </div>
      <button
        onClick={onStart}
        className="w-full bg-navy text-paper font-medium text-[15px] rounded-2xl py-4 active:scale-[0.98] transition-transform"
      >
        Comenzar
      </button>
    </div>
  );
}
