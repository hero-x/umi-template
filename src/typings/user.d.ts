declare namespace User {
  type StateData<T> = {
    loading?: boolean
    page?: number
    size?: number
    total?: number
    clue?: string
    data: T
  }
  interface Data {
    id: number
  }
}
