import { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import PublicLayout from '@/Layouts/PublicLayout';
import { Reveal } from '@/Components/Motion/Reveal';
import { Preloader } from '@/Components/Motion/Preloader';
import { SocialIcon } from '@/Components/Public/SocialIcon';
import { FlipCard } from '@/Components/UI/FlipCard';
import { Avatar3D } from '@/Components/UI/Avatar3D';
import { usePage } from '@/Hooks/usePage';
import { usePointerTilt } from '@/Hooks/usePointerTilt';
import { Button } from '@/Components/UI/Button';
import { cn } from '@/Utils/cn';
import type { Experience, Profile, PublicProject, Service, SkillCategory, SocialLink } from '@/Types';

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface WelcomeProps {
    profile: Profile | null;
    skillCategories: SkillCategory[];
    experiences: Experience[];
    services: Service[];
    projects: PublicProject[];
    socialLinks: SocialLink[];
    whatsappLink: string | null;
}

const NAV_SECTIONS = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
];

function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function formatMonthYear(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const EMPLOYMENT_LABELS: Record<Experience['employment_type'], string> = {
    full_time: 'Full-Time',
    apprentice: 'Apprentice',
    contract: 'Contract',
    freelance: 'Freelance',
    internship: 'Internship',
};

export default function Welcome({
    profile,
    skillCategories,
    experiences,
    services,
    projects,
    socialLinks,
    whatsappLink,
}: WelcomeProps) {
    const { props } = usePage();
    const { site, auth } = props;
    const heroRef = useRef<HTMLDivElement>(null);
    const headingTiltRef = usePointerTilt<HTMLHeadingElement>(5);

    useEffect(() => {
        if (!heroRef.current || PREFERS_REDUCED_MOTION) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .from('[data-reveal="eyebrow"]', { opacity: 0, y: 16, duration: 0.6 })
                .from('[data-reveal="heading"]', { opacity: 0, y: 24, duration: 0.8 }, '-=0.35')
                .from('[data-reveal="subhead"]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.45')
                .from('[data-reveal="actions"] > *', { opacity: 0, y: 12, duration: 0.5, stagger: 0.1 }, '-=0.3')
                .from('[data-reveal="scroll-cue"]', { opacity: 0, duration: 0.8 }, '-=0.2');
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const headline = profile?.headline ?? (site.headline as string) ?? '';
    const name = profile?.full_name ?? (site.site_name as string) ?? 'Ankit Vishwakarma';
    const tagline =
        profile?.tagline ??
        'Full stack development, AI/LLM integration, real-time applications, and cloud/DevOps.';
    const contactHref = whatsappLink ?? (site.email ? `mailto:${site.email}` : undefined);

    return (
        <PublicLayout>
            <Head title="Home" />

            <Preloader name={name} />

            {/* Sticky nav - glass so the 3D backdrop still reads through it */}
            <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <button onClick={() => scrollToId('top')} className="text-sm font-semibold tracking-tight text-text">
                        {name}
                    </button>
                    <div className="hidden items-center gap-6 sm:flex">
                        {NAV_SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToId(section.id)}
                                className="text-sm text-muted transition-colors hover:text-text"
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                    {/* Never invite an anonymous visitor to try logging in -
                        the admin/login link only exists once a session is
                        already authenticated, and then it goes straight to
                        the dashboard rather than back through /login. */}
                    {auth.user && (
                        <Link href={route('admin.dashboard')} className="text-xs text-muted hover:text-text">
                            Dashboard
                        </Link>
                    )}
                </nav>
            </header>

            <main id="top" className="relative">
                {/* Hero */}
                <section
                    ref={heroRef}
                    className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
                >
                    {/* The AI globe now sits centered behind the hero content (see
                        HeroScene.tsx) as a glowing "halo" rather than an off-to-the-side
                        accent. This scrim guarantees the name/tagline stay readable on
                        top of it regardless of how bright the globe gets, without
                        having to dim the globe itself everywhere else it's visible. */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10"
                        style={{
                            background:
                                'radial-gradient(ellipse 65% 55% at 50% 42%, rgba(10,9,18,0.65), transparent 70%)',
                        }}
                    />

                    <p data-reveal="eyebrow" className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
                        {headline}
                    </p>

                    <h1
                        ref={headingTiltRef}
                        data-reveal="heading"
                        className="[will-change:transform] max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-6xl"
                        style={{
                            textShadow:
                                '0 1px 0 rgba(139,92,246,0.75), 0 2px 0 rgba(139,92,246,0.65), 0 3px 0 rgba(109,113,246,0.55), 0 4px 0 rgba(79,124,250,0.5), 0 5px 0 rgba(59,130,246,0.45), 0 6px 1px rgba(59,130,246,0.35), 0 9px 14px rgba(10,9,18,0.6), 0 16px 28px rgba(34,211,238,0.3)',
                        }}
                    >
                        {name}
                    </h1>

                    <p data-reveal="subhead" className="mt-6 max-w-xl text-muted">
                        {tagline}
                        {profile && profile.years_experience > 0 ? ` ${profile.years_experience}+ years of experience.` : ''}
                    </p>

                    <div data-reveal="actions" className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Button variant="primary" onClick={() => scrollToId('projects')}>
                            Explore My Work
                        </Button>
                        {contactHref ? (
                            <a href={contactHref} target={whatsappLink ? '_blank' : undefined} rel="noopener noreferrer">
                                <Button variant="secondary">Contact Me</Button>
                            </a>
                        ) : (
                            <Button variant="secondary" onClick={() => scrollToId('contact')}>
                                Contact Me
                            </Button>
                        )}
                    </div>

                    <button
                        type="button"
                        data-reveal="scroll-cue"
                        onClick={() => scrollToId('about')}
                        aria-label="Scroll down"
                        className="absolute bottom-10 flex flex-col items-center gap-2 text-muted transition-colors hover:text-text"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <span className="h-8 w-px animate-pulse bg-current" />
                    </button>
                </section>

                {/* About */}
                <section id="about" className="mx-auto max-w-5xl px-6 py-28">
                    <Reveal>
                        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">About</h2>
                    </Reveal>

                    <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-start">
                        <Reveal delay={0.05} className="mx-auto w-full max-w-[260px] sm:mx-0">
                            <Avatar3D src={profile?.avatar_url ?? null} name={name} />
                        </Reveal>

                        <Reveal delay={0.1} className="glass-panel p-8 sm:p-10">
                            <p className="text-lg leading-relaxed text-text">
                                {profile?.bio ?? profile?.short_bio ?? tagline}
                            </p>

                            {profile?.philosophy && <p className="mt-4 text-muted">{profile.philosophy}</p>}

                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                {profile?.location && (
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">📍 {profile.location}</span>
                                )}
                                {profile?.availability_status && (
                                    <span
                                        className={cn(
                                            'rounded-full px-3 py-1 text-xs font-medium',
                                            profile.availability_status === 'available'
                                                ? 'bg-emerald-500/15 text-emerald-400'
                                                : 'bg-white/10 text-muted'
                                        )}
                                    >
                                        {profile.availability_status === 'available' ? 'Available for work' : profile.availability_status}
                                    </span>
                                )}
                                {profile && profile.years_experience > 0 && (
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                                        {profile.years_experience}+ years experience
                                    </span>
                                )}
                            </div>

                            {socialLinks.length > 0 && (
                                <div className="mt-8 flex items-center gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={link.label ?? link.platform}
                                            className="rounded-full bg-white/5 p-2.5 text-muted transition-colors hover:bg-white/10 hover:text-text"
                                        >
                                            <SocialIcon platform={link.platform} />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </Reveal>
                    </div>
                </section>

                {/* Skills */}
                <section id="skills" className="mx-auto max-w-5xl px-6 py-28">
                    <Reveal>
                        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">Skills</h2>
                    </Reveal>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {skillCategories.map((category, index) => (
                            <Reveal key={category.id} delay={(index % 2) * 0.1}>
                                <FlipCard
                                    heightClassName="h-56"
                                    front={
                                        <div className="glass-panel flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                                            <span className="text-3xl" aria-hidden="true">
                                                {category.icon ?? '🧩'}
                                            </span>
                                            <h3 className="text-lg font-semibold text-text">{category.name}</h3>
                                            <span className="text-xs uppercase tracking-widest text-muted">
                                                {category.skills.length} {category.skills.length === 1 ? 'skill' : 'skills'}
                                            </span>
                                            <span className="mt-1 text-[11px] text-muted/70">Hover to view</span>
                                        </div>
                                    }
                                    back={
                                        <div className="glass-panel flex h-full flex-col justify-center gap-3 overflow-y-auto p-6">
                                            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
                                                {category.name}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {category.skills.map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className={cn(
                                                            'rounded-full border px-3 py-1.5 text-sm',
                                                            skill.is_featured
                                                                ? 'border-primary/40 bg-primary/10 text-text'
                                                                : 'border-white/10 bg-white/5 text-muted'
                                                        )}
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                />
                            </Reveal>
                        ))}

                        {skillCategories.length === 0 && (
                            <p className="col-span-2 text-center text-muted">Skills coming soon.</p>
                        )}
                    </div>
                </section>

                {/* Experience */}
                <section id="experience" className="mx-auto max-w-4xl px-6 py-28">
                    <Reveal>
                        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">Experience</h2>
                    </Reveal>

                    <div className="mt-10 space-y-6">
                        {experiences.map((experience, index) => (
                            <Reveal key={experience.id} delay={index * 0.08} className="glass-panel p-6 sm:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-text">{experience.role_title}</h3>
                                        <p className="text-sm text-muted">{experience.company_name}</p>
                                    </div>
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                                        {EMPLOYMENT_LABELS[experience.employment_type]}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs uppercase tracking-wide text-muted">
                                    {formatMonthYear(experience.start_date)} -{' '}
                                    {experience.is_current ? 'Present' : experience.end_date ? formatMonthYear(experience.end_date) : ''}
                                    {experience.location ? ` · ${experience.location}` : ''}
                                </p>

                                {experience.description && <p className="mt-4 text-muted">{experience.description}</p>}

                                {experience.technologies.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {experience.technologies.map((tech) => (
                                            <span key={tech.id} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Reveal>
                        ))}

                        {experiences.length === 0 && <p className="text-center text-muted">Experience coming soon.</p>}
                    </div>
                </section>

                {/* Projects */}
                <section id="projects" className="mx-auto max-w-5xl px-6 py-28">
                    <Reveal>
                        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">Projects</h2>
                    </Reveal>

                    {projects.length > 0 ? (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2">
                            {projects.map((project, index) => (
                                <Reveal key={project.id} delay={(index % 2) * 0.1}>
                                    <FlipCard
                                        heightClassName="h-64"
                                        front={
                                            <div className="glass-panel flex h-full flex-col justify-between p-6">
                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="font-semibold text-text">{project.title}</h3>
                                                        {project.is_featured && (
                                                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    {project.short_description && (
                                                        <p className="mt-2 text-sm text-muted">{project.short_description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] uppercase tracking-widest text-muted/70">
                                                        {project.classification.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-[11px] text-muted/70">Hover for details</span>
                                                </div>
                                            </div>
                                        }
                                        back={
                                            <div className="glass-panel flex h-full flex-col justify-between p-6">
                                                <div>
                                                    <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
                                                        Built with
                                                    </h4>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {project.technologies.length > 0 ? (
                                                            project.technologies.map((tech) => (
                                                                <span
                                                                    key={tech.id}
                                                                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted"
                                                                >
                                                                    {tech.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-muted">Details coming soon.</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    {project.live_url && (
                                                        <a
                                                            href={project.live_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium text-accent hover:text-accent/80"
                                                        >
                                                            Live demo
                                                        </a>
                                                    )}
                                                    {project.github_url && (
                                                        <a
                                                            href={project.github_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium text-muted hover:text-text"
                                                        >
                                                            Source
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                    />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <Reveal delay={0.1} className="glass-panel mt-10 p-10 text-center">
                            <p className="text-muted">
                                Case studies are being finished in the admin CMS and will appear here once published.
                            </p>
                        </Reveal>
                    )}
                </section>

                {/* Services */}
                <section id="services" className="mx-auto max-w-5xl px-6 py-28">
                    <Reveal>
                        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">Services</h2>
                    </Reveal>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <Reveal key={service.id} delay={(index % 3) * 0.08}>
                                <FlipCard
                                    heightClassName="h-48"
                                    front={
                                        <div className="glass-panel flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                                            <span className="text-2xl" aria-hidden="true">
                                                {service.icon ?? '⚡'}
                                            </span>
                                            <h3 className="font-semibold text-text">{service.title}</h3>
                                            <span className="text-[11px] text-muted/70">Hover for details</span>
                                        </div>
                                    }
                                    back={
                                        <div className="glass-panel flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                                            <p className="text-sm text-muted">
                                                {service.description ?? service.short_description ?? 'Details coming soon.'}
                                            </p>
                                        </div>
                                    }
                                />
                            </Reveal>
                        ))}

                        {services.length === 0 && (
                            <p className="col-span-full text-center text-muted">Services coming soon.</p>
                        )}
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="mx-auto max-w-2xl px-6 py-28 text-center">
                    <Reveal>
                        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Contact</h2>
                        <p className="mt-6 text-2xl font-semibold text-text">Let's build something together.</p>
                        <p className="mt-3 text-muted">
                            {(site.email as string) ?? "Reach out and I'll get back to you."}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            {contactHref && (
                                <a href={contactHref} target={whatsappLink ? '_blank' : undefined} rel="noopener noreferrer">
                                    <Button variant="primary">Get in touch</Button>
                                </a>
                            )}
                        </div>

                        {socialLinks.length > 0 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label ?? link.platform}
                                        className="rounded-full bg-white/5 p-2.5 text-muted transition-colors hover:bg-white/10 hover:text-text"
                                    >
                                        <SocialIcon platform={link.platform} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </Reveal>

                    <p className="mt-16 text-xs text-muted">
                        &copy; {new Date().getFullYear()} {name}. All rights reserved.
                    </p>
                </section>
            </main>
        </PublicLayout>
    );
}
