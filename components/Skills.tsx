"use client";

import { skillCategories } from "@/data/skills";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BrandIcon from "@/components/BrandIcon";
import Marquee, { MARQUEE_SPEED, MARQUEE_SPEED_SLOW } from "@/components/Marquee";

/** Flatten unique skill labels across categories (preserve first-seen order). */
const allSkills = Array.from(
  new Set(skillCategories.flatMap((category) => category.skills)),
);

const midpoint = Math.ceil(allSkills.length / 2);
const rowA = allSkills.slice(0, midpoint);
const rowB = allSkills.slice(midpoint);

function SkillChip({ name }: { name: string }) {
  return (
    <span className="marquee-chip">
      <BrandIcon name={name} className="h-4 w-4 shrink-0" />
      <span>{name}</span>
    </span>
  );
}

/** Infinite AssistBee-style skill ticker — same px/s pace as DevOps. */
export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        description="A production toolkit across languages, frameworks, cloud, and AI — scrolling continuously."
      />

      <div className="flex flex-col gap-3 sm:gap-4">
        <Marquee ariaLabel="Skills row one" speed={MARQUEE_SPEED} repeat={3}>
          {rowA.map((skill) => (
            <SkillChip key={skill} name={skill} />
          ))}
        </Marquee>

        <Marquee
          ariaLabel="Skills row two"
          speed={MARQUEE_SPEED_SLOW}
          reverse
          repeat={3}
        >
          {rowB.map((skill) => (
            <SkillChip key={skill} name={skill} />
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
