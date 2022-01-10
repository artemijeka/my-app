import React from 'react';

import axios from 'axios';

import TasksItem from '../components/tasks/TasksItem';
import '../components/tasks/tasks-item.scss';

const store = {
  state: {
    pomodoro: {
      buttonName: 'Начать',
      pomodoroTimer: [0, 0],//[min, sec]
      pomodoroCurrentTimer: 0,
      pomodoroAmountTimer: 0,
      pomodoroInterval: null,
      break: false,
      selectDefaultValue: 30,
      pomodoroMinutes: 30,
      audioPlayer: new Audio('./audio/noise-pomodoro.mp3'),
      audioPlayerStopPomodoro: new Audio('./audio/end-pomodoro.mp3'),

      getButtonName: (pomodoro) => {
        // debugger;
        return pomodoro.buttonName;
      },

      startPomodoro: (pomodoro) => {
        if (pomodoro.break) {
          pomodoro.break = false;
          pomodoro.buttonName = 'Начать';
          return;
        }

        let pomodoroMinutes = Number(localStorage.getItem('pomodoroMinutes'));
        let pomodoroSeconds = Number(localStorage.getItem('pomodoroSeconds'));
        // Если в loacalStorage нет незаконченного помодоро, то берем его из <select>
        if (pomodoroMinutes === 0 && pomodoroSeconds === 0) {
          pomodoro.pomodoroTimer = [Number(pomodoro.pomodoroMinutes), 0];
          pomodoro.pomodoroCurrentTimer = Number(pomodoro.pomodoroMinutes);

          localStorage.setItem('pomodoroCurrentTimer', Number(pomodoro.pomodoroMinutes));
        }

        // Защита от повторного нажатия на таймер помодоро
        if (!pomodoro.pomodoroInterval) {
          pomodoro.audioPlayer.loop = true;
          pomodoro.audioPlayer.type = 'audio/mpeg';
          pomodoro.audioPlayer.play();

          let pomodoroInterval = setInterval(() => {
            pomodoro.buttonName = pomodoro.pomodoroTimer.join(':');

            // Если секунд становится 0
            // console.log( props.store.pomodoro.pomodoro );
            // debugger;
            if (pomodoro.pomodoroTimer[0] !== 0 && pomodoro.pomodoroTimer[1] === 0) {
              pomodoro.pomodoroTimer = [pomodoro.pomodoroTimer[0] - 1, 59];
            }
            // Если таймер закончился:
            else if (pomodoro.pomodoroTimer[0] === 0 && pomodoro.pomodoroTimer[1] === 0) {

              clearInterval(pomodoro.pomodoroInterval);

              pomodoro.audioPlayer.pause();
              pomodoro.audioPlayerStopPomodoro.play();

              pomodoro.pomodoroInterval = null;
              pomodoro.buttonName = 'Отдых';
              pomodoro.break = true;
              pomodoro.pomodoroAmountTimer = Number(localStorage.getItem('pomodoroAmountTimer')) + Number(localStorage.getItem('pomodoroCurrentTimer'));
              pomodoro.pomodoroCurrentTimer = 0;
              localStorage.setItem('pomodoroAmountTimer', Number(localStorage.getItem('pomodoroAmountTimer')) + Number(localStorage.getItem('pomodoroCurrentTimer')));
              localStorage.setItem('pomodoroCurrentTimer', 0);
              document.title = pomodoro.buttonName;

            } else {
              // pomodoro.pomodoroTimer[1] -= 1;
              pomodoro.pomodoroTimer = [pomodoro.pomodoroTimer[0], pomodoro.pomodoroTimer[1] - 1];
            }

            // Обновляем состояние таймера
            pomodoro.pomodoroTimer = [pomodoro.pomodoroTimer[0], pomodoro.pomodoroTimer[1]];
            localStorage.setItem('pomodoroMinutes', pomodoro.pomodoroTimer[0]);
            localStorage.setItem('pomodoroSeconds', pomodoro.pomodoroTimer[1]);
            document.title = pomodoro.buttonName;
          }, 1000);

          pomodoro.pomodoroInterval = pomodoroInterval;

        }
      },

      handlerChangeMinutes() {
        console.log(this.value);
        return this.value;
      },

      resetPomodoro: (pomodoro) => {
        pomodoro.pomodoroTimer = [0, 0];
        pomodoro.buttonName = 'Отдых';
        pomodoro.break = true;
        localStorage.setItem('pomodoroMinutes', 0);
        localStorage.setItem('pomodoroSeconds', 0);
        document.title = 'Помодоро сброшен';
        localStorage.setItem('pomodoroCurrentTimer', 0);
      },

      resetAmountPomodoroTimer: (pomodoro) => {
        if (window.confirm('Точно сбросить весь таймер?')) {
          pomodoro.pomodoroAmountTimer = 0;

          localStorage.setItem('pomodoroAmountTimer', 0);
          document.title = 'Весь помодоро таймер сброшен!';
        }
      },

    },
    tasksCard: {
      tasksList: [],
      maxTasksKey: 0,
      serverURL: 'https://web.master-artem.ru/api/my-app/server.php',
      addTask: (tasksCard) => {
        console.log('adding task...');
        if (tasksCard.idb) {
          tasksCard.transaction = tasksCard.idb.transaction('tasks-card', 'readwrite');

          let tasksCardTransaction = tasksCard.transaction.objectStore("tasks-card");

          let newTask = {
            key: tasksCard.state.maxTasksKey + 1,
            content: '',
            created: new Date(),
          };
          console.log(newTask.key);
          console.log(tasksCard.state.maxTasksKey);

          let request = tasksCardTransaction.add(newTask);//, task.id

          tasksCard.transaction.oncomplete = function () {
            console.log("Транзакция добавления задачи выполнена");
          };

          let newTaskJSX = (
            <TasksItem
              content={newTask.content}
              data-created={newTask.created}
              data-key={newTask.key}
              id={`i-${newTask.key}`}
              className='tasks-list__tasks-item'
              key={newTask.key}
              tasksItemSave={tasksCard.tasksItemSave}
              tasksItemDelete={tasksCard.tasksItemDelete} />
          );

          request.onsuccess = function () {
            console.log("Задача добавлена в хранилище объектов (idb): ", request.result);

            tasksCard.setState((state, props) => ({
              tasksList: state.tasksList.concat(newTaskJSX),
              maxTasksKey: state.maxTasksKey + 1
            }));
          }.bind(tasksCard);

          request.onerror = function (event) {
            console.log("Ошибка: ", request.error);
            // ConstraintError возникает при попытке добавить объект с ключом, который уже существует
            if (request.error.name === "ConstraintError") {
              console.log("Задача с таким id в idb уже существует!");//обрабатываем ошибку
              event.preventDefault(); // предотвращаем отмену транзакции
              event.stopPropagation(); // предотвращаем всплытие ошибки
              // ...можно попробовать использовать другой ключ...
            } else {
              // ничего не делаем // транзакция будет отменена // мы можем обработать ошибку в transaction.onabort
            }
          };
        }

        // Чтобы вручную отменить транзакцию, выполните:
        // tasksCard.transaction.onabort = function() {
        //   console.log("Ошибка", transaction.error);
        // };
      },/* addTask() */
      tasksItemSave: (e) => {
        console.log('saving this task!!!');
        let curTasksItem = e.target.parentElement;
        console.log(curTasksItem);
        let updateTask = {
          key: +curTasksItem.dataset.key,
          content: curTasksItem.querySelector('.tasks-item__content').value,
          updated: new Date(),
          created: curTasksItem.dataset.created,
        };
        console.log(updateTask);

        console.log('update task...');

        this.transaction = this.idb.transaction('tasks-card', 'readwrite');
        this.tasksCardTransaction = this.transaction.objectStore("tasks-card");

        let request = this.tasksCardTransaction.put(updateTask);

        // this.transaction.oncomplete = function () {
        //   console.log("Транзакция обновления задачи выполнена");
        // };

        request.onsuccess = function () {
          console.log("Задача обновлена в idb: ", request.result);
        };

        request.onerror = function (event) {
          console.log("Ошибка обновления задачи в idb: ", request.error);
        };
      },/* tasksItemSave() */
      tasksItemDelete: (e) => {
        console.log('deleting this task!!!');
        let curTasksItem = e.target.parentElement;
        let curTasksItemKey = +curTasksItem.dataset.key;
        this.transaction = this.idb.transaction('tasks-card', 'readwrite');
        this.tasksCardTransaction = this.transaction.objectStore("tasks-card");

        console.log(curTasksItemKey);

        let updateTask = {
          key: +curTasksItem.dataset.key,
          content: curTasksItem.querySelector('.tasks-item__content').value,
          deleted: new Date(),
          created: curTasksItem.dataset.created,
        };

        let request = this.tasksCardTransaction.put(updateTask);

        // this.transaction.oncomplete = function() {
        //   console.log("Транзакция удаления задачи выполнена");
        // };

        request.onsuccess = function () {
          console.log("Задача удалена в idb: ", request.result);
          curTasksItem.remove();
        }.bind(this);

        request.onerror = function (event) {
          console.log("Ошибка удаления задачи в idb: ", request.error);
        };
      },/* tasksItemDelete() */
      uploadTasksToServer: (tasksCard) => {
        if (tasksCard.idb) {
          tasksCard.transaction = tasksCard.idb.transaction('tasks-card', 'readonly');
          tasksCard.tasksCardTransaction = tasksCard.transaction.objectStore("tasks-card").getAll();

          tasksCard.transaction.oncomplete = function () {

            // console.log( tasksCard.tasksCardTransaction.result );
            tasksCard.tasksCardJSON = JSON.stringify(tasksCard.tasksCardTransaction.result);
            // console.log(tasksCard.tasksCardJSON);

            fetch(tasksCard.state.serverURL, {
              method: 'POST',
              body: { "add_tasks": tasksCard.tasksCardJSON },
            }).then((response) => {
              // console.log( response );
              return response.json();
            }).then(json => console.log(json));

            // axios.post(tasksCard.state.serverURL, {
            //   "add_tasks": tasksCard.tasksCardJSON,
            // })
            // .then(function (response) {
            //   console.log(response);
            // })
            // .catch(function (error) {
            //   console.log(error);
            // });

          }.bind(tasksCard);
        }
    },/* uploadTasksToServer() */
    componentDidMount: () => {
      const openedIndexedDB = indexedDB.open('tasks', 1);

      openedIndexedDB.onupgradeneeded = function () {
        console.log('upgradeneeded');
        // срабатывает, если на клиенте нет базы данных
        // ...выполнить инициализацию...
        this.idb = openedIndexedDB.result;

        if (!this.idb.objectStoreNames.contains('tasks-card')) { // если хранилище "tasks-card" не существует
          this.idb.createObjectStore('tasks-card', {// создаем хранилище
            keyPath: 'key',//вместо этого можно использовать такой подход: const request = tasksCard.add(task, task.id); ниже
            // autoIncrement: true,//вместо этого можно использовать такой подход: const request = tasksCard.add(task, task.id); ниже
          });
        }
      }

      openedIndexedDB.onerror = function () {
        console.error("error", openedIndexedDB.error);
      };

      openedIndexedDB.onsuccess = function () {
        console.log('openedIndexedDB success');
        this.idb = openedIndexedDB.result;
        console.log('version idb: ' + this.idb.version);

        this.idb.onversionchange = function () {
          this.idb.close();
          alert("База данных устарела, пожалуйста, перезагрузите страницу.")
        };

        this.transaction = this.idb.transaction('tasks-card', 'readonly');
        let tasksCardTransaction = this.transaction.objectStore("tasks-card");
        this.allTasksFromDB = tasksCardTransaction.getAll();

        this.transaction.oncomplete = function () {
          console.log("Транзакция idb allTasks result выполнена: ");
          console.log(this.allTasksFromDB.result);

          if (this.allTasksFromDB.result.length === 0) {
            axios.get(this.state.serverURL, {
              params: {
                get_db: '1',//version db
              }
            }).then(function (response) {
              let allTasksFromServer = response.data;
              console.log('JSON allTasksFromServer: ');
              console.log(allTasksFromServer);
              // console.log('JSON.parse allTasksFromServer: ');console.log(JSON.parse(allTasksFromServer));

              this.transaction = this.idb.transaction('tasks-card', 'readwrite');
              this.tasksCardTransaction = this.transaction.objectStore("tasks-card");

              allTasksFromServer.map((task) => {
                console.log('task from server: ');
                console.log(task);
                let request = this.tasksCardTransaction.put(task);
                console.log(request);
              });

            }.bind(this))
              .catch(function (error) {
                console.log(error);
              })
              .then(function () {
                // always executed
              });
          }

          for (let item of this.allTasksFromDB.result) {
            if (item.deleted) {
              this.setState((state, props) => ({
                maxTasksKey: item.key,
              }));
              continue;
            }

            let newTaskJSX = (
              <TasksItem
                content={item.content}
                data-key={item.key}
                id={'i-' + item.key}
                className='tasks-list__tasks-item'
                key={item.key}
                tasksItemSave={this.tasksItemSave}
                tasksItemDelete={this.tasksItemDelete}
                data-created={item.created}
              />
            );

            this.setState((state, props) => ({
              tasksList: state.tasksList.concat(newTaskJSX),
              maxTasksKey: item.key,
            }));
            console.log('this.state.tasksList: ');
            console.log(this.state.tasksList);
          }
        }.bind(this);
      }.bind(this);

      openedIndexedDB.onblocked = function () {
        // есть другое соединение к той же базе
        // и оно не было закрыто после срабатывания на нём idb.onversionchange
      };
    },
  },
}
};

export default store;