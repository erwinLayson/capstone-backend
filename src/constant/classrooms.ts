export type Classroom = {
  classId?: number,
  adviserId: number,
  section: string,
  gradeLevel: number,
  adviserName: string
}

export const allowedFields = [
  "classId",
  "section",
  "gradeLevel",
  "adviserId"
] as const

export type ClassroomCreateDTO = {
  section: string,
  gradeLevel: number,
  adviserId?: number,
}

export type ClassroomUpdated = {
  classId?: number,
  adviserId?: number,
  section?: string,
  gradeLevel?: number
}