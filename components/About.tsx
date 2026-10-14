import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import AboutCard from "@/components/AboutCard";

export default function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About"
        description="A clear snapshot of who I am, how I work, and how to reach me — one profile card you can scan or download as an image."
      />

      <Reveal className="section-stack">
        <AboutCard />
      </Reveal>
    </Section>
  );
}
