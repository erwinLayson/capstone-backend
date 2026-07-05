export type School = {
  schoolId: number,
  name: string,
  district: string,
  division: string,
  region: string
}

export type updateSchoolInfoProps = {
  schoolId?: number,
  name?: string,
  district?: string,
  division?: string,
  region?: string
}

export const allowFields = [
  "schoolId",
  "name",
  "district",
  "division",
  "region",
] as const