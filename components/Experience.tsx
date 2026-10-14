import { experience } from "@/data/experience";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { formatMonthYear } from "@/lib/format-date";

export default function Experience() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Experience"
          description="Roles and impact, told with the same care as the product work — timelines, ownership, and outcomes that matter."
        />

        <ol className="soft-hairline relative mt-14 space-y-8 border-l pl-8">
          {experience.map((entry, i) => (
            <li key={entry.roleTitle + entry.companyName} className="relative">
              <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-gold shadow-[0_0_0_4px_rgb(var(--gold)/0.2)]" />

              <Reveal delay={i * 0.06}>
                <article className="glass-panel card-depth p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-text">{entry.roleTitle}</h3>
                    <span className="tech-chip !px-3 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {entry.employmentTypeLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gold">
                    {entry.companyName} <span className="text-muted">· {entry.location}</span>
                  </p>
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
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
