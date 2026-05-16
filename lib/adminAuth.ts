export const ADMIN_SESSION_KEY = "dealspot_admin_session";

const ADMIN_USERNAME = "dealspot";
const ADMIN_PASSWORD = "1234";

export type AdminSession = {
  isAuthenticated: true;
  username: string;
  loginAt: string;
};

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const normalizeUsername = (value: string) => value.trim().toLowerCase();

export const readAdminSession = (): AdminSession | null => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed?.isAuthenticated && parsed.username) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => readAdminSession() !== null;

export const createAdminSession = (username: string) => {
  if (!canUseStorage()) {
    return;
  }

  const session: AdminSession = {
    isAuthenticated: true,
    username,
    loginAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const clearAdminSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const loginAdmin = (username: string, password: string) => {
  const valid =
    normalizeUsername(username) === ADMIN_USERNAME && password === ADMIN_PASSWORD;

  if (!valid) {
    return false;
  }

  createAdminSession(ADMIN_USERNAME);
  return true;
};

export const sanitizeAdminNextPath = (value: string | null) => {
  if (!value || !value.startsWith("/admin")) {
    return "/admin";
  }

  return value;
};
