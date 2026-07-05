export interface TeacherCreateDTO {
  email: string,
  firstname: string,
  middlename: string,
  lastname: string,
  suffix?: string
};

export type Teacher = {
  techerId: number,
  email: string,
  fullname: string
}

export interface TeachersDTO extends TeacherCreateDTO {
  userId: number
}

export interface TeacherUpdateDTO {
  email?: string,
  firstname?: string,
  middlename?: string,
  lastname?: string,
  suffix?: string
};

export const allowFields = [
  "email",
  "firstname",
  "middlename",
  "lastname",
  "suffix"
] as const;