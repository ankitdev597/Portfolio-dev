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

  return (
    <div className="glass-panel card-depth group flex h-full flex-col p-4 sm:p-6">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold/25 to-primary/15 text-gold sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
            <h3 className="min-w-0 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-text sm:min-h-[3rem] sm:text-lg">
              {project.title}
            </h3>
            {project.featured && (
              <span className="w-fit shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white sm:px-2.5 sm:py-1 sm:text-[10px]">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 min-h-[3.75rem] flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <div className="mt-5 flex min-h-[3.25rem] flex-wrap content-start gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="tech-chip"
          >
            <BrandIcon name={tech} className="h-3.5 w-3.5 shrink-0" />
            {tech}
          </span>
        ))}
      </div>

      <div className="soft-hairline mt-5 flex min-h-[2.25rem] items-center gap-4 border-t pt-4 text-xs font-medium">
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
      </div>
    </div>
  );
}
