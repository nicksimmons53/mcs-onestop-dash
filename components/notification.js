import { SemanticToastContainer, toast } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

const Notification = ({ header, message, visible }) => {
  return (
    <SemanticToastContainer
      time={10}
      title={"Test"}
      color={"black"}
      position={"bottom-left"}
    />
  )
}

export default Notification;