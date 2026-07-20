export type SubjectsProps = {
  subjectId: number,
  subjectName: string,
  subjectCode: string,
  subjectUnit: number,
  teacher: {
    teacherId: number,
    teacherFullname: string
  }[],
  class: {
    classId: number,
    classSection: string,
    classGradeLevel: string,
  }[]
}

export type subjectCreateDTO = {
  subjectName: string,
  subjectCode: string,
  SubjectUnit?: number
}

export type subjectResponseDTO = {
  subjectId: number,
  subjectName: string,
  subjectCode: string,
  subjectUnit: number
  teacherId: number,
  teacherFullname: string,
  classId: number,
  classSection: string,
  classGradeLevel: string
}

export type EditSubjectProps = {
  subjectName?: string,
  subjectCode?: string,
  subjectUnit?: number
}

export type SubjectWithAllTeachersAndClass = {
  subjectId: number,
  teacherId: number,
  classId: number,
  classSection: string,
  classYearLevel: string,
  teacherFullname: string,
}
export type techerWithoutThisSubject = {
  subjectId: number,
  teacherId: number,
  teacherFullname: string
}

export const allowFields = [
  "name",
  "code",
  "unit"
] as const