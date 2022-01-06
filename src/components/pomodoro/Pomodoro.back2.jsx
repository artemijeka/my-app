import React from 'react';
import './pomodoro.scss';

import Card from '../card/Card';
import Button from '../button/Button';
import Select from '../select/Select';
import Alert from '../alert/Alert';
import AudioPlayer from '../audioplayer/AudioPlayer';

function Pomodoro(props) {
  /************************************************************ props.store.state.pomodoro ************************************************************/
  function componentDidMount() {//встроенный метод React
    // Если в localStorage остался незаконченный помодоро
    let pomodoroMinutes = Number(localStorage.getItem('pomodoroMinutes'));
    let pomodoroSeconds = Number(localStorage.getItem('pomodoroSeconds'));
    if (pomodoroMinutes !== 0 || pomodoroSeconds !== 0) {
      props.store.state.pomodoro.pomodoroTimer = [pomodoroMinutes, pomodoroSeconds];
      props.store.state.pomodoro.buttonName = pomodoroMinutes + ':' + pomodoroSeconds;
      props.store.state.pomodoro.pomodoroAmountTimer = localStorage.getItem('pomodoroAmountTimer');

      document.title = pomodoroMinutes + ':' + pomodoroSeconds;
    } else {
      // По умолчанию кол-во минут берётся из select а там по умолчанию 30 минут
      props.store.state.pomodoro.pomodoroTimer = [Number(document.querySelector('#pomodoroMinutes').value), props.store.state.pomodoro.pomodoroTimer[1]];//this.pomodoroMinutes.current.value
      props.store.state.pomodoro.pomodoroCurrentTimer = Number(document.querySelector('#pomodoroMinutes').value);
      props.store.state.pomodoro.pomodoroAmountTimer = Number(localStorage.getItem('pomodoroAmountTimer'));
    }
  }

  function startPomodoro() {
    if (props.store.state.pomodoro.break) {
      props.store.state.pomodoro.break = false;
      props.store.state.pomodoro.buttonName = 'Начать';
      return;
    }

    let pomodoroMinutes = Number(localStorage.getItem('pomodoroMinutes'));
    let pomodoroSeconds = Number(localStorage.getItem('pomodoroSeconds'));
    // Если в loacalStorage нет незаконченного помодоро, то берем его из <select>
    if (pomodoroMinutes === 0 && pomodoroSeconds === 0) {
      props.store.state.pomodoro.pomodoroTimer = [Number(document.querySelector('#pomodoroMinutes').value), 0];
      props.store.state.pomodoro.pomodoroCurrentTimer = Number(document.querySelector('#pomodoroMinutes').value);

      localStorage.setItem('pomodoroCurrentTimer', Number(document.querySelector('#pomodoroMinutes').value));
    }

    // Защита от повторного нажатия на таймер помодоро
    if (!props.store.state.pomodoro.pomodoroInterval) {
      props.store.state.pomodoro.audioPlayer = document.getElementById('audioPlayer');
      props.store.state.pomodoro.audioPlayer.play();
      props.store.state.pomodoro.audioPlayerStopPomodoro = document.getElementById('audioPlayerStopPomodoro');

      let pomodoroInterval = setInterval(() => {
        props.store.state.pomodoro.buttonName = props.store.state.pomodoro.pomodoroTimer.join(':');

        // Если секунд становится 0
        // console.log( props.store.state.pomodoro );
        // debugger;
        if (props.store.state.pomodoro.pomodoroTimer[0] !== 0 && props.store.state.pomodoro.pomodoroTimer[1] === 0) {
          props.store.state.pomodoro.pomodoroTimer = [props.store.state.pomodoro.pomodoroTimer[0] - 1, 59];
        }
        // Если таймер закончился:
        else if (props.store.state.pomodoro.pomodoroTimer[0] === 0 && props.store.state.pomodoro.pomodoroTimer[1] === 0) {

          clearInterval(props.store.state.pomodoro.pomodoroInterval);

          props.store.state.pomodoro.audioPlayer.pause();
          props.store.state.pomodoro.audioPlayerStopPomodoro.play();

          props.store.state.pomodoro.pomodoroInterval = null;
          props.store.state.pomodoro.buttonName = 'Отдых';
          props.store.state.pomodoro.break = true;
          props.store.state.pomodoro.pomodoroAmountTimer = Number(localStorage.getItem('pomodoroAmountTimer')) + Number(localStorage.getItem('pomodoroCurrentTimer'));
          props.store.state.pomodoro.pomodoroCurrentTimer = 0;
          localStorage.setItem('pomodoroAmountTimer', Number(localStorage.getItem('pomodoroAmountTimer')) + Number(localStorage.getItem('pomodoroCurrentTimer')));
          localStorage.setItem('pomodoroCurrentTimer', 0);
          document.title = props.store.state.pomodoro.buttonName;

        } else {
          // props.store.state.pomodoro.pomodoroTimer[1] -= 1;
          props.store.state.pomodoro.pomodoroTimer = [props.store.state.pomodoro.pomodoroTimer[0], props.store.state.pomodoro.pomodoroTimer[1] - 1];
        }

        // Обновляем состояние таймера
        props.store.state.pomodoro.pomodoroTimer = [props.store.state.pomodoro.pomodoroTimer[0], props.store.state.pomodoro.pomodoroTimer[1]];
        localStorage.setItem('pomodoroMinutes', props.store.state.pomodoro.pomodoroTimer[0]);
        localStorage.setItem('pomodoroSeconds', props.store.state.pomodoro.pomodoroTimer[1]);
        document.title = props.store.state.pomodoro.buttonName;
      }, 1000);

      props.store.state.pomodoro.pomodoroInterval = pomodoroInterval;

    }
  }


  function resetPomodoro() {
    props.store.state.pomodoro.pomodoroTimer = [0, 0];
    props.store.state.pomodoro.buttonName = 'Отдых';
    props.store.state.pomodoro.break = true;
    localStorage.setItem('pomodoroMinutes', 0);
    localStorage.setItem('pomodoroSeconds', 0);
    document.title = 'Помодоро сброшен';
    localStorage.setItem('pomodoroCurrentTimer', 0);
  }


  function resetAmountTimer() {
    if (window.confirm('Точно сбросить весь таймер?')) {
      props.store.state.pomodoro.pomodoroAmountTimer = 0;

      localStorage.setItem('pomodoroAmountTimer', 0);
      document.title = 'Весь помодоро таймер сброшен!';
    }
  }


  return (
    <Card title="«Техника помодоро», для концентрированной и интенсивной работы.">
      <p className="card__text">
        Желательно таймер не прерывать, прерванный таймер - это уже не «помодоро».
        Если что-то важное придёт в голову, лучше запишите в список дел эту мысль и вернитесь к этому после техники
        «помодоро».
      </p>
      <AudioPlayer id='audioPlayer' loop='loop' audioTrackSrc={props.store.state.pomodoro.noiseUrl} />
      <AudioPlayer id='audioPlayerStopPomodoro' audioTrackSrc={props.store.state.pomodoro.stopPomodoroUrl} />
      <div className="row mt-05">
        <Button
          className={`card__button ${(props.store.state.pomodoro.break) ? '--break' : '--blue'}`}
          onClick={startPomodoro}
        >
          {props.store.state.pomodoro.buttonName}
        </Button>
        <Select
          ref={props.store.state.pomodoro.pomodoroMinutes}//test 
          id="pomodoroMinutes"
          className="card__select"
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
          onClick={resetPomodoro}
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
          onClick={resetAmountTimer}
          title='Сбросить весь таймер!'
        >
          x
        </Button>
      </div>
    </Card>
  );
}

export default Pomodoro;