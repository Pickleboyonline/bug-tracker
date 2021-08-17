import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Link
} from "react-router-dom";


export default class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            mode: 'login',
            isAuthed: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // Updates value of text field in state
    // e is event and target is name of mutible property
    handleChange(e, target) {
        this.setState({ [target]: e.target.value });
    }

    // TODO
    // Add server side functionality
    handleSubmit(e) {
        let success = false;

        alert('server stuff stilol needs implimentation :3');
        success = true;
        // send data to server
        // check if server verify and recieve token

        if (success) {
            // store token :)

            window.localStorage.setItem('token', 'bruh');

            this.setState({
                isAuthed: true
            })
        }
        e.preventDefault();
    }

    toggleMode = () => { let prevMode = this.state.mode; this.setState({ mode: (prevMode === 'login') ? 'signup' : 'login' }); }

    render() {
        return (
            <div className="App">
                {this.state.isAuthed ? <Redirect to="/dashboard" /> : null}
                <div>
                    <h1>
                        Bug Tracker
                    </h1>
                </div>

                <form>
                    <h2>
                        {this.state.mode === 'login' ? 'Login' : 'Signup'}
                    </h2>
                    <h4>
                        {this.state.mode === 'login' ?
                            <React.Fragment>
                                Don't have an account? <a href='#' onClick={this.toggleMode}>Sign up</a>
                            </React.Fragment> :
                            <React.Fragment>
                                Already have an account? <a href='#' onClick={this.toggleMode}>Login</a>
                            </React.Fragment>
                        }

                    </h4>
                    {
                        this.state.mode === 'signup' ?
                            <React.Fragment>
                                <label>
                                    Name:
                                    <input type="text" value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} />
                                </label>
                                <br />
                            </React.Fragment>
                            :
                            null
                    }

                    <label>
                        Email:
                        <input type="text" value={this.state.email} onChange={(e) => this.handleChange(e, 'email')} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="text" value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} />
                    </label>
                    <br />


                    {
                        this.state.mode === 'signup' ?
                            <label>
                                Confirm Passord:
                                <input type="text" value={this.state.confirmPassword} onChange={(e) => this.handleChange(e, 'confirmPassword')} />
                            </label>
                            :
                            null
                    }

                    <div>
                        <a href="#" onClick={this.handleSubmit}>
                            <h3>
                                SUBMIT
                            </h3>
                        </a>

                    </div>
                </form>

            </div>
        );
    }
}