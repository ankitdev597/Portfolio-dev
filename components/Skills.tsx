"use client";

import { skillCategories, type SkillIconKey } from "@/data/skills";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
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
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        description="A production toolkit across languages, frameworks, cloud, and AI — organized the way I actually ship."
      />

      <div className="section-card-grid-2">
        {skillCategories.map((category, i) => {
          const Icon = SKILL_ICONS[category.icon];

          return (
            <Reveal key={category.name} delay={(i % 2) * 0.05} className="h-full">
              <article className="glass-panel card-depth group flex h-full min-h-[22rem] flex-col p-5 sm:min-h-[24rem] sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold leading-snug text-text sm:text-lg">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted sm:text-sm">
                      {category.skills.length} skills
                    </p>
                  </div>
                </div>

                <p className="mt-4 min-h-[2.75rem] text-sm leading-relaxed text-muted">
                  {category.summary}
                </p>

                <ul className="mt-5 flex min-h-[5.5rem] flex-1 flex-wrap content-start gap-1.5">
                  {category.skills.map((skill) => (
                    <li key={skill} className="tech-chip">
                      <BrandIcon name={skill} className="h-3.5 w-3.5 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>

                <div className="soft-hairline mt-auto border-t pt-4 text-xs font-medium text-muted">
                  Production-ready stack
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
