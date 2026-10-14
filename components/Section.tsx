import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Extra classes on the inner max-w-6xl container */
  containerClassName?: string;
}

/**
 * Shared section chrome — same vertical rhythm + same max-w-6xl container
 * as Navbar / Footer / Hero so every block aligns on one vertical rail.
 */
export default function Section({
  id,
  children,
  className = "",
  containerClassName = "",
}: SectionProps) {
  return (
    <section id={id} className={`section-shell ${className}`.trim()}>
      <div className={`container-page ${containerClassName}`.trim()}>{children}</div>
    </section>
  );
}
