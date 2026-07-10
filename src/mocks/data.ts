export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type ProjectHealth = "ON_TRACK" | "AT_RISK" | "DELAYED";
export type Methodology = "AGILE" | "WATERFALL";

export interface Organization {
  id: string;
  name: string;
  displayName: string;
  industry: string;
  size: string;
  plan: "Free" | "Team" | "Business" | "Enterprise";
  teams: number;
  members: number;
  projects: number;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  lead: string;
  memberCount: number;
  tech: string[];
}

export interface Member {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  team?: string;
  status: "ACTIVE" | "INVITED" | "DISABLED";
  joinedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  dueDate: string;
  progress: number;
  status: "UPCOMING" | "IN_PROGRESS" | "DONE";
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description: string;
  organizationId: string;
  status: ProjectStatus;
  health: ProjectHealth;
  methodology: Methodology;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  startDate: string;
  targetEndDate: string;
  progress: number;
  tech: string[];
  managerId: string;
  memberIds: string[];
  openTasks: number;
  completedTasks: number;
  openBugs: number;
}

export const organizations: Organization[] = [
  {
    id: "org_neuroforge",
    name: "neuroforge",
    displayName: "NeuroForge Labs",
    industry: "Software",
    size: "51-200",
    plan: "Enterprise",
    teams: 6,
    members: 84,
    projects: 12,
    status: "ACTIVE",
    createdAt: "2025-01-14",
  },
  {
    id: "org_nimbus",
    name: "nimbus",
    displayName: "Nimbus Analytics",
    industry: "Data & AI",
    size: "11-50",
    plan: "Business",
    teams: 3,
    members: 27,
    projects: 5,
    status: "ACTIVE",
    createdAt: "2025-04-02",
  },
  {
    id: "org_orbit",
    name: "orbit",
    displayName: "Orbit Robotics",
    industry: "Hardware",
    size: "201-500",
    plan: "Enterprise",
    teams: 9,
    members: 210,
    projects: 18,
    status: "ACTIVE",
    createdAt: "2024-10-11",
  },
];

export const teams: Team[] = [
  {
    id: "team_core",
    organizationId: "org_neuroforge",
    name: "Core Platform",
    description: "Owns the SDLC core services and shared libraries.",
    lead: "Priya Manager",
    memberCount: 12,
    tech: ["Java", "Spring", "PostgreSQL"],
  },
  {
    id: "team_web",
    organizationId: "org_neuroforge",
    name: "Web Experience",
    description: "Front-of-house apps, dashboards and public site.",
    lead: "Dev Chen",
    memberCount: 8,
    tech: ["React", "TypeScript", "Tailwind"],
  },
  {
    id: "team_ai",
    organizationId: "org_neuroforge",
    name: "AI & NeuroBot",
    description: "LLM orchestration, evals and NeuroBot copilot.",
    lead: "Ada Root",
    memberCount: 5,
    tech: ["Python", "LangChain", "PyTorch"],
  },
];

export const members: Member[] = [
  {
    id: "m1",
    organizationId: "org_neuroforge",
    name: "Ada Root",
    email: "super@neuroforge.dev",
    role: "SUPER_ADMIN",
    team: "AI & NeuroBot",
    status: "ACTIVE",
    joinedAt: "2025-01-14",
  },
  {
    id: "m2",
    organizationId: "org_neuroforge",
    name: "Oren Admin",
    email: "admin@neuroforge.dev",
    role: "ORG_ADMIN",
    team: "Core Platform",
    status: "ACTIVE",
    joinedAt: "2025-01-20",
  },
  {
    id: "m3",
    organizationId: "org_neuroforge",
    name: "Priya Manager",
    email: "pm@neuroforge.dev",
    role: "PROJECT_MANAGER",
    team: "Core Platform",
    status: "ACTIVE",
    joinedAt: "2025-02-02",
  },
  {
    id: "m4",
    organizationId: "org_neuroforge",
    name: "Dev Chen",
    email: "dev@neuroforge.dev",
    role: "DEVELOPER",
    team: "Web Experience",
    status: "ACTIVE",
    joinedAt: "2025-03-12",
  },
  {
    id: "m5",
    organizationId: "org_neuroforge",
    name: "Quinn Tester",
    email: "qa@neuroforge.dev",
    role: "QA_TESTER",
    team: "Web Experience",
    status: "ACTIVE",
    joinedAt: "2025-03-18",
  },
  {
    id: "m6",
    organizationId: "org_neuroforge",
    name: "Sasha Stake",
    email: "stake@neuroforge.dev",
    role: "STAKEHOLDER",
    status: "INVITED",
    joinedAt: "2025-05-04",
  },
];

export const projects: Project[] = [
  {
    id: "prj_neurobot",
    key: "NBT",
    name: "NeuroBot Copilot",
    description: "In-product AI copilot for SDLC tasks and knowledge retrieval.",
    organizationId: "org_neuroforge",
    status: "ACTIVE",
    health: "ON_TRACK",
    methodology: "AGILE",
    priority: "HIGH",
    startDate: "2026-02-01",
    targetEndDate: "2026-10-30",
    progress: 62,
    tech: ["TypeScript", "Python", "LLM"],
    managerId: "m3",
    memberIds: ["m3", "m4", "m5"],
    openTasks: 42,
    completedTasks: 118,
    openBugs: 7,
  },
  {
    id: "prj_portfolio",
    key: "PORT",
    name: "Portfolio Insights",
    description: "Executive dashboards, risk scoring and cross-project reporting.",
    organizationId: "org_neuroforge",
    status: "ACTIVE",
    health: "AT_RISK",
    methodology: "AGILE",
    priority: "MEDIUM",
    startDate: "2026-03-14",
    targetEndDate: "2026-09-01",
    progress: 38,
    tech: ["React", "Recharts", "Postgres"],
    managerId: "m3",
    memberIds: ["m3", "m4"],
    openTasks: 26,
    completedTasks: 44,
    openBugs: 12,
  },
  {
    id: "prj_pipelines",
    key: "PIPE",
    name: "Unified Pipelines",
    description: "One-click CI/CD pipelines with policy gates and progressive delivery.",
    organizationId: "org_neuroforge",
    status: "PLANNING",
    health: "ON_TRACK",
    methodology: "AGILE",
    priority: "HIGH",
    startDate: "2026-06-15",
    targetEndDate: "2027-01-30",
    progress: 8,
    tech: ["Go", "Kubernetes", "Argo"],
    managerId: "m3",
    memberIds: ["m3"],
    openTasks: 9,
    completedTasks: 3,
    openBugs: 0,
  },
  {
    id: "prj_atlas",
    key: "ATL",
    name: "Atlas Traceability",
    description: "End-to-end traceability linking requirements, code, tests and releases.",
    organizationId: "org_neuroforge",
    status: "ACTIVE",
    health: "DELAYED",
    methodology: "WATERFALL",
    priority: "CRITICAL",
    startDate: "2025-11-04",
    targetEndDate: "2026-07-01",
    progress: 71,
    tech: ["Java", "Graph DB"],
    managerId: "m3",
    memberIds: ["m3", "m4", "m5"],
    openTasks: 55,
    completedTasks: 132,
    openBugs: 24,
  },
];

export const milestones: Milestone[] = [
  {
    id: "ms1",
    projectId: "prj_neurobot",
    name: "Public Beta",
    dueDate: "2026-08-01",
    progress: 70,
    status: "IN_PROGRESS",
  },
  {
    id: "ms2",
    projectId: "prj_neurobot",
    name: "GA Launch",
    dueDate: "2026-10-30",
    progress: 20,
    status: "UPCOMING",
  },
  {
    id: "ms3",
    projectId: "prj_portfolio",
    name: "Executive Dashboards",
    dueDate: "2026-07-15",
    progress: 55,
    status: "IN_PROGRESS",
  },
  {
    id: "ms4",
    projectId: "prj_atlas",
    name: "Requirements Graph",
    dueDate: "2026-05-30",
    progress: 100,
    status: "DONE",
  },
];
