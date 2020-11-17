import { Modal } from 'antd'

if (Modal.defaultProps) {
  Modal.defaultProps.centered = true
  Modal.defaultProps.cancelText = '取消'
  Modal.defaultProps.okText = '确认'
}
