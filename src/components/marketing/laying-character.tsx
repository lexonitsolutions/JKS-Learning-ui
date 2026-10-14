import Image from "next/image";

/**
 * "Laying" character from Open Doodles by Pablo Stanley (https://www.opendoodles.com),
 * released under CC0 (public domain); artwork taken from the react-open-doodles package (MIT).
 *
 * A person lying on their front on a pillow, feet kicked up, checking their phone,
 * recoloured with the brand blue. It ships as a pre-rendered "sticker" PNG (the inside
 * of the figure is filled white) so it reads on both light and dark backgrounds.
 * Purely decorative.
 */
export const LAYING_SRC = "/illustrations/laying-character.png";
export const LAYING_WIDTH = 640;
export const LAYING_HEIGHT = 344;

export function LayingCharacter({ className = "", sizes = "200px" }: { className?: string; sizes?: string }) {
  return (
    <Image
      src={LAYING_SRC}
      width={LAYING_WIDTH}
      height={LAYING_HEIGHT}
      sizes={sizes}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`block h-auto w-full ${className}`}
    />
  );
}
