import { profile } from "@/data/profile";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import ProfilePhotoModal from "@/components/ProfilePhotoModal";

export default function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About"
        description="Senior engineering with product sense — shipping full-stack systems, AI features, and cloud delivery for real clients."
      />

      <div className="section-stack grid items-center gap-12 md:grid-cols-[minmax(0,280px)_1fr]">
        <Reveal>
          <ProfilePhotoModal />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-muted sm:text-xl">{profile.shortBio}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Immediate Joiner
            </span>
            <span className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm text-text">
              {profile.yearsExperience}+ years experience
            </span>
            {profile.location && (
              <span className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm text-text">
                {profile.location}
              </span>
            )}
          </div>

          {profile.availabilityNote && (
            <p className="mt-4 text-sm text-muted">{profile.availabilityNote}</p>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
