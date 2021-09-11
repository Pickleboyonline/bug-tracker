import React from 'react';
import {
    withRouter
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
import axios from 'axios';


const { SubMenu } = Menu;
const PubSub = require('./../../PubSub');



class App extends React.Component {
    constructor(props) {
        super(props);
        let id = this.props.location.pathname.split('/');
        id = id[id.length - 1];
        this.state = {
            activeTab: 'settings',
            title: '',
            imageUrl: '',
            project: { id }
        };

    }

    componentDidMount() {
        // PubSub.join('selected-project').on('update', this._handleProjectUpdate);
        // console.log(this.props.location)
        let id = this.props.location.pathname.split('/');
        id = id[id.length - 1];
        // console.log(id)
        this._handleProjectUpdate(id);
    }

    componentWillUnmount() {


    }

    componentDidUpdate(prevProps) {
        const locationChanged =
            this.props.location !== prevProps.location;


        if (locationChanged) {
            let id = this.props.location.pathname.split('/');
            id = id[id.length - 1];
            this._handleProjectUpdate(id);
            console.log('yuh')
        }
    }

    _handleProjectUpdate = async (id) => {
        const token = window.localStorage.getItem('token');
        id = id || this.state.project.id;
        try {
            let { data } = await axios.get('http://localhost:1337/project/find', {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    projectId: id
                }
            });

            if (data.project) {
                this.setState({
                    title: data.project.title,
                    project: data.project,
                    imageUrl: 'http://localhost:1337/icon/' + (data.project.icon && data.project.icon[0] ? data.project.icon[0].id : '')
                });
            }


        } catch (e) {
            console.log(e)
        }
    }

    updateProject = (newProject) => {
        this.setState({
            project: {
                ...this.state.project,
                ...newProject
            }
        })
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
                            borderWidth: 1,
                            marginRight: 10
                        }}
                        //src="https://getmixtape.app/static/media/JUSTFORAPPLE.fa2ec9e8.png"
                        src={this.state.imageUrl}
                    />
                    <h1 style={{
                        fontSize: 50,
                        margin: 0
                    }}>
                        {this.state.title}
                    </h1>
                </Space>

                <div style={{ display: 'flex' }}>

                    <Menu
                        style={{
                            marginBottom: 20,
                            marginTop: 20,
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
                                return <Overview project={this.state.project} />
                            case "bugs":
                                return <Bugs project={this.state.project} />
                            case "announcements":
                                return <Announcements project={this.state.project} />
                            case "calendar":
                                return <Calendar project={this.state.project} />
                            case "settings":
                                return <Settings project={this.state.project} updateProject={() => {
                                    this._handleProjectUpdate()
                                    this.props.updateProjects()

                                }} />
                            case "collaborators":
                                return <Collaborators project={this.state.project} />
                            default:
                                return 'hi'
                        }

                    })()
                }



            </React.Fragment>

        );
    }
}


export default withRouter(App);
