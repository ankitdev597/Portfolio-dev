import { devopsCapabilities, devopsIntro } from "@/data/devops";
import Reveal from "@/components/Reveal";
import BrandIcon from "@/components/BrandIcon";
import {
  Cloud,
  GitBranch,
  Server,
  Shield,
  Settings,
  Activity,
  type LucideIcon,
} from "@/components/icons";

const CAPABILITY_ICONS: LucideIcon[] = [
  Cloud,
  GitBranch,
  Server,
  Shield,
  Settings,
  Activity,
];

export default function DevOps() {
  return (
    <section id="devops" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            DevOps &amp; Infrastructure
          </h2>
          <span className="divider-premium" />
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-muted">
            {devopsIntro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devopsCapabilities.map((item, i) => {
            const Icon = CAPABILITY_ICONS[i] ?? Server;

            return (
              <Reveal key={item.title} delay={(i % 3) * 0.05}>
                <article className="glass-panel card-depth flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-text">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <li key={tag} className="tech-chip">
                        <BrandIcon name={tag} className="h-3.5 w-3.5 shrink-0" />
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
