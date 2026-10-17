export function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_60%,transparent_100%)]" />
      <div className="absolute -top-52 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute right-[-12%] top-1/3 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="absolute bottom-[-10%] left-[-8%] h-[380px] w-[380px] rounded-full bg-sky-500/5 blur-[130px]" />
      <div className="absolute left-[8%] top-[22%] h-[420px] w-[420px] animate-aurora rounded-full bg-cyan-500/[0.07] blur-[150px]" />
      <div className="absolute right-[6%] top-[48%] h-[380px] w-[380px] animate-aurora rounded-full bg-violet-500/[0.07] blur-[150px] [animation-delay:-13s]" />
      <div className="absolute bottom-[10%] left-[32%] h-[380px] w-[420px] animate-aurora rounded-full bg-sky-500/[0.06] blur-[150px] [animation-delay:-6s]" />
    </div>
  );
}
