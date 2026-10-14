"use client";

import { skillCategories, type SkillIconKey } from "@/data/skills";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BrandIcon from "@/components/BrandIcon";
import {
  Code2,
  LayoutGrid,
  Server,
  Database,
  Cloud,
  Sparkles,
  Box,
  Wrench,
  type LucideIcon,
} from "@/components/icons";

const SKILL_ICONS: Record<SkillIconKey, LucideIcon> = {
  code: Code2,
  frontend: LayoutGrid,
  backend: Server,
  database: Database,
  cloud: Cloud,
  ai: Sparkles,
  creative: Box,
  tools: Wrench,
};

/** Always-visible skill chips — brand logos where verified, labels always shown. */
export default function Skills() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          description="A production toolkit across languages, frameworks, cloud, and AI — organized the way I actually ship."
        />

        <div className="mt-14 grid grid-cols-1 items-stretch gap-4 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {skillCategories.map((category, i) => {
            const Icon = SKILL_ICONS[category.icon];

            return (
              <Reveal key={category.name} delay={(i % 4) * 0.05} className="h-full">
                <article className="glass-panel card-depth flex h-full min-h-[16.5rem] flex-col p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="min-h-[2.5rem] text-sm font-semibold leading-snug text-text">
                        {category.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {category.skills.length} skills
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                    {category.skills.map((skill) => (
                      <li key={skill} className="tech-chip">
                        <BrandIcon name={skill} className="h-3.5 w-3.5 shrink-0" />
                        <span>{skill}</span>
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
