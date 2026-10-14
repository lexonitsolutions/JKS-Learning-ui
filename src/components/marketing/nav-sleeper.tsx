import { LayingCharacter } from "./laying-character";

/**
 * The character napping on top of the "AI Mock Interview" nav label.
 *
 * Idle: asleep - slow breathing and "z Z z" drifting up from the head.
 * Hover / keyboard focus (on the parent with `group/mock`): it is startled awake -
 * the Zzz burst away, a "!" pops over the head and the character does a quick hop
 * and wiggle. Animations stop for visitors who prefer reduced motion.
 */
export function NavSleeper({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none block select-none ${className}`} aria-hidden="true">
      <style>{`
        @keyframes jks-nav-breathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.03); } }
        @keyframes jks-nav-z { 0% { opacity: 0; transform: translate(0, 2px) scale(.5); } 20% { opacity: 1; } 100% { opacity: 0; transform: translate(6px, -7px) scale(1.15); } }
        @keyframes jks-nav-wake { 0% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-3px) rotate(-5deg); } 50% { transform: translateY(0) rotate(3deg); } 70% { transform: translateY(-2px) rotate(-2deg); } 100% { transform: translateY(0) rotate(0); } }
        @keyframes jks-nav-bang { 0% { opacity: 0; transform: translateY(3px) scale(.3); } 55% { opacity: 1; transform: translateY(-1px) scale(1.25); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .jks-nav-breathe { transform-origin: 50% 100%; animation: jks-nav-breathe 3.4s ease-in-out infinite; }
        .jks-nav-z { display: block; animation: jks-nav-z 3s ease-in-out infinite; }
        .group\\/mock:hover .jks-nav-wake, .group\\/mock:focus-visible .jks-nav-wake { animation: jks-nav-wake .65s cubic-bezier(.3,1.4,.5,1) both; }
        .group\\/mock:hover .jks-nav-bang, .group\\/mock:focus-visible .jks-nav-bang { animation: jks-nav-bang .4s cubic-bezier(.3,1.6,.5,1) .08s both; }
        .jks-nav-wake { transform-origin: 18% 100%; }
        @media (prefers-reduced-motion: reduce) {
          .jks-nav-breathe, .jks-nav-z { animation: none; }
          .group\\/mock:hover .jks-nav-wake, .group\\/mock:focus-visible .jks-nav-wake { animation: none; }
          .group\\/mock:hover .jks-nav-bang, .group\\/mock:focus-visible .jks-nav-bang { animation: none; opacity: 1; }
        }
      `}</style>

      <span className="jks-nav-wake relative block">
        <span className="jks-nav-breathe block">
          <LayingCharacter sizes="52px" className="dark:[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.7))]" />
        </span>

        {/* asleep: Zzz rising from the head */}
        <span className="absolute left-[34%] top-[-2%] flex items-end gap-[1px] font-black leading-none text-primary-blue transition-opacity duration-200 group-hover/mock:opacity-0 group-focus-visible/mock:opacity-0 dark:text-blue-300">
          <span className="jks-nav-z text-[6px]">z</span>
          <span className="jks-nav-z text-[8px]" style={{ animationDelay: "1s" }}>
            Z
          </span>
          <span className="jks-nav-z text-[6px]" style={{ animationDelay: "2s" }}>
            z
          </span>
        </span>

        {/* awake: startled "!" over the head */}
        <span className="jks-nav-bang absolute left-[-9%] top-[4%] text-[10px] font-black leading-none text-amber-500 opacity-0">!</span>
      </span>
    </span>
  );
}
