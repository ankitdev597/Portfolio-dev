import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import SummerTraining from "@/components/SummerTraining";
import DevOps from "@/components/DevOps";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import PortfolioQR from "@/components/PortfolioQR";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <SummerTraining />
      <DevOps />
      <Projects />
      <Services />
      <PortfolioQR />
      <Contact />
    </>
  );
}
