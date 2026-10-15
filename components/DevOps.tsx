"use client";

import { devopsCapabilities, devopsIntro } from "@/data/devops";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BrandIcon from "@/components/BrandIcon";
import Marquee, { MARQUEE_SPEED, MARQUEE_SPEED_SLOW } from "@/components/Marquee";

const devopsTags = Array.from(
  new Set(devopsCapabilities.flatMap((item) => item.tags)),
);

const devopsTitles = devopsCapabilities.map((item) => item.title);

function TickerChip({ name }: { name: string }) {
  return (
    <span className="marquee-chip">
      <BrandIcon name={name} className="h-4 w-4 shrink-0" />
      <span>{name}</span>
    </span>
  );
}

/** Infinite AssistBee-style DevOps ticker — shared pace with Skills. */
export default function DevOps() {
  return (
    <Section id="devops">
      <SectionHeading eyebrow="DevOps & Infrastructure" description={devopsIntro} />

      <div className="flex flex-col gap-3 sm:gap-4">
        <Marquee ariaLabel="DevOps tools" speed={MARQUEE_SPEED} repeat={3}>
          {devopsTags.map((tag) => (
            <TickerChip key={tag} name={tag} />
          ))}
        </Marquee>

        <Marquee
          ariaLabel="DevOps capabilities"
          speed={MARQUEE_SPEED_SLOW}
          reverse
          repeat={3}
        >
          {devopsTitles.map((title) => (
            <span key={title} className="marquee-chip">
              <span>{title}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
