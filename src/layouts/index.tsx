import React from 'react'
import './index.less'
import { Layout } from 'antd'
const { Header, Content, Sider } = Layout
interface BasicLayoutProps {
  location?: any
}
const BasicLayout: React.FC<BasicLayoutProps> = props => {
  return (
    <Layout style={{ height: '100%' }}>
      <Header>
        头部
      </Header>
      <Layout>
        <Content
          style={{
            margin: 0,
            width: '100%',
            height: '100%',
            overflow: 'auto'
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
