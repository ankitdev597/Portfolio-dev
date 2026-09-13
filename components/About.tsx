import Image from "next/image";
import { profile } from "@/data/profile";
import Reveal from "@/components/Reveal";
import { MapPin } from "@/components/icons";

export default function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            About
          </p>
          <span className="divider-premium" />
        </Reveal>

        <div className="mt-14 grid items-center gap-12 md:grid-cols-[minmax(0,280px)_1fr]">
          <Reveal>
            <div className="glass-panel relative mx-auto flex aspect-square w-56 flex-col items-center justify-end overflow-hidden sm:w-64">
              <Image
                src="/images/profile-photo.jpg"
                alt={profile.fullName}
                fill
                sizes="(min-width: 640px) 256px, 224px"
                className="object-cover"
                priority
              />
              {profile.location && (
                <span className="relative z-10 mb-3 flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted backdrop-blur-sm">
                  <MapPin className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  {profile.location}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">{profile.shortBio}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm text-text">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Available for work
              </span>
              <span className="glass-panel inline-flex items-center gap-2 px-4 py-2 text-sm text-text">
                {profile.yearsExperience}+ years experience
              </span>
            </div>

            {profile.availabilityNote && (
              <p className="mt-4 text-sm text-muted">{profile.availabilityNote}</p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
