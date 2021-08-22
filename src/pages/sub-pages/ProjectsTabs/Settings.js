import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false
        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>


                <div style={{
                    display: 'inline-flex'

                }}>
                    <div style={{
                        borderColor: 'rgba(0,0,0,.1)',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: 300,
                        height: 600
                    }}>
                        <div style={{
                            height: 60,
                            width: '100%',
                            // backgroundColor: 'red',
                            borderStyle: 'solid',
                            borderColor: 'rgba(0,0,0,.1)',
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            <p style={{
                                marginLeft: 20
                            }}>
                                A Setting
                            </p>
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>

                        <h1>
                            Change Some Stuff, Go Ahead
                        </h1>
                        <p style={{ maxWidth: 700 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>


                    </div>
                </div>
            </div>
        );
    }
}


export default App;
