"use client";

import dynamic from "next/dynamic";
import { services, type ServiceIconKey, type ServiceVisual } from "@/data/services";
import Reveal from "@/components/Reveal";
import {
  Layers,
  Server,
  Atom,
  Boxes,
  Sparkles,
  Webhook,
  Cloud,
  GitBranch,
  Settings,
  Zap,
  Database,
  Workflow,
  type LucideIcon,
} from "@/components/icons";

const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  fullstack: Layers,
  laravel: Server,
  react: Atom,
  mern: Boxes,
  ai: Sparkles,
  api: Webhook,
  aws: Cloud,
  cicd: GitBranch,
  server: Settings,
  realtime: Zap,
  database: Database,
  automation: Workflow,
};

const DatabaseScene3D = dynamic(() => import("@/components/DatabaseScene3D"), { ssr: false });
const AutomationScene3D = dynamic(() => import("@/components/AutomationScene3D"), { ssr: false });

const SERVICE_VISUALS: Record<ServiceVisual, React.ComponentType> = {
  database: DatabaseScene3D,
  automation: AutomationScene3D,
};

export default function Services() {
  return (
    <section id="services" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Services
          </p>
          <span className="divider-premium" />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon];
            const Visual = service.visual ? SERVICE_VISUALS[service.visual] : null;

            return (
              <Reveal key={service.title} delay={(i % 3) * 0.06}>
                <div className="glass-panel group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                  {Visual ? (
                    <div className="-mx-6 -mt-6 mb-4 h-36 overflow-hidden rounded-t-2xl bg-black/20">
                      <Visual />
                    </div>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  )}

                  <h3 className="mt-3 text-base font-semibold text-text">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>

                  {service.techBadges && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {service.techBadges.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
