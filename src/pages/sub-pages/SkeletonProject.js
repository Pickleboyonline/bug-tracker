import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Overview from './ProjectsTabs/Overview';
import Bugs from './ProjectsTabs/Bugs';
import Announcements from './ProjectsTabs/Announcements';
import Calendar from './ProjectsTabs/Calendar';
import Settings from './ProjectsTabs/Settings';
import Collaborators from './ProjectsTabs/Collaborators'

function Tabs(props) {
    return (
        <h4 style={{
            marginRight: 20,
            color: props.activeTabValue === props.name ? props.activeColor : 'black'
        }}
            onClick={() => props.ctx.setState({ activeTab: props.name })}
        >
            {props.title}
        </h4>
    )
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'overview'
        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <React.Fragment>
                <h1>
                    Mixtape
                </h1>
                <div style={{ display: 'flex' }}>
                    <Tabs
                        name='overview'
                        title='Overview'
                        activeColor='cyan'
                        ctx={this}
                        activeTabValue={this.state.activeTab}

                    />
                    <Tabs
                        name='bugs'
                        title='Bugs'
                        activeColor='cyan'
                        ctx={this}
                        activeTabValue={this.state.activeTab}

                    />

                    <Tabs
                        name='announcements'
                        title='Announcements'
                        activeColor='cyan'
                        ctx={this}
                        activeTabValue={this.state.activeTab}

                    />

                    <Tabs
                        name='calendar'
                        title='Calendar'
                        activeColor='cyan'
                        ctx={this}
                        activeTabValue={this.state.activeTab}

                    />


                    <Tabs
                        name='settings'
                        title='Settings'
                        activeColor='cyan'
                        ctx={this}
                        activeTabValue={this.state.activeTab}

                    />

                    <Tabs
                        name='collaborators'
                        title='Collaborators'
                        activeColor='cyan'
                        ctx={this}
                        activeTabValue={this.state.activeTab}

                    />

                </div>
                {
                    (() => {
                        switch (this.state.activeTab) {
                            case "overview":
                                return <Overview />
                            case "bugs":
                                return <Bugs />
                            case "announcements":
                                return <Announcements />
                            case "calendar":
                                return <Calendar />
                            case "settings":
                                return <Settings />
                            case "collaborators":
                                return <Collaborators />
                            default:
                                return 'hi'
                        }

                    })()
                }



            </React.Fragment>

        );
    }
}


export default App;
