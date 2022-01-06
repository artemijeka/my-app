import React from 'react';
import './pomodoro.scss';

import Card from '../card/Card';
import Button from '../button/Button';
import Select from '../select/Select';
import Alert from '../alert/Alert';
import AudioPlayer from '../audioplayer/AudioPlayer';

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonName: 'Начать',
      pomodoroTimer: [0, 0],//[min, sec]
      pomodoroCurrentTimer: 0,
      pomodoroAmountTimer: 0,
      pomodoroInterval: null,
      noiseUrl: './audio/noise.mp3',
      stopPomodoroUrl: './audio/end-pomodoro.mp3',
      break: false,
      selectDefaultValue: 30,
    }
    this.pomodoroMinutes = React.createRef();
    this.startPomodoro = this.startPomodoro.bind(this);
    this.resetPomodoro = this.resetPomodoro.bind(this);
    this.resetAmountTimer = this.resetAmountTimer.bind(this);
    this.audioPlayer = null;
    this.audioPlayerStopPomodoro = null;
  }

  componentDidMount() {//встроенный метод React
    // Если в localStorage остался незаконченный помодоро
    let pomodoroMinutes = Number(localStorage.getItem('pomodoroMinutes'));
    let pomodoroSeconds = Number(localStorage.getItem('pomodoroSeconds'));
    if (pomodoroMinutes !== 0 || pomodoroSeconds !== 0) {
      this.setState({
        pomodoroTimer: [pomodoroMinutes, pomodoroSeconds],
        buttonName: pomodoroMinutes + ':' + pomodoroSeconds,
        pomodoroAmountTimer: localStorage.getItem('pomodoroAmountTimer'),
      });

      document.title = pomodoroMinutes + ':' + pomodoroSeconds;
    } else {
      // По умолчанию кол-во минут берётся из select а там по умолчанию 30 минут
      this.setState((state, props) => ({
        pomodoroTimer: [Number(document.querySelector('#pomodoroMinutes').value), state.pomodoroTimer[1]],//this.pomodoroMinutes.current.value
        pomodoroCurrentTimer: Number(document.querySelector('#pomodoroMinutes').value),
        pomodoroAmountTimer: Number(localStorage.getItem('pomodoroAmountTimer')),
      }));
    }
  }

  startPomodoro() {
    if (this.state.break) {
      this.setState({
        break: false,
        buttonName: 'Начать',
      });
      return;
    }

    let pomodoroMinutes = Number(localStorage.getItem('pomodoroMinutes'));
    let pomodoroSeconds = Number(localStorage.getItem('pomodoroSeconds'));
    // Если в loacalStorage нет незаконченного помодоро, то берем его из <select>
    if (pomodoroMinutes === 0 && pomodoroSeconds === 0) {
      this.setState({
        pomodoroTimer: [Number(document.querySelector('#pomodoroMinutes').value), 0],
        pomodoroCurrentTimer: Number(document.querySelector('#pomodoroMinutes').value),
      });
      localStorage.setItem('pomodoroCurrentTimer', Number(document.querySelector('#pomodoroMinutes').value));
    }

    // Защита от повторного нажатия на таймер помодоро
    if (!this.state.pomodoroInterval) {
      this.audioPlayer = document.getElementById('audioPlayer');
      this.audioPlayer.play();
      this.audioPlayerStopPomodoro = document.getElementById('audioPlayerStopPomodoro');

      let pomodoroInterval = setInterval(() => {
        this.setState((state, props) => ({
          buttonName: state.pomodoroTimer.join(':'),
        }));

        // Если секунд становится 0
        if (this.state.pomodoroTimer[0] !== 0 && this.state.pomodoroTimer[1] === 0) {
          this.setState((state, props) => ({
            pomodoroTimer: [state.pomodoroTimer[0] - 1, 59],
          }));
        }
        // Если таймер закончился:
        else if (this.state.pomodoroTimer[0] === 0 && this.state.pomodoroTimer[1] === 0) {

          clearInterval(this.state.pomodoroInterval);

          this.audioPlayer.pause();
          this.audioPlayerStopPomodoro.play();

          this.setState({
            pomodoroInterval: null,
            buttonName: 'Отдых',
            break: true,
            pomodoroAmountTimer: Number(localStorage.getItem('pomodoroAmountTimer')) + Number(localStorage.getItem('pomodoroCurrentTimer')),
            pomodoroCurrentTimer: 0,
          });
          localStorage.setItem('pomodoroAmountTimer', Number(localStorage.getItem('pomodoroAmountTimer')) + Number(localStorage.getItem('pomodoroCurrentTimer')));
          localStorage.setItem('pomodoroCurrentTimer', 0);
          document.title = this.state.buttonName;

        } else {
          // this.state.pomodoroTimer[1] -= 1;
          this.setState((state, props) => ({
            pomodoroTimer: [state.pomodoroTimer[0], state.pomodoroTimer[1] - 1],
          }));
        }

        // Обновляем состояние таймера
        this.setState((state, props) => ({
          pomodoroTimer: [state.pomodoroTimer[0], state.pomodoroTimer[1]],
        }));
        localStorage.setItem('pomodoroMinutes', this.state.pomodoroTimer[0]);
        localStorage.setItem('pomodoroSeconds', this.state.pomodoroTimer[1]);
        document.title = this.state.buttonName;
      }, 1000);

      this.setState({
        pomodoroInterval: pomodoroInterval,
      });

    }
  }


  resetPomodoro() {
    this.setState({
      pomodoroTimer: [0, 0],
      buttonName: 'Отдых',
      break: true,
    });
    localStorage.setItem('pomodoroMinutes', 0);
    localStorage.setItem('pomodoroSeconds', 0);
    document.title = 'Помодоро сброшен';
    localStorage.setItem('pomodoroCurrentTimer', 0);
  }


  resetAmountTimer() {
    if (window.confirm('Точно сбросить весь таймер?')) {
      this.setState({
        pomodoroAmountTimer: 0,
      });
      localStorage.setItem('pomodoroAmountTimer', 0);
      document.title = 'Весь помодоро таймер сброшен!';
    }
  }


  render() {
    return (
      <Card title="«Техника помодоро», для концентрированной и интенсивной работы.">
        <p className="card__text">
          Желательно таймер не прерывать, прерванный таймер - это уже не «помодоро».
          Если что-то важное придёт в голову, лучше запишите в список дел эту мысль и вернитесь к этому после техники
          «помодоро».
        </p>
        <AudioPlayer id='audioPlayer' loop='loop' audioTrackSrc={this.state.noiseUrl}/>
        <AudioPlayer id='audioPlayerStopPomodoro' audioTrackSrc={this.state.stopPomodoroUrl}/>
        <div className="row mt-05">
          <Button
            className={`card__button ${(this.state.break) ? '--break' : '--blue'}`}
            onClick={this.startPomodoro}
          >
            {this.state.buttonName}
          </Button>
          <Select
            ref={this.pomodoroMinutes}//test 
            id="pomodoroMinutes"
            className="card__select"
            defaultValue={this.state.selectDefaultValue}
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
          <Alert className="card__alert" text="минут"/>
          <Button
            className={`card__button --reset`}
            onClick={this.resetPomodoro}
            title='Сбросить текущий помидор!'
          >
            Сбросить
          </Button>
        </div>
        <div className="row mt-05">
          <Alert className="card__alert"
                 text={'Сегодня напомидорил: ' + (this.state.pomodoroAmountTimer / 60).toFixed(2) + ' ч.'}/>
          <Button
            className={`card__button`}
            onClick={this.resetAmountTimer}
            title='Сбросить весь таймер!'
          >
            x
          </Button>
        </div>
      </Card>
    );
  }
}

export default Pomodoro;