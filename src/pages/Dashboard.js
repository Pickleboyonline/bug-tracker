import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useRouteMatch
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Overview from './sub-pages/Overview';
import SkeletonProject from './sub-pages/SkeletonProject';


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
        // let match = useRouteMatch();
        return (
            <div className="Dashboard" style={{
                display: 'inline-flex',
                width: '100%'
            }}>
                <div className="navigation" style={{
                    backgroundColor: 'black',
                    color: 'white',
                    width: 260,
                    height: 800,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 10, margin: 20,
                    boxShadow: 1
                }}>
                    <h2 style={{ marginBottom: 30 }}>
                        Bug Tracker
                    </h2>
                    <Link to={`/dashboard`} replace>

                        <h4 >
                            Overview
                        </h4>
                    </Link>
                    <Link to={`/dashboard/messages`} replace>

                        <h4 >
                            Messages
                        </h4>
                    </Link>
                    <div style={{ width: '100%', }}>
                        <div style={{
                            display: 'inline-flex',
                            width: '100%',
                            justifyContent: 'space-between',

                        }}>
                            <h4 >
                                Projects
                            </h4>
                            <h4 style={{ marginRight: 10 }}>
                                ↓
                            </h4>
                        </div>
                    </div>
                    <div style={{ width: '100%', }}>
                        <div style={{
                            display: 'inline-flex',
                            width: '100%',
                            justifyContent: 'space-between',

                        }}>
                            <Link to={`${window.location.pathname}/projects/mixtape`}>
                                <h5 style={{ marginLeft: 10 }}>
                                    Mixtape
                                </h5>
                            </Link>

                        </div>
                    </div>


                </div>
                <div className="main-wrapper" style={{ flex: 1 }}>

                    <div className="header" style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}>
                        <h2>
                            Welcome, Imran
                        </h2>
                        <div style={{ display: 'inline-flex', marginTop: 20 }}>
                            <h3 style={{ marginRight: 20 }}>
                                Settings
                            </h3>
                            <h3 style={{ marginRight: 20 }}>
                                Notifications
                            </h3>
                            <div style={{
                                height: 75,
                                float: 'right',
                                width: 75,
                                borderRadius: 75 / 2,
                                backgroundColor: 'grey',
                                marginRight: 20
                            }} />
                        </div>

                    </div>
                    <Route exact path="/dashboard">
                        <Overview />
                    </Route>
                    <Route path="/dashboard/projects/:name">
                        <SkeletonProject />
                    </Route>
                </div>
            </div >
        );
    }
}


export default App;
