'use client';

export default function CallStage({ executive, isSpeaking, statusText }) {
  return (
    <div className="relative h-64 sm:h-72 overflow-hidden bg-navyDeep">
      {/* Fondo de oficina desenfocado, con zoom lento (efecto Ken Burns) */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] opacity-65 animate-kenburns"
        style={{ backgroundImage: `url('/backgrounds/office.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navyDeep/40 via-navyDeep/10 to-navyDeep/70" />

      {/* Indicador de "llamada" parpadeando, arriba a la derecha */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span className="text-paper/90 text-[11px] font-medium">En llamada</span>
      </div>

      {/* Avatar central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          {isSpeaking && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-gold/70 animate-pulseRing" />
              <span className="absolute inset-0 rounded-full border-2 border-gold/70 animate-pulseRing [animation-delay:0.6s]" />
            </>
          )}
          <div
            className={`w-full h-full rounded-full overflow-hidden border-2 shadow-xl transition-transform duration-700 ${
              isSpeaking ? 'scale-105' : 'scale-100'
            }`}
            style={{ borderColor: executive.accent }}
          >
            <img
              src={executive.photo}
              alt={executive.name}
              className={`w-full h-full object-cover ${isSpeaking ? 'animate-talk' : 'animate-breathe'}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.nextElementSibling?.classList.remove('hidden');
              }}
            />
          </div>
          {/* Respaldo si aún no se agregó la foto real */}
          <div
            className="hidden absolute inset-0 rounded-full flex items-center justify-center"
            style={{ backgroundColor: executive.accent }}
          >
            <span className="font-display text-paper text-3xl font-semibold">{executive.initial}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-paper font-display font-semibold text-[15px]">{executive.name}</p>
          <p className="text-paper/70 text-xs mt-0.5">{statusText}</p>
        </div>
      </div>
    </div>
  );
}
