export interface UserData {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  accessToken: string;
}

export interface UserState {
  email: string | null;
  id: string | null;
  accessToken: string | null;
  name: string | null;
  lastLogin: string | null;
}
