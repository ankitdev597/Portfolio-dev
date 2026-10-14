import type { ComponentType } from "react";
import type { ServiceVisual } from "@/data/services";
import FullstackVisual from "./FullstackVisual";
import DatabaseVisual from "./DatabaseVisual";
import WorkflowVisual from "./WorkflowVisual";
import LaravelVisual from "./LaravelVisual";
import ReactVisual from "./ReactVisual";
import MernVisual from "./MernVisual";
import AIIntegrationVisual from "./AIIntegrationVisual";
import ApiBackendVisual from "./ApiBackendVisual";
import CloudInfrastructureVisual from "./CloudInfrastructureVisual";
import CICDPipelineVisual from "./CICDPipelineVisual";
import DeploymentVisual from "./DeploymentVisual";
import RealtimeVisual from "./RealtimeVisual";

/**
 * Typed registry: every ServiceVisual key maps to exactly one illustration.
 * Exhaustive Record ensures missing services fail at compile time.
 */
export const SERVICE_VISUAL_REGISTRY: Record<
  ServiceVisual,
  ComponentType
> = {
  fullstack: FullstackVisual,
  database: DatabaseVisual,
  automation: WorkflowVisual,
  laravel: LaravelVisual,
  react: ReactVisual,
  mern: MernVisual,
  ai: AIIntegrationVisual,
  api: ApiBackendVisual,
  aws: CloudInfrastructureVisual,
  cicd: CICDPipelineVisual,
  server: DeploymentVisual,
  realtime: RealtimeVisual,
};

export function ServiceIllustration({ visual }: { visual: ServiceVisual }) {
  const Comp = SERVICE_VISUAL_REGISTRY[visual];
  return <Comp />;
}

export {
  DatabaseVisual,
  WorkflowVisual,
  CICDPipelineVisual,
};
