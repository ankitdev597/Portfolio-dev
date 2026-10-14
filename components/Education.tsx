import { education } from "@/data/education";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import { GraduationCap } from "@/components/icons";
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
            <article className="glass-panel card-depth flex h-full min-h-[15rem] flex-col p-5 sm:min-h-[16rem] sm:p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold">
                <GraduationCap className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 min-h-[3rem] text-base font-semibold leading-snug text-text sm:text-lg">
                {entry.degree}
              </h3>
              <p className="mt-2 text-sm text-gold">{entry.institution}</p>
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
