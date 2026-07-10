import {
  organizations as seedOrganizations,
  teams as seedTeams,
  members as seedMembers,
  projects as seedProjects,
  milestones as seedMilestones,
  type Organization,
  type Team,
  type Member,
  type Project,
  type Milestone,
} from "@/mocks/data";

const KEY = "neuroforge.mockStore.v1";

interface MockState {
  organizations: Organization[];
  teams: Team[];
  members: Member[];
  projects: Project[];
  milestones: Milestone[];
}

const seed = (): MockState => ({
  organizations: [...seedOrganizations],
  teams: [...seedTeams],
  members: [...seedMembers],
  projects: [...seedProjects],
  milestones: [...seedMilestones],
});

let cache: MockState | null = null;

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function load(): MockState {
  if (cache) return cache;
  if (!isBrowser()) {
    cache = seed();
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      cache = JSON.parse(raw) as MockState;
      return cache;
    }
  } catch {
    /* noop */
  }
  cache = seed();
  save();
  return cache;
}

function save() {
  if (!isBrowser() || !cache) return;
  window.localStorage.setItem(KEY, JSON.stringify(cache));
}

export const mockStore = {
  reset() {
    cache = seed();
    save();
  },
  snapshot(): MockState {
    return load();
  },
  update(mutator: (draft: MockState) => void) {
    const state = load();
    mutator(state);
    save();
  },
};
