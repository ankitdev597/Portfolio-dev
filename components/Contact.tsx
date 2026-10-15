import { profile, socialLinks } from "@/data/profile";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";

const ICONS: Record<string, string> = {
  github: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.6 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.3V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9Z",
};

export default function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something together."
        description="Prefer a quick call or a clear email — either way, you'll reach me directly."
      />

      <Reveal delay={0.1} className="section-stack">
        <div className="mx-auto max-w-2xl text-center">
          <a
            href={profile.phoneHref}
            className="inline-block text-2xl font-semibold tracking-tight text-gold transition-colors hover:text-primary sm:text-3xl"
            aria-label={`Call ${profile.phone}`}
          >
            {profile.phone}
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="mt-3 block text-base text-muted transition-colors hover:text-gold sm:text-lg"
          >
            {profile.email}
          </a>

          <div className="mt-10 flex flex-col items-center gap-5">
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <a
                href={profile.phoneHref}
                className="btn-primary contact-orb-primary min-w-[9.5rem]"
                aria-label={`Call ${profile.phone}`}
              >
                Call Now
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="btn-secondary contact-orb-secondary min-w-[9.5rem]"
              >
                Email Me
              </a>
            </div>

            <div className="flex items-center justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.label}
                  className="contact-orb-social"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d={ICONS[link.platform]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
