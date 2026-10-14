import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Projects
          </h2>
          <span className="divider-premium" />
        </Reveal>

        {featured.length > 0 && (
          <div className="mt-14">
            <Reveal>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                Featured
              </h3>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {featured.map((project, i) => (
                <Reveal key={project.slug} delay={(i % 2) * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className={featured.length > 0 ? "mt-12" : "mt-14"}>
            {featured.length > 0 && (
              <Reveal>
                <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                  More projects
                </h3>
              </Reveal>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((project, i) => (
                <Reveal key={project.slug} delay={(i % 3) * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
