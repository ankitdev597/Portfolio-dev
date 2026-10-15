import Image from "next/image";
import { education } from "@/data/education";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import { ExternalLink } from "lucide-react";
import { formatMonthYear } from "@/lib/format-date";

export default function Education() {
  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Education"
        description="Formal foundations that sit behind the engineering craft — clearly laid out, same card rhythm as the rest of the site."
      />

      <div className="section-card-grid-2">
        {education.map((entry, i) => (
          <Reveal key={entry.degree} delay={i * 0.06} className="h-full">
            <article className="glass-panel card-depth flex h-full min-h-[16rem] flex-col p-5 sm:min-h-[17rem] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgb(var(--gold)/0.25)] bg-white p-1.5">
                  <Image
                    src={entry.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </span>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex shrink-0 items-center gap-1.5 !px-3 !py-2 text-[11px]"
                  aria-label={`Visit ${entry.institution} website`}
                >
                  Website
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <h3 className="mt-4 text-base font-semibold leading-snug text-text sm:text-lg">
                {entry.degree}
              </h3>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm font-medium text-gold transition-colors hover:text-primary"
              >
                {entry.institution}
              </a>
              <p className="mt-1 text-xs text-muted">{entry.location}</p>
              <p className="mt-auto pt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                {formatMonthYear(entry.startDate)} —{" "}
                {entry.isCurrent
                  ? "Present"
                  : entry.endDate
                    ? formatMonthYear(entry.endDate)
                    : ""}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
