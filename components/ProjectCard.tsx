import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="glass-panel group flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-text">{project.title}</h3>
        {project.featured && (
          <span className="shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-text"
          >
            {tech}
          </span>
        ))}
      </div>

      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-5 flex items-center gap-4 border-t border-white/[0.08] pt-4 text-xs font-medium">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent transition-colors hover:text-primary"
            >
              View live
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-text"
            >
              Source
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
