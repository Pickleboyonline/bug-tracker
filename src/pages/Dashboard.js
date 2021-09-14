import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    withRouter
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Overview from './sub-pages/Overview';
import SkeletonProject from './sub-pages/SkeletonProject';
import { Avatar, Menu, Button, Space, Drawer, Dropdown, notification } from 'antd';
import {
    UserOutlined,
    BellFilled,
    SettingOutlined, CodeOutlined
} from '@ant-design/icons';
import anime from 'animejs/lib/anime.es.js';
import Home from './../components/Home';
import Settings from './Settings';
import Notifications from './Notifications';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DesktopOutlined,

} from '@ant-design/icons';
import Messages from './Messages';
import AvatarSettings from '../components/AvatarSettings';
import axios from 'axios';
import { getErrorMessage, logErrorMessage } from './../libraries/network-error-handling';
import { addEventListener, removeEventListener } from '../libraries/socket';

const PubSub = require('./../PubSub');

const { SubMenu } = Menu;
const menu = (
    <Menu style={{
        width: 150,
    }}>
        <Menu.Item
            style={{
                color: 'red'
            }}
            key="0">
            Logout
        </Menu.Item>

    </Menu>
);
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            collapsed: false,
            toggleDrawer: false,
            projects: [],
            socket: null,
            name: ''
        };

    }

    fetchNotifications;

    componentDidMount() {
        PubSub.join('project').on('update', this.updateProjects);
        this.updateProjects()
        // this.connectToSocket();
        this.getWelcomeMessage();
        // this.handleErrorTest()

        addEventListener('new-notification', this.onRecieveNotitification)
    }

    handleErrorTest = async () => {
        try {
            await axios.get('http://localhost:1337/throw-error')
        } catch (e) {
            let message = getErrorMessage(e);
            console.log(message)
        }
    }


    TOKEN = window.localStorage.getItem('token');

    updateProjects = async () => {
        const token = window.localStorage.getItem('token');

        try {
            let { data } = await axios.get('http://localhost:1337/project/all', {
                headers: {
                    'x-auth-token': token
                }
            });
            this.setState({
                projects: data.projects
            });
            // console.log(data.projects)
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    getAction = (notification) => {
        switch (notification.type) {
            case 'PROJECT_INVITE':
                this.joinProject(notification.payload.projectId)
                break;
            default:
                alert("no type given")
        }
    }

    toggleCollapsed = () => {
        let collapsed = !this.state.collapsed
        this.setState({
            collapsed
        });

        let logo = document.getElementById('bugg-nav-logo');
        let panel = document.getElementById('bugg-nav-background');
        let button = document.getElementById('bugg-nav-collaspe-button');
        let dashboard = document.getElementById('bugg-dashboard');

        animate({
            logo,
            collapsed,
            panel,
            button,
            dashboard
        })


    };



    onRecieveNotitification = (notif) => {
        notification.open({
            message: notif.title,
            description: notif.description + ' Click this notification to join.',
            onClick: () => this.getAction(notif)
        })
    }

    componentWillUnmount() {
        removeEventListener('new-notification', this.onRecieveNotitification)
    }

    getWelcomeMessage = async () => {
        let formatName = (name) => {
            var nameSegments = name.split(' ');
            let shortHandName = nameSegments[0];

            if (nameSegments[1]) {
                shortHandName += ' ' + nameSegments[1].substring(0, 1).toUpperCase() + '.'
            }

            return shortHandName
        }
        try {
            let { data: { user } } = await axios.get('http://localhost:1337/user/me', {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })

            this.setState({
                name: formatName(user.name)
            });
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }


    joinProject = async (projectId) => {
        const token = window.localStorage.getItem('token');
        try {
            let { data } = await axios.post('http://localhost:1337/project/join', {
                projectId
            }, {
                headers: {
                    'x-auth-token': token
                }
            })
            notification.success({
                message: 'You have joined project ' + data.project.title + '!'
            })
            this.updateProjects();
        } catch (e) {
            logErrorMessage(e);
            notification.error({
                message: getErrorMessage(e)
            })

        }
    }

    render() {
        return (
            <div
                id="bugg-dashboard"
                className="Dashboard" style={styles.Dashboard}>

                <div
                    id="bugg-nav-background"
                    className="navigation" style={styles.navigation}>
                    <Space
                        style={styles.Space1}
                        align='center'
                        direction='horizontal'
                    >
                        <Button
                            id="bugg-nav-collaspe-button"
                            type="text"
                            onClick={this.toggleCollapsed}
                            style={styles.Button1}>
                            {
                                React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)
                            }
                        </Button>
                        <h2
                            id="bugg-nav-logo"
                            style={styles.h2}>
                            Bugg
                        </h2>
                    </Space>


                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme='dark'
                        style={styles.Menu}
                        inlineCollapsed={this.state.collapsed}
                    >
                        <Menu.Item key="1"
                            onClick={() => this.props.history.push('/dashboard')}
                            style={styles.Item1}
                            icon={<DesktopOutlined />}>
                            Home
                        </Menu.Item>


                        <Menu.Item key="2"
                            onClick={() => this.props.history.push('/dashboard/settings')}
                            style={{
                                backgroundColor: 'transparent'
                            }}
                            icon={<SettingOutlined />}>
                            Settings
                        </Menu.Item>

                        <SubMenu
                            key="sub1"
                            style={{
                                backgroundColor: 'transparent'
                            }}
                            icon={<CodeOutlined />}
                            title="Projects"
                            className="bugg-sub-menu"

                        >
                            {
                                this.state.projects.map((doc, ind) =>
                                    <Menu.Item
                                        style={{
                                            backgroundColor: 'transparent'
                                        }}
                                        onClick={() => this.props.history.push('/dashboard/projects/' + doc.id)}
                                        //className="bugg-sub-menu"
                                        key={'' + (5 + ind)}>{doc.title}</Menu.Item>
                                )
                            }
                        </SubMenu>

                    </Menu>



                </div>
                <div className="main-wrapper" style={{ flex: 1 }}>

                    <div
                        className="header"
                        style={styles.header}>
                        <h2>
                            {'Welcome' + (this.state.name ? ', ' : '') + this.state.name}
                        </h2>
                        <Space size='large'>
                            <Button
                                type='text'
                                shape='circle'
                                size='large'
                                style={{
                                    transform: 'scale(1.2)',
                                    color: 'rgba(0,0,0,.7)'
                                }}

                                onClick={() => this.setState({ toggleDrawer: true })}
                                icon={<BellFilled
                                    style={{
                                        //fontSize: 64
                                    }} />}
                            />
                            <style>
                                {`
                                .bugg-profile-pic:hover {
                                    cursor: pointer;
                                }
                                `}
                            </style>
                            <Dropdown
                                //overlay={<AvatarSettings />}
                                overlay={menu}
                                trigger={['click']}
                            >

                                <Avatar
                                    className="bugg-profile-pic"
                                    size={64} icon={<UserOutlined />} style={{
                                        marginRight: 30
                                    }} />


                            </Dropdown>

                        </Space>

                    </div>
                    <Route exact path="/dashboard">

                        <Home />
                        {/* <Overview /> */}
                    </Route>
                    <Route path='/dashboard/settings'>
                        <Settings />
                    </Route>
                    <Route path="/dashboard/projects/:name">
                        <SkeletonProject updateProjects={this.updateProjects} />
                    </Route>
                </div>
                <Drawer
                    width={500}
                    title="Notifications"
                    placement="right"
                    closable={true}
                    onClose={() => this.setState({ toggleDrawer: false })}
                    visible={this.state.toggleDrawer}
                >
                    <Notifications
                        joinProject={this.joinProject}
                        socket={this.state.socket}
                    />
                </Drawer>

                <Messages />
            </div >
        );
    }
}

const animate = (obj = {
    collapsed: '',
    logo: '',
    panel: '',
    button: '',
    dashboard: ''
}) => {
    if (obj.collapsed) {
        // TODO collaspe animation
        anime({
            targets: [obj.logo],
            color: 'rgba(0, 0, 0, .5)',
            translateX: 30,
            duration: 300,
            easing: 'easeInOutQuad',
        })
        anime({
            targets: [obj.panel],
            width: 75,
            easing: 'easeInOutQuad',
            duration: 300
        })

        anime({
            targets: [obj.button],
            translateX: 8,
            duration: 100,
            easing: 'easeInOutQuad',
            scale: 1.2
        })
        anime({
            targets: [obj.dashboard],
            paddingLeft: 200,
            duration: 300,
            easing: 'easeInOutQuad',

        })
    } else {
        // Expand
        anime({
            targets: [obj.logo],
            color: 'rgba(255, 255, 255, 1)',
            translateX: 0,
            duration: 300,
            easing: 'easeInOutQuad',
        })
        anime({
            targets: [obj.panel],
            width: 270,
            easing: 'easeInOutQuad',
            duration: 300
        })
        anime({
            delay: 0,
            targets: [obj.button],
            translateX: 0,
            duration: 100,
            easing: 'easeInOutQuad',
            scale: 1
        })
        anime({
            targets: [obj.dashboard],
            paddingLeft: 330,
            duration: 300,
            easing: 'easeInOutQuad',

        })
    }
}

const styles = {
    Dashboard: {
        display: 'inline-flex',
        width: '100%',
        paddingLeft: 330,
        paddingBottom: 64
    },
    navigation: {
        color: 'white',
        width: 270,
        zIndex: 10,
        'box-shadow': '-7px 0px 13px 0px black',
        height: 800,
        boxShadow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        backgroundColor: '#0093E9',
        backgroundImage: 'linear-gradient(43deg, #0093E9 0%, #80D0C7 100%)',
        display: 'flex',
        flexDirection: 'column'
    },
    Space1: {
        marginTop: 30,
        paddingLeft: 9,
        marginBottom: 30
    },
    Button1: {

        //marginLeft: 9, 
        color: 'white'
    },
    h2: {
        // marginBottom: 30,
        // marginLeft: 0,
        // marginTop: 30,
        margin: 0,
        color: 'white',
        position: 'fixed',
        top: 29,
        left: 70
    },
    Menu: {
        backgroundColor: 'transparent'
    },
    Item1:
    {
        backgroundColor: 'transparent'
    },
    header: {
        width: '100%',
        display: 'inline-flex',
        justifyContent: 'space-between',
        height: 110,
        alignItems: 'center'
    }
}

export default withRouter(App);
