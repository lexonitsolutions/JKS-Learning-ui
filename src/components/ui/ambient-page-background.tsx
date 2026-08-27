// Same recipe as the marketing AI mock interview hero (ai-mock-hero.tsx):
// a soft base wash + two radial glows + a barely-there grid, fixed behind
// the workspace shell so every dashboard page reads as one depth-aware
// surface instead of a flat white panel.
export function AmbientPageBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFF] via-[#FBFCFF] to-[#F1F5FD]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 10%, rgba(56, 189, 248, 0.14), transparent 45%), radial-gradient(circle at 10% 65%, rgba(30, 94, 255, 0.10), transparent 45%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
