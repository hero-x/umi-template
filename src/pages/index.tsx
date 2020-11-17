import React from 'react'
import { Button } from 'antd'
import { connect, Dispatch } from 'dva'
import { ConnectState } from '@/models/connect'
import './index.less'

interface IndexProps extends ConnectState {
  dispatch: Dispatch
}
const Index = (props: IndexProps) => {
  const { dispatch, user } = props
  function add () {
    dispatch({
      type: 'user/add'
    })
  }
  function del () {
    dispatch({
      type: 'user/del'
    })
  }
  return (
    <div className='test'>
      <Button onClick={add}>增加</Button>
      <div>{user.value}</div>
      <Button onClick={del}>减少</Button>
    </div>
  )
}
export default connect(({ user }: ConnectState) => ({
  user
}))(Index)
