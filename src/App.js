import logo from './logo.svg';
import './App.css';
import React from 'react';
import Authentication from './pages/Authentication';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Dashboard from './pages/Dashboard';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthed: false
    };

  }

  componentDidMount() {
    if (window.localStorage.getItem('token')) {

      this.setState({
        isAuthed: true
      })
    }
  }

  render() {
    let isAuthed = (window.localStorage.getItem('token') !== null);

    return (
      <Router>
        {

          !isAuthed ? <Redirect to="auth" /> : null
        }
        {
          (() => {
            if (window.location.pathname.indexOf('dashboard') !== -1 && isAuthed) {
              return false;
            } else {
              return true
            }
          })() ? <Redirect to="dashboard" /> : null
        }
        <Switch>
          <Route path='/auth'>
            <Authentication />
          </Route>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
        </Switch>
      </Router>

    );
  }
}


export default App;
