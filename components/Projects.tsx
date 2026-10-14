"use client";

import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import LoadMoreGrid from "@/components/LoadMoreGrid";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        description="Selected product work across SaaS, AI, fintech, and operations — equal card rhythm, clear tech, and direct links where available."
      />

      {featured.length > 0 && (
        <div className="section-stack">
          <Reveal>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              Featured
            </h3>
          </Reveal>
          <div className="section-card-grid-2 !mt-0">
            {featured.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 2) * 0.05} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
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
