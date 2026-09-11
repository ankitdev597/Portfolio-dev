import { profile } from "@/data/profile";
import Reveal from "@/components/Reveal";

export default function About() {
  const initials = profile.fullName
    .split(" ")
    .map((part) => part[0])
    .join("");

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
            <div className="glass-panel mx-auto flex aspect-square w-56 flex-col items-center justify-center gap-3 sm:w-64">
              <span className="text-5xl font-bold text-aurora">{initials}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Photo coming soon
              </span>
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
