import { education } from "@/data/education";
import Reveal from "@/components/Reveal";
import { GraduationCap } from "@/components/icons";

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

export default function Education() {
  return (
    <section id="education" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Education
          </p>
          <span className="divider-premium" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {education.map((entry, i) => (
            <Reveal key={entry.degree} delay={i * 0.08}>
              <div className="glass-panel h-full p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-accent">
                  <GraduationCap className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug text-text">
                  {entry.degree}
                </h3>
                <p className="mt-2 text-sm text-primary">{entry.institution}</p>
                <p className="mt-1 text-xs text-muted">{entry.location}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  {formatDate(entry.startDate)} —{" "}
                  {entry.isCurrent ? "Present" : entry.endDate ? formatDate(entry.endDate) : ""}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
