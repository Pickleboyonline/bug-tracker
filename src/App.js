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
    return (
      <Router>
        {
          !this.state.isAuthed ? <Redirect to="auth" /> : null
        }
        <Switch>
          <Route path='/auth'>
            <Authentication />
          </Route>
        </Switch>
      </Router>

    );
  }
}


export default App;
