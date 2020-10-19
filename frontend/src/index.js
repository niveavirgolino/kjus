import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, Link} from 'react-router-dom';

// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

// Containers
import main from './main/'
import processo from './processo/'
import unidade from './unidade/'

ReactDOM.render((
  <HashRouter>
    <Switch>
      <Route path="/processo/:id" name="processo" component={processo}/>
      <Route path="/unidade/:id" name="unidade" component={unidade}/>
      <Route path="/" name="main" component={main}/>
    </Switch>
  </HashRouter>
), document.getElementById('root'));
