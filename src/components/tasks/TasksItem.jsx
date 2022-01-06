import React from 'react';

import Button from '../button/Button';

class TasksItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.content,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    return (
      <div
        className={'tasks-item ' + this.props.className}
        id={this.props.id}
        key={this.props.key}
        data-key={this.props['data-key']}
        data-created={this.props['data-created']}
      >
        <textarea
          className='tasks-item__content'
          value={this.state.value}
          content={this.props.content}
          onChange={this.handleChange}
        >
        </textarea>
        <Button
          className="tasks-item__button --yellow"
          title="Сохранить!"
          onClick={this.props.tasksItemSave}
        >S</Button>
        <Button
          className="tasks-item__button --green"
          title="Задача выполнена!"
        >V</Button>
        <Button
          className="tasks-item__button"
          title="Удалить задачу!"
          onClick={this.props.tasksItemDelete}
        >X</Button>
      </div>
    );
  }
}

export default TasksItem;