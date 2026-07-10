import { mockStore } from "./mockStore";
import type { Milestone, Project } from "@/mocks/data";

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const projectsApi = {
  async list(): Promise<Project[]> {
    await wait();
    return mockStore.snapshot().projects;
  },
  async get(id: string): Promise<Project | undefined> {
    await wait();
    return mockStore.snapshot().projects.find((p) => p.id === id);
  },
  async create(input: Omit<Project, "id" | "progress" | "openTasks" | "completedTasks" | "openBugs">): Promise<Project> {
    await wait();
    const project: Project = {
      ...input,
      id: `prj_${Date.now()}`,
      progress: 0,
      openTasks: 0,
      completedTasks: 0,
      openBugs: 0,
    };
    mockStore.update((s) => {
      s.projects.unshift(project);
      const org = s.organizations.find((o) => o.id === input.organizationId);
      if (org) org.projects += 1;
    });
    return project;
  },
  async milestonesFor(projectId: string): Promise<Milestone[]> {
    await wait();
    return mockStore.snapshot().milestones.filter((m) => m.projectId === projectId);
  },
};
