import Image from "next/image";

const illustrations = {
  "sleeping-baby": "/illustrations/sleeping-baby-cloud.png",
  teddy: "/illustrations/teddy-care.png",
  "bath-duck": "/illustrations/bath-duck.png",
  "feeding-bottle": "/illustrations/feeding-bottle.png",
  "sunny-cloud": "/illustrations/sunny-cloud.png",
  "pacifier-pillow": "/illustrations/pacifier-pillow.png",
} as const;

type PiluIllustrationProps = {
  variant: keyof typeof illustrations;
  className?: string;
  alt?: string;
  priority?: boolean;
};

/** A small, consistent illustration layer for moments that benefit from warmth. */
export function PiluIllustration({ variant, className = "", alt = "", priority = false }: PiluIllustrationProps) {
  return (
    <Image
      src={illustrations[variant]}
      alt={alt}
      className={`pilu-illustration pilu-illustration--${variant} ${className}`}
      width={240}
      height={240}
      sizes="(max-width: 43rem) 34vw, 14rem"
      priority={priority}
    />
  );
}
