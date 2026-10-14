import type { Project, ProjectIconKey } from "@/data/projects";
import BrandIcon from "@/components/BrandIcon";
import {
  Wallet,
  MessagesSquare,
  Building2,
  Home,
  Clapperboard,
  ArrowLeftRight,
  Bot,
  Car,
  HeartPulse,
  Landmark,
  CalendarCheck,
  Briefcase,
  FileSpreadsheet,
  Workflow,
  Timer,
  Building,
  Sparkles,
  type LucideIcon,
} from "@/components/icons";

const PROJECT_ICONS: Record<ProjectIconKey, LucideIcon> = {
  wallet: Wallet,
  comms: MessagesSquare,
  facilities: Building2,
  care: Home,
  casting: Clapperboard,
  trading: ArrowLeftRight,
  "ai-chat": Bot,
  travel: Car,
  health: HeartPulse,
  finance: Landmark,
  sports: CalendarCheck,
  jobs: Briefcase,
  data: FileSpreadsheet,
  automation: Workflow,
  scheduler: Timer,
  "ai-toolkit": Sparkles,
  business: Building,
};

export default function ProjectCard({ project }: { project: Project }) {
  const Icon = PROJECT_ICONS[project.icon];
  const hasLinks = Boolean(project.liveUrl || project.githubUrl || project.secondaryUrl);

  return (
    <article className="glass-panel card-depth group flex h-full min-h-[22rem] flex-col p-5 sm:min-h-[24rem] sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-text sm:min-h-[3rem] sm:text-lg">
              {project.title}
            </h3>
            {project.featured ? (
              <span className="w-fit shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Featured
              </span>
            ) : (
              <span className="invisible w-fit shrink-0 px-2.5 py-1 text-[10px]" aria-hidden="true">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="mt-5 flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
        {project.technologies.slice(0, 6).map((tech) => (
          <span key={tech} className="tech-chip">
            <BrandIcon name={tech} className="h-3.5 w-3.5 shrink-0" />
            {tech}
          </span>
        ))}
        {project.technologies.length > 6 && (
          <span className="tech-chip text-muted">+{project.technologies.length - 6}</span>
        )}
      </div>

      <div className="soft-hairline mt-auto flex min-h-[2.5rem] items-center gap-4 border-t pt-4 text-xs font-medium">
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
        {project.secondaryUrl && (
          <a
            href={project.secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted transition-colors hover:text-text"
          >
            {project.secondaryLabel ?? "View more"}
            <span aria-hidden="true">&rarr;</span>
          </a>
        )}
        {!hasLinks && <span className="text-muted/60">Private / client build</span>}
      </div>
    </article>
  );
}
