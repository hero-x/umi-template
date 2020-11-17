/**
 * Created by pxfeng on 2020-11-17
 */
import { Effect } from 'dva'
import { Reducer } from 'redux'
import { userApi } from '@/services'

export interface UserStateType {
  data: User.StateData<User.Data>
  value: number
}

export interface ModelType {
  namespace: string;
  state: UserStateType;
  effects: {
    fetchData: Effect;
    add: Effect;
    del: Effect;
  }
  reducers: {
    save: Reducer<UserStateType>;
    reset: Reducer<UserStateType>;
  };
}

const initState: UserStateType = {
  data: {
    page: 1,
    size: 10,
    clue: '',
    total: 0,
    data: {
      id: 1
    }
  },
  value: 0
}

const UserModel: ModelType = {
  namespace: 'user',
  state: {
    ...initState
  },
  reducers: {
    save(state, { payload: json }) {
      return {
        ...state,
        ...json
      }
    },
    reset(state) {
      return {
        ...state,
        ...initState
      }
    }

  },
  effects: {
    * fetchData({ payload }, { call, put, select }) {
      const state = yield select((state: { user: UserStateType }) => state.user.data)
      try {
        const res = yield call(userApi.getData, {
          page: state.page,
          per_page: state.size,
          ...payload
        })
        yield put({
          type: 'save',
          payload: {
            value: {
              loading: false,
              data: res.data,
              page: res.meta.current_page,
              size: res.meta.per_page,
              total: res.meta.total
            }
          }
        })
      } catch (e) {
        console.log('----e 打印：', e)
      }
    },
    * add({ payload }, { put, select }) {
      const state = yield select((state: { user: UserStateType }) => state.user)
      let {value} = state
      yield put({
        type: 'save',
        payload: {
          value: ++value
        }
      })
    },
    * del({ payload }, { call, put, select }) {
      const state = yield select((state: { user: UserStateType }) => state.user)
      let {value} = state
      yield put({
        type: 'save',
        payload: {
          value: --value
        }
      })
    }
  }
}

export default UserModel

