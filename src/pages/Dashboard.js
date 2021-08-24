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
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

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
                width: '100%',
                paddingLeft: 330,
                paddingBottom: 64
            }}>
                <div className="navigation" style={{
                    color: 'white',
                    width: 300,
                    zIndex: 10,
                    'box-shadow': '-7px 0px 13px 0px black',
                    height: 800,
                    boxShadow: 1,
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    height: '100%',
                    backgroundColor: '#0093E9',
                    backgroundImage: 'linear-gradient(43deg, #0093E9 0%, #80D0C7 100%)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2 style={{
                        marginBottom: 30,
                        marginLeft: 30,
                        marginTop: 30,
                        color: 'white'
                    }}>
                        Bugg
                    </h2>
                    <Link

                        to={`/dashboard`} replace>

                        <h4 style={{
                            marginLeft: 30,
                            color: 'white'

                        }}>
                            Overview
                        </h4>
                    </Link>
                    <Link

                        to={`/dashboard/messages`} replace>

                        <h4 style={{
                            marginLeft: 30,
                            color: 'white'

                        }}>
                            Messages
                        </h4>
                    </Link>
                    <div style={{ width: '100%', }}>
                        <div style={{
                            display: 'inline-flex',
                            width: '100%',
                            justifyContent: 'space-between',

                        }}>
                            <h4 style={{
                                marginLeft: 30,
                                color: 'white'

                            }}>
                                Projects
                            </h4>
                            <h4 style={{ marginRight: 30, color: 'white' }}>
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
                                <h5 style={{ marginLeft: 60, color: 'white' }}>
                                    Mixtape
                                </h5>
                            </Link>

                        </div>
                    </div>


                </div>
                <div className="main-wrapper" style={{ flex: 1 }}>

                    <div
                        className="header"
                        style={{
                            width: '100%',
                            display: 'inline-flex',
                            justifyContent: 'space-between',
                            height: 110,
                            alignItems: 'center'
                        }}>
                        <h2>
                            Welcome, Imran S.
                        </h2>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',

                        }}>
                            <h3 style={{ marginRight: 20 }}>
                                Settings
                            </h3>
                            <h3 style={{ marginRight: 20 }}>
                                Notifications
                            </h3>
                            <Avatar size={64} icon={<UserOutlined />} style={{
                                marginRight: 30
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
