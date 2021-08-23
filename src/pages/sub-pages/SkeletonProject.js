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
import { Menu, Space } from 'antd';
import {
    MailOutlined,
    BugOutlined,
    SettingOutlined,
    DashboardOutlined,
    CalendarOutlined,
    NotificationOutlined,
    TeamOutlined

} from '@ant-design/icons';

const { SubMenu } = Menu;

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
    handleClick = e => {

        this.setState({ activeTab: e.key });
    };

    render() {
        const current = this.state.activeTab;
        return (
            <React.Fragment>
                <Space align='center'>
                    <img
                        style={{
                            height: 72,
                            width: 72,
                            borderRadius: 5,
                            borderColor: 'rgba(0,0,0,.2)',
                            borderStyle: 'solid',
                            borderWidth: 1
                        }}
                        src="https://getmixtape.app/static/media/JUSTFORAPPLE.fa2ec9e8.png" />
                    <h1 style={{
                        fontSize: 50,
                        margin: 0
                    }}>
                        Mixtape
                    </h1>
                </Space>

                <div style={{ display: 'flex' }}>

                    <Menu
                        style={{
                            marginBottom: 20,
                            position: 'relative',
                            //left: -18,
                            width: 900
                        }}
                        onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                        <Menu.Item key="overview" icon={<DashboardOutlined />}>
                            Overview
                        </Menu.Item>
                        <Menu.Item key="bugs" icon={<BugOutlined />}>
                            Bugs
                        </Menu.Item>
                        <Menu.Item key="announcements" icon={<NotificationOutlined />}>
                            Announcements
                        </Menu.Item>
                        <Menu.Item key="calendar" icon={<CalendarOutlined />}>
                            Calendar
                        </Menu.Item>
                        <Menu.Item key="settings" icon={<SettingOutlined />}>
                            Settings
                        </Menu.Item>
                        <Menu.Item key="collaborators" icon={<TeamOutlined />}>
                            Collaborators
                        </Menu.Item>
                    </Menu>


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
