import { resume } from "@/data/profile";
import Reveal from "@/components/Reveal";

export default function Resume() {
  return (
    <section id="resume" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Resume
          </p>
          <span className="divider-premium" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-panel mt-14 flex flex-col items-center gap-5 p-10 text-center">
            <h3 className="text-2xl font-semibold text-text">{resume.roleTitle}</h3>
            <p className="max-w-md text-sm text-muted">This is my entire experience Resume.</p>
            <a
              href={resume.path}
              download={resume.fileName}
              className="btn-primary"
            >
              Download PDF
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
