import './button.scss';

function Button(props) {
  return (
    <button
      className={`button ${props.className}`}
      onClick={props.onClick}
      title={props.title}
    >
      {props.children}
    </button>
  );
}

export default Button;