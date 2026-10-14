"use client";

import { services } from "@/data/services";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import ServiceVisual from "@/components/ServiceVisual";
import BrandIcon from "@/components/BrandIcon";
import LoadMoreGrid from "@/components/LoadMoreGrid";

export default function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Services"
        description="What I deliver for product teams — from architecture and APIs to AI features, DevOps, and production launches."
      />

      <div className="section-stack">
        <LoadMoreGrid
          items={services}
          initialCount={6}
          step={6}
          columns={2}
          getKey={(s) => s.title}
          moreLabel="Load more services"
          renderItem={(service, i) => (
            <Reveal delay={(i % 2) * 0.05} className="h-full">
              <article className="glass-panel card-depth group flex h-full min-h-[24rem] flex-col p-5 sm:min-h-[26rem] sm:p-6">
                <div className="service-visual-frame shrink-0">
                  <ServiceVisual visual={service.visual} />
                </div>

                <h3 className="mt-3 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-text sm:min-h-[3rem] sm:text-lg">
                  {service.title}
                </h3>
                <p className="mt-2 line-clamp-3 min-h-[4.5rem] flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>

                <div className="mt-4 flex min-h-[2.5rem] flex-wrap content-start gap-1.5">
                  {(service.techBadges ?? []).map((tech) => (
                    <span key={tech} className="tech-chip font-medium text-muted">
                      <BrandIcon name={tech} className="h-3.5 w-3.5 shrink-0" />
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          )}
        />
      </div>
    </Section>
  );
}
