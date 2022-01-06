import React, { useState, useEffect } from 'react';
import './pomodoro.scss';

import Card from '../card/Card';
import Button from '../button/Button';
import Select from '../select/Select';
import Alert from '../alert/Alert';

const Pomodoro = (props) => {
  /****************************************** props.store.state.pomodoro ******************************************/
  // const [count, setCount] = useState(0);
  // const [isOnline, setIsOnline] = useState(null);

  // Similar to componentDidMount and componentDidUpdate:
  // useEffect(()=>{
  // });

  return (
    <Card title="«Техника помодоро», для концентрированной и интенсивной работы.">
      <p className="card__text">
        Желательно таймер не прерывать, прерванный таймер - это уже не «помодоро».
        Если что-то важное придёт в голову, лучше запишите в список дел эту мысль и вернитесь к этому после техники
        «помодоро».
      </p>
      <div className="row mt-05">
        <Button
          className={`card__button ${(props.store.state.pomodoro.break) ? '--break' : '--blue'}`}
          onClick={props.store.state.pomodoro.startPomodoro(props.store.state.pomodoro)}
        >
          {props.store.state.pomodoro.getButtonName(props.store.state.pomodoro)}
        </Button>
        <Select
          id="pomodoroMinutes"
          className="card__select"
          onChange={props.store.state.pomodoro.handlerChangeMinutes}
          defaultValue={props.store.state.pomodoro.selectDefaultValue}
          optionsList={
            <>
              <option key="5">5</option>
              <option key="10">10</option>
              <option key="15">15</option>
              <option key="20">20</option>
              <option key="25">25</option>
              <option key="30">30</option>
              <option key="35">35</option>
              <option key="40">40</option>
              <option key="45">45</option>
              <option key="50">50</option>
              <option key="55">55</option>
              <option key="60">60</option>
            </>
          }
        />
        <Alert className="card__alert" text="минут" />
        <Button
          className={`card__button --reset`}
          onClick={props.store.state.pomodoro.resetPomodoro}
          title='Сбросить текущий помидор!'
        >
          Сбросить
        </Button>
      </div>
      <div className="row mt-05">
        <Alert className="card__alert"
          text={'Сегодня напомидорил: ' + (props.store.state.pomodoro.pomodoroAmountTimer / 60).toFixed(2) + ' ч.'} />
        <Button
          className={`card__button`}
          onClick={props.store.state.pomodoro.resetAmountPomodoroTimer}
          title='Сбросить весь таймер!'
        >
          x
        </Button>
      </div>
    </Card>
    
  );
}


export default Pomodoro;