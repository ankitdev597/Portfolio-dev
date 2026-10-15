import Image from "next/image";
import { training, trainingIntro } from "@/data/training";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BrandIcon from "@/components/BrandIcon";
import { ExternalLink } from "lucide-react";

export default function SummerTraining() {
  return (
    <Section id="training">
      <SectionHeading eyebrow="Summer Training" description={trainingIntro} />

      <div className="section-stack space-y-6">
        {training.map((entry, i) => (
          <Reveal key={entry.title} delay={i * 0.06}>
            <article className="glass-panel card-depth overflow-hidden">
              <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                <div className="relative aspect-[16/10] bg-[rgb(var(--surface-elevated))] lg:aspect-auto lg:min-h-[20rem]">
                  <Image
                    src={entry.image}
                    alt={entry.imageAlt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgb(var(--background)/0.55)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[rgb(var(--background)/0.25)]"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col p-5 sm:p-6 lg:p-7">
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
                    <span className="tech-chip !px-3 text-[10px] font-semibold uppercase tracking-wide">
                      {entry.focus}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold leading-snug text-text sm:text-xl">
                    {entry.title}
                  </h3>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-primary"
                  >
                    {entry.organization}
                    <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
                  </a>
                  <p className="mt-0.5 text-xs text-muted">{entry.location}</p>

                  <p className="mt-4 text-sm leading-relaxed text-muted">{entry.summary}</p>

                  <ul className="mt-4 space-y-2">
                    {entry.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <li key={tag} className="tech-chip">
                        <BrandIcon name={tag} className="h-3.5 w-3.5 shrink-0" />
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 !px-5 !py-2.5 text-xs"
                    >
                      Visit Techpile
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
