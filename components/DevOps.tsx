import { devopsCapabilities, devopsIntro } from "@/data/devops";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
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
        <SectionHeading eyebrow="DevOps & Infrastructure" description={devopsIntro} />

        <div className="mt-14 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devopsCapabilities.map((item, i) => {
            const Icon = CAPABILITY_ICONS[i] ?? Server;

            return (
              <Reveal key={item.title} delay={(i % 3) * 0.05} className="h-full">
                <article className="glass-panel card-depth flex h-full min-h-[15.5rem] flex-col p-5 sm:min-h-[16.5rem] sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="min-h-[1.5rem] text-base font-semibold text-text">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
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
