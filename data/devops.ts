/**
 * DevOps & Infrastructure capabilities drawn from skills + experience
 * already represented on this portfolio. No invented tooling or metrics.
 */
export interface DevOpsCapability {
  title: string;
  description: string;
  tags: string[];
}

export const devopsIntro =
  "Infrastructure and release workflows I use when shipping production applications — focused on the AWS, Linux, and CI/CD practices already reflected in my experience.";

export const devopsCapabilities: DevOpsCapability[] = [
  {
    title: "AWS application delivery",
    description:
      "Deploying and operating application workloads on AWS with EC2 compute plus SES and SNS for transactional email and notifications.",
    tags: ["AWS EC2", "SES", "SNS"],
  },
  {
    title: "CI/CD & release automation",
    description:
      "Designing and automating build-and-deploy pipelines with SSH and Bash scripting for Linux provisioning and repeatable releases.",
    tags: ["CI/CD Pipelines", "SSH", "Bash Scripting"],
  },
  {
    title: "Linux server operations",
    description:
      "Administering Linux servers for production environments — access, process management, and day-to-day operational care.",
    tags: ["Linux Server Administration"],
  },
  {
    title: "Web servers & TLS",
    description:
      "Configuring and maintaining Nginx or Apache frontends with SSL certificates for secure, high-availability production traffic.",
    tags: ["Nginx", "Apache", "SSL Configuration"],
  },
  {
    title: "Environment & configuration",
    description:
      "Keeping application environments consistent across releases — server config, TLS setup, and the operational steps that make deployments repeatable.",
    tags: ["SSL Configuration", "Linux Server Administration", "Bash Scripting"],
  },
  {
    title: "Reliability fundamentals",
    description:
      "Workflow concepts for keeping production apps healthy: structured troubleshooting, log-aware debugging, and secure high-availability frontends — without claiming specialized monitoring platforms.",
    tags: ["Nginx", "Apache", "CI/CD Pipelines"],
  },
];
