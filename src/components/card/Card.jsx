import './card.scss';

function Card(props) {
  return (
    <div className="card">
    <h2 className="card__title">{props.title}</h2>
      {props.children}
    </div>
  );
}

export default Card;