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
                <div style={{ display: 'inline-flex', width: '100%' }}>
                    <div style={{
                        border: '1px solid black',
                        paddingLeft: 10,
                        paddingRight: 10,
                        textAlign: 'center',
                        paddingTop: 5,
                        borderRadius: 5,
                        height: 30,
                        marginBottom: 20,
                        marginRight: 20
                    }}>
                        Mark All as Read
                    </div>
                    <div style={{
                        border: '1px solid black',
                        paddingLeft: 10,
                        paddingRight: 10,
                        textAlign: 'center',
                        paddingTop: 5,
                        borderRadius: 5,
                        height: 30,
                        marginBottom: 20,
                        marginRight: 20
                    }}>
                        Sort
                    </div>
                </div>

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
                            height: 120,
                            width: '100%',
                            // backgroundColor: 'red',
                            borderStyle: 'solid',
                            borderColor: 'rgba(0,0,0,.1)',
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                height: 50,
                                width: 50,
                                marginLeft: 20,
                                marginRight: 10,
                                borderRadius: 25,
                                backgroundColor: 'grey'
                            }} />


                            <div style={{ flex: 1, marginRight: 20 }}>
                                <div style={{
                                    display: 'inline-flex',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}>
                                    <p>
                                        Imran Shitta-Bey
                                    </p>
                                    <p>
                                        12:30pm
                                    </p>
                                </div>

                                <p>
                                    Do your job :)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                height: 75,
                                width: 75,
                                // marginLeft: 20,
                                marginRight: 10,
                                borderRadius: 75 / 2,
                                backgroundColor: 'grey'
                            }} />
                            <p>
                                Imran Shitta-Bey
                            </p>
                        </div>
                        <h1>
                            Bruh moment
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
