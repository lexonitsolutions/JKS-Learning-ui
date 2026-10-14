import { LayingCharacter } from "./laying-character";

/**
 * The same character as in the header, larger, napping on top of the AI Mock
 * Interview section heading (dark background).
 *
 * Idle: asleep - slow breathing and Zzz drifting up from the head.
 * Hover (on the parent with `group/mock`): startled awake - the Zzz burst away,
 * a "!" pops, the character hops and wiggles, then says "Let's practise!".
 * Animations stop for visitors who prefer reduced motion.
 */
export function MockHeadingCharacter({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative select-none ${className}`} aria-hidden="true">
      <style>{`
        @keyframes jks-mh-breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.025); } }
        @keyframes jks-mh-z { 0% { opacity: 0; transform: translate(0, 6px) scale(.5); } 20% { opacity: 1; } 100% { opacity: 0; transform: translate(18px, -34px) scale(1.2); } }
        @keyframes jks-mh-wake { 0% { transform: translateY(0) rotate(0); } 22% { transform: translateY(-14px) rotate(-5deg); } 45% { transform: translateY(0) rotate(3deg); } 65% { transform: translateY(-5px) rotate(-2deg); } 100% { transform: translateY(0) rotate(0); } }
        @keyframes jks-mh-bang { 0% { opacity: 0; transform: translateY(8px) scale(.3); } 50% { opacity: 1; transform: translateY(-3px) scale(1.25); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes jks-mh-say { 0% { opacity: 0; transform: translateY(6px) scale(.7); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .jks-mh-breathe { transform-origin: 50% 100%; animation: jks-mh-breathe 3.6s ease-in-out infinite; }
        .jks-mh-z { display: block; animation: jks-mh-z 3.4s ease-in-out infinite; }
        .jks-mh-wake { transform-origin: 18% 100%; }
        .group\\/mock:hover .jks-mh-wake { animation: jks-mh-wake .75s cubic-bezier(.3,1.4,.5,1) both; }
        .group\\/mock:hover .jks-mh-bang { animation: jks-mh-bang .45s cubic-bezier(.3,1.6,.5,1) .1s both; }
        .group\\/mock:hover .jks-mh-say { animation: jks-mh-say .35s cubic-bezier(.3,1.4,.5,1) .55s both; }
        @media (prefers-reduced-motion: reduce) {
          .jks-mh-breathe, .jks-mh-z { animation: none; }
          .group\\/mock:hover .jks-mh-wake { animation: none; }
          .group\\/mock:hover .jks-mh-bang, .group\\/mock:hover .jks-mh-say { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="jks-mh-wake relative">
        <div className="jks-mh-breathe">
          <LayingCharacter sizes="200px" className="[filter:drop-shadow(0_0_1.5px_rgba(255,255,255,0.6))_drop-shadow(0_10px_18px_rgba(0,0,0,0.35))]" />
        </div>

        {/* asleep: Zzz rising from the head */}
        <span className="absolute left-[30%] top-[-22%] flex items-end gap-0.5 font-black leading-none text-blue-300 transition-opacity duration-200 group-hover/mock:opacity-0">
          <span className="jks-mh-z text-sm">z</span>
          <span className="jks-mh-z text-xl" style={{ animationDelay: "1.1s" }}>
            Z
          </span>
          <span className="jks-mh-z text-sm" style={{ animationDelay: "2.2s" }}>
            z
          </span>
        </span>

        {/* awake: startled "!" */}
        <span className="jks-mh-bang absolute left-[15%] top-[-26%] text-3xl font-black leading-none text-amber-400 opacity-0">!</span>
      </div>

      {/* then a reply */}
      <span className="jks-mh-say absolute left-[36%] top-[-22%] whitespace-nowrap rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-xs font-extrabold text-blue-900 opacity-0 shadow-lg">
        Let&apos;s practise!
      </span>
    </div>
  );
}
