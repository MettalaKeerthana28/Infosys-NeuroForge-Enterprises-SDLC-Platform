import { mockStore } from "./mockStore";
import type { Member, Organization, Team } from "@/mocks/data";

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const organizationsApi = {
  async list(): Promise<Organization[]> {
    await wait();
    return mockStore.snapshot().organizations;
  },
  async get(id: string): Promise<Organization | undefined> {
    await wait();
    return mockStore.snapshot().organizations.find((o) => o.id === id);
  },
  async create(input: Omit<Organization, "id" | "createdAt" | "teams" | "members" | "projects" | "status">): Promise<Organization> {
    await wait();
    const org: Organization = {
      ...input,
      id: `org_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      teams: 0,
      members: 1,
      projects: 0,
      status: "ACTIVE",
    };
    mockStore.update((s) => {
      s.organizations.unshift(org);
    });
    return org;
  },
  async teamsFor(organizationId: string): Promise<Team[]> {
    await wait();
    return mockStore.snapshot().teams.filter((t) => t.organizationId === organizationId);
  },
  async createTeam(input: Omit<Team, "id" | "memberCount">): Promise<Team> {
    await wait();
    const team: Team = { ...input, id: `team_${Date.now()}`, memberCount: 1 };
    mockStore.update((s) => {
      s.teams.push(team);
      const org = s.organizations.find((o) => o.id === input.organizationId);
      if (org) org.teams += 1;
    });
    return team;
  },
  async membersFor(organizationId: string): Promise<Member[]> {
    await wait();
    return mockStore.snapshot().members.filter((m) => m.organizationId === organizationId);
  },
  async inviteMember(input: Omit<Member, "id" | "status" | "joinedAt">): Promise<Member> {
    await wait();
    const member: Member = {
      ...input,
      id: `m_${Date.now()}`,
      status: "INVITED",
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    mockStore.update((s) => {
      s.members.push(member);
      const org = s.organizations.find((o) => o.id === input.organizationId);
      if (org) org.members += 1;
    });
    return member;
  },
};
