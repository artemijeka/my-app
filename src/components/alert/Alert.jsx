import './alert.scss';

function Alert(props) {
  return (
    <strong className={`alert ${props.className}`}>{props.text}</strong>
  );
}

export default Alert;