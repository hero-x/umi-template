import { UserStateType } from './user'

export interface Loading {
  global: boolean
  effects: { [key: string]: boolean | undefined }
  models: {
    setting?: boolean
  }
}

export interface ConnectState {
  user: UserStateType
  loading: Loading
}
