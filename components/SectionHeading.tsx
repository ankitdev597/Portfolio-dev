import Reveal from "@/components/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  /** When set, eyebrow stays a label and this becomes the main heading. */
  title?: string;
  description?: string;
}

/** Consistent section header: gold label, premium divider, optional title + blurb. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        {title ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {eyebrow}
            </p>
            <span className="divider-premium" />
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-text sm:text-3xl md:text-4xl">
              {title}
            </h2>
          </>
        ) : (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {eyebrow}
            </h2>
            <span className="divider-premium" />
          </>
        )}
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
