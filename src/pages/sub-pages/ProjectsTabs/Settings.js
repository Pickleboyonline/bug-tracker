import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import { List, Typography, Divider, Avatar } from 'antd';

import General from './SettingsComponents/General';
import Roles from './SettingsComponents/Roles';
import Notifications from './SettingsComponents/Notifications';
import Members from './SettingsComponents/Members'


const data = [
    'General',
    'Roles',
    'Notifications',
    'Members',
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            selectedSetting: 'general',

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
                    <style>{`
.bugg-list-item-button:hover {
    background-color: rgb(0 0 0 / 5%);
    cursor: pointer;
}
.bugg-list-item-button {
    background-color: white;
}
`}</style>
                    <List
                        // header={<div>Header</div>}
                        // footer={<div>Footer</div>}
                        bordered
                        dataSource={data}
                        style={{
                            width: 300,
                            height: 229
                        }}
                        renderItem={item => (
                            <List.Item
                                className="bugg-list-item-button"
                                onClick={() => {
                                    let str = item.toLowerCase().split(' ').join('-');
                                    console.log(str)
                                    this.setState({
                                        selectedSetting: item.toLowerCase().split(' ').join('-')
                                    })
                                }}
                            >
                                <Avatar style={{
                                    marginRight: 10
                                }}>{item.substring(0, 1).toLocaleUpperCase()}</Avatar> {item}
                            </List.Item>
                        )}
                    />
                    {
                        // Create components
                    }
                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>
                        {
                            (() => {
                                switch (this.state.selectedSetting) {
                                    case data[0].toLowerCase().split(' ').join('-'):
                                        return <General project={this.props.project} />
                                    case data[1].toLowerCase().split(' ').join('-'):
                                        return <Roles />
                                    case data[2].toLowerCase().split(' ').join('-'):
                                        return <Notifications />
                                    case data[3].toLowerCase().split(' ').join('-'):
                                        return <Members />
                                    default:
                                        return 'no tab selected'
                                }

                            })()
                        }
                        {/* <h1>
                            Go Ahead, Change Some Stuff
                        </h1>
                        <p style={{ maxWidth: 700 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p> */}


                    </div>
                </div>
            </div>
        );
    }
}


export default App;
