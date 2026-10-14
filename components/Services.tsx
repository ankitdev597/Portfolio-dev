import { services } from "@/data/services";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import ServiceVisual from "@/components/ServiceVisual";
import BrandIcon from "@/components/BrandIcon";

/**
 * Server Component — 3D card visuals are isolated in ServiceVisual
 * (a Client Component) because `next/dynamic` with `ssr: false` is
 * only allowed in client modules. SVG illustrations render inside that
 * client boundary as well for a single visual slot per card.
 */
export default function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Services"
        description="What I deliver for product teams — from architecture and APIs to AI features, DevOps, and production launches."
      />

      <div className="section-card-grid">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={(i % 3) * 0.05} className="h-full">
            <article className="glass-panel card-depth group flex h-full min-h-[22rem] flex-col p-5 sm:min-h-[24rem] sm:p-6">
              <div className="service-visual-frame">
                <ServiceVisual visual={service.visual} />
              </div>

              <h3 className="mt-3 min-h-[2.75rem] text-base font-semibold leading-snug text-text sm:min-h-[3rem] sm:text-lg">
                {service.title}
              </h3>
              <p className="mt-2 line-clamp-3 min-h-[4.5rem] flex-1 text-sm leading-relaxed text-muted">
                {service.description}
              </p>

              {service.techBadges && service.techBadges.length > 0 ? (
                <div className="mt-4 flex min-h-[2.25rem] flex-wrap content-start gap-1.5">
                  {service.techBadges.map((tech) => (
                    <span key={tech} className="tech-chip font-medium text-muted">
                      <BrandIcon name={tech} className="h-3.5 w-3.5 shrink-0" />
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-4 min-h-[2.25rem]" aria-hidden="true" />
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
