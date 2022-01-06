import React from 'react';

import './tasks-card.scss';
import TasksCard from './TasksCard';

function Tasks(props) {
  return (
    <TasksCard state={props.state} />
  );
}

export default Tasks;