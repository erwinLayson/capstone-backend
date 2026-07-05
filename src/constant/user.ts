export type User = {
  id: number,
  email: string,
  role: KEY_ROLES
}

export type UserProp = {
  email: string;
  password: string;
  role: KEY_ROLES;
};

export type UserResponseDTO = {
  email: string;
  role: string;
}

export const User_role = {
  ADMIN: 'admin',
  TEACHER: "teacher",
  STUDENT: "student"
} as const;

export type KEY_ROLES = (typeof User_role)[keyof typeof User_role]