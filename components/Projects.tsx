import { projects } from "@/data/projects";
import Reveal from "@/components/Reveal";
import Carousel from "@/components/Carousel";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Projects
          </p>
          <span className="divider-premium" />
        </Reveal>

        {featured.length > 0 && (
          <Reveal delay={0.1} className="mt-14">
            <Carousel ariaLabel="Featured projects" autoPlay autoPlayInterval={5500}>
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </Carousel>
          </Reveal>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
