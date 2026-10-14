import type { SVGProps } from "react";
import {
  brandFill,
  resolveBrand,
  SERVICE_BRANDS,
  type BrandMark,
} from "@/lib/brand-icons";

export { resolveBrand as resolveBrandIcon, SERVICE_BRANDS };
export type { BrandMark };

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  /** Technology display name as shown in data files. */
  name: string;
  /** Prefer official brand color; set false to inherit `currentColor`. */
  branded?: boolean;
  title?: string;
}

/**
 * Renders an official Simple Icons (or verified fallback) mark when available.
 * Returns null when no verified brand glyph exists for the label.
 */
export default function BrandIcon({
  name,
  branded = true,
  title,
  className,
  ...rest
}: BrandIconProps) {
  const icon = resolveBrand(name);
  if (!icon) return null;

  const label = title ?? icon.title;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{label}</title> : null}
      <path d={icon.path} fill={branded ? brandFill(icon.hex) : "currentColor"} />
    </svg>
  );
}

/** Service-level mark by ServiceIconKey (laravel, react, aws, …). */
export function ServiceBrandIcon({
  serviceKey,
  branded = true,
  className,
  ...rest
}: {
  serviceKey: string;
  branded?: boolean;
} & SVGProps<SVGSVGElement>) {
  const icon = SERVICE_BRANDS[serviceKey];
  if (!icon) return null;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d={icon.path} fill={branded ? brandFill(icon.hex) : "currentColor"} />
    </svg>
  );
}
