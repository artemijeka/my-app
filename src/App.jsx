import React from 'react';

import Pomodoro from './components/pomodoro/Pomodoro';
import Tasks from './components/tasks/Tasks';

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

function App(props) {
  return (
    <BrowserRouter>
      <React.StrictMode>
        <nav className="navigation">
          <NavLink to='/' className={`navigation__link`}>Main</NavLink>&nbsp;-&nbsp;
          <NavLink to='/tasks' className={`navigation__link`}>Tasks</NavLink>&nbsp;-&nbsp;
          <NavLink to='/pomodoro' className={`navigation__link`}>Pomodoro</NavLink>
        </nav>
        <Routes>
          <Route path='/tasks' element={<Tasks state={props.store.state.tasksCard} />} />
          <Route path='/pomodoro' element={<Pomodoro store={props.store} />} />
          <Route path='/' element={<><Tasks state={props.store.state.tasksCard} /><Pomodoro store={props.store} /></>} />
        </Routes>
      </React.StrictMode>
    </BrowserRouter>
  );
}

export default App;