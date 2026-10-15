import Image from "next/image";
import { experience } from "@/data/experience";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import { ExternalLink } from "lucide-react";
import { formatMonthYear } from "@/lib/format-date";

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Experience"
        description="Roles and impact, told with the same care as the product work — timelines, ownership, and outcomes that matter."
      />

      <ol className="section-stack relative space-y-10 sm:space-y-8 sm:border-l sm:border-[rgb(var(--hairline)/var(--hairline-a))] sm:pl-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[rgb(var(--hairline)/var(--hairline-a))] sm:hidden"
        />

        {experience.map((entry, i) => (
          <li
            key={entry.roleTitle + entry.companyName}
            className="relative flex flex-col items-center sm:block sm:items-stretch"
          >
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 z-[1] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-gold shadow-[0_0_0_4px_rgb(var(--gold)/0.2)] sm:left-0 sm:top-1.5 sm:-translate-x-[calc(2rem+0.375rem)]"
            />

            <Reveal delay={i * 0.06} className="w-full pt-7 sm:pt-0">
              <article className="glass-panel card-depth p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgb(var(--gold)/0.25)] p-1 ${
                        entry.logoOnDark ? "bg-[#0b1f3a]" : "bg-white"
                      }`}
                    >
                      <Image
                        src={entry.logo}
                        alt={`${entry.companyName} logo`}
                        width={40}
                        height={40}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-text">{entry.roleTitle}</h3>
                      <a
                        href={entry.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-primary"
                      >
                        {entry.companyName}
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-70" aria-hidden="true" />
                      </a>
                      <p className="mt-0.5 text-xs text-muted">{entry.location}</p>
                    </div>
                  </div>
                  <span className="tech-chip !px-3 text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {entry.employmentTypeLabel}
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  {formatMonthYear(entry.startDate)} —{" "}
                  {entry.isCurrent
                    ? "Present"
                    : entry.endDate
                      ? formatMonthYear(entry.endDate)
                      : ""}
                </p>

                <ul className="mt-4 space-y-2">
                  {entry.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <a
                    href={entry.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-1.5 !px-4 !py-2 text-xs"
                  >
                    Visit website
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
