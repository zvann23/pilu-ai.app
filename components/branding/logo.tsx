import type { ComponentPropsWithoutRef } from "react";

type LogoProps = ComponentPropsWithoutRef<"div">;

/** Temporary wordmark; replace this component's contents when the final logo is ready. */
export function Logo({ className = "", ...props }: LogoProps) {
  return (
    <div className={`inline-flex items-baseline font-semibold tracking-[-0.075em] ${className}`} aria-label="Pilu" {...props}>
      <span className="text-pilu-dark-blue">pil</span><span className="text-pilu-pink">u</span>
    </div>
  );
}
