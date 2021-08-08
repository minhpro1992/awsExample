export type PointType = {
    ID: string,
    firstName?: string,
    lastName?: string,
    age?: number
}

export type Error = { message: string }

export type Response = {
  code: number
  status: string
  data: Record<string, unknown>
}
