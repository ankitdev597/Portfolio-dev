import { services } from "@/data/services";
import Reveal from "@/components/Reveal";

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
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 0.06}>
              <div className="glass-panel group h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                <span className="text-2xl">{service.icon}</span>
                <h3 className="mt-3 text-base font-semibold text-text">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
