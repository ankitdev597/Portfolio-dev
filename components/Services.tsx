import { services } from "@/data/services";
import Reveal from "@/components/Reveal";
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
    <section id="services" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Services
          </h2>
          <span className="divider-premium" />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 0.05}>
              <div className="glass-panel card-depth group h-full p-4 sm:p-6">
                <div className="service-visual-frame">
                  <ServiceVisual visual={service.visual} />
                </div>

                <h3 className="mt-3 text-sm font-semibold text-text sm:text-base">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>

                {service.techBadges && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.techBadges.map((tech) => (
                      <span key={tech} className="tech-chip font-medium text-muted">
                        <BrandIcon name={tech} className="h-3.5 w-3.5 shrink-0" />
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
