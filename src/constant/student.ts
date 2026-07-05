export type Student = {
  studentId: number,
  lrn: number,
  email: string,
  fullname: string,
  birthdate: string,
  age: number,
  sex: string
}

export type StudentCreateDTO = {
  userId: number;
  lrn: number,
  email: string,
  firstname: string,
  middlename: string,
  lastname: string,
  suffix?: string | null,
  birthdate: string,
  sex: string,
}

