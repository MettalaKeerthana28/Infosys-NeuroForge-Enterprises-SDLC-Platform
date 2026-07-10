import type { AppRole } from "./types";

export type Permission =
  | "platform.view"
  | "organizations.viewAll"
  | "organizations.create"
  | "organization.manage"
  | "teams.manage"
  | "members.invite"
  | "projects.viewAll"
  | "projects.create"
  | "projects.edit"
  | "tasks.updateOwn"
  | "qa.verify"
  | "reports.view";

const MATRIX: Record<AppRole, Permission[]> = {
  SUPER_ADMIN: [
    "platform.view",
    "organizations.viewAll",
    "organizations.create",
    "organization.manage",
    "teams.manage",
    "members.invite",
    "projects.viewAll",
    "projects.create",
    "projects.edit",
    "reports.view",
  ],
  ORG_ADMIN: [
    "organization.manage",
    "teams.manage",
    "members.invite",
    "projects.viewAll",
    "projects.create",
    "projects.edit",
    "reports.view",
  ],
  PROJECT_MANAGER: [
    "projects.viewAll",
    "projects.create",
    "projects.edit",
    "reports.view",
  ],
  DEVELOPER: ["tasks.updateOwn", "reports.view"],
  QA_TESTER: ["qa.verify", "reports.view"],
  STAKEHOLDER: ["reports.view"],
  ROLE_USER: ["reports.view"],
};

export function can(role: AppRole | undefined, perm: Permission): boolean {
  if (!role) return false;
  return MATRIX[role]?.includes(perm) ?? false;
}

export function hasAnyRole(role: AppRole | undefined, roles: AppRole[]): boolean {
  return !!role && roles.includes(role);
}

export const ROLE_LABEL: Record<AppRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ORG_ADMIN: "Org Admin",
  PROJECT_MANAGER: "Project Manager",
  DEVELOPER: "Developer",
  QA_TESTER: "QA Tester",
  STAKEHOLDER: "Stakeholder",
  ROLE_USER: "Member",
};
