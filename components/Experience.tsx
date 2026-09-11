import { experience } from "@/data/experience";
import Reveal from "@/components/Reveal";

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

export default function Experience() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Experience
          </p>
          <span className="divider-premium" />
        </Reveal>

        <ol className="relative mt-14 space-y-8 border-l border-white/10 pl-8">
          {experience.map((entry, i) => (
            <Reveal key={entry.roleTitle + entry.companyName} delay={i * 0.08}>
              <li className="relative">
                <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-[0_0_0_4px_rgb(220_38_38/0.15)]" />

                <div className="glass-panel p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-text">{entry.roleTitle}</h3>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {entry.employmentTypeLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-primary">{entry.companyName}</p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                    {formatDate(entry.startDate)} —{" "}
                    {entry.isCurrent ? "Present" : entry.endDate ? formatDate(entry.endDate) : ""}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
