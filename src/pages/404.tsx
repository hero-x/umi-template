/**
 * title: 404页面
 */
import React from 'react'
import { useHistory } from "umi";
import './index.less'

const Page404 = () => {
  const history = useHistory()
  function goBack() {
    history.goBack()
  }
  return (
    <div className='page404'>
      <div>
        <span>404页面不存在 </span>
        <div className='goBack' onClick={goBack}> 返回</div>
      </div>
    </div>
  )
}
export default Page404
