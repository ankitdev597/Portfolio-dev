"use client";

import { motion } from "motion/react";
import { skillCategories } from "@/data/skills";
import Reveal from "@/components/Reveal";

export default function Skills() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Skills
          </p>
          <span className="divider-premium" />
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {skillCategories.map((category, i) => (
            <Reveal key={category.name} delay={(i % 4) * 0.06}>
              <motion.div
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="glass-panel group relative flex h-44 flex-col justify-between overflow-hidden p-5"
              >
                <div>
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="mt-3 text-sm font-semibold text-text">{category.name}</h3>
                  <p className="mt-1 text-xs text-muted">{category.skills.length} skills</p>
                </div>

                <motion.span
                  variants={{ rest: { opacity: 1, y: 0 }, hover: { opacity: 0, y: -6 } }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary"
                >
                  Hover to view
                </motion.span>

                <motion.div
                  variants={{
                    rest: { opacity: 0, y: 10, pointerEvents: "none" },
                    hover: { opacity: 1, y: 0, pointerEvents: "auto" },
                  }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex flex-col justify-center gap-2 bg-surface/95 p-5 backdrop-blur-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {category.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-text"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
