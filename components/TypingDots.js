export default function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-slate/60 animate-blink1" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate/60 animate-blink2" />
      <span className="w-1.5 h-1.5 rounded-full bg-slate/60 animate-blink3" />
    </div>
  );
}
