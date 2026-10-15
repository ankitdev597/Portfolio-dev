"use client";

import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import LoadMoreGrid from "@/components/LoadMoreGrid";
import Marquee, { MARQUEE_SPEED } from "@/components/Marquee";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        description="Featured work leads with live product screenshots where available — Colossians Cleaning first. When a capture isn’t possible, cards use a clearly labeled category preview so nothing looks broken."
      />

      {featured.length > 0 && (
        <div className="section-stack">
          <Reveal>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              Featured
            </h3>
          </Reveal>

          {/*
            Skills-style infinite ticker: translateX(-50%) loop — no rewind
            jump when the list ends. Same px/s pace as Skills / DevOps.
          */}
          <Marquee
            ariaLabel="Featured projects"
            speed={MARQUEE_SPEED}
            repeat={2}
            className="marquee-wrapper--cards !mt-0"
          >
            {featured.map((project) => (
              <div key={project.slug} className="marquee-card h-auto">
                <div className="h-full">
                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      )}

      {rest.length > 0 && (
        <div className={featured.length > 0 ? "mt-12" : "section-stack"}>
          {featured.length > 0 && (
            <Reveal>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                More projects
              </h3>
            </Reveal>
          )}
          <LoadMoreGrid
            items={rest}
            initialCount={6}
            step={6}
            columns={2}
            getKey={(p) => p.slug}
            moreLabel="Load more projects"
            renderItem={(project, i) => (
              <Reveal delay={(i % 2) * 0.05} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            )}
          />
        </div>
      )}
    </Section>
  );
}
