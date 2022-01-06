import './select.scss';

function Select(props) {
  return (
    <select
      id={props.id}
      className={`select ${props.className}`}
      defaultValue={props.defaultValue}
    >
      {props.optionsList}
    </select>
  );
}

export default Select;