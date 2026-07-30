import Image from "next/image";

type PiluLogoProps = { size?: "small" | "medium" | "large"; className?: string; priority?: boolean };

const dimensions = { small: 54, medium: 84, large: 144 } as const;

/** The final Pilu wordmark. The source image is kept at its original square ratio. */
export function PiluLogo({ size = "medium", className = "", priority = false }: PiluLogoProps) {
  const dimension = dimensions[size];
  return <Image className={`pilu-logo pilu-logo--${size} ${className}`} src="/branding/pilu-logo.png" alt="Pilu" width={dimension} height={dimension} priority={priority} />;
}
