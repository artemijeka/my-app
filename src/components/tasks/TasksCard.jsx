import React, { useState, useEffect } from 'react';

import Card from '../card/Card';
import Button from '../button/Button';

function TasksCard(props) {
  // const [count, setCount] = useState(0);
  // const [isOnline, setIsOnline] = useState(null);

  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(()=>{
  // });

  return (
    <Card title="Мои задачи">
      <div className="tasks-card__list">
        {props.state.tasksList}
      </div>
      <div className="row js-c mt-05">
        <Button
          className="tasks-item__button --green"
          title="Добавить задачу!"
          onClick={props.state.addTask(props.state)}>
          +
        </Button>
        <Button
          className="tasks-item__button --yellow"
          title="Загрузить на сервер!"
          onClick={props.state.uploadTasksToServer(props.state)}>
          ^
        </Button>
      </div>
    </Card>
  );
}

export default TasksCard;
