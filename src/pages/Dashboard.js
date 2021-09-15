import React from 'react';
import {

    Route,
    withRouter
} from "react-router-dom";
import SkeletonProject from './sub-pages/SkeletonProject';
import {
    Avatar,
    Badge,
    Menu, Button, Space, Drawer, Dropdown, notification
} from 'antd';
import {

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
import axios from 'axios';
import { getErrorMessage, logErrorMessage } from './../libraries/network-error-handling';
import { addEventListener, reconfigToken, removeEventListener } from '../libraries/socket';
import { baseUrl, getDefaultHeader } from './config';
import bugg from '../libraries/bugg';

const PubSub = require('./../PubSub');

const { SubMenu } = Menu;
const menu = (props) => (
    <Menu style={{
        width: 150,
    }}>
        <Menu.Item
            onClick={props.logout}
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
            name: '',
            userIconUri: '',
            unreadNotifications: 0,
            activeConversationIds: []
        };

    }

    setActiveConversationIds = (value) => this.setState({ activeConversationIds: value })

    fetchUnreadNotifications = async () => {

        try {
            let unreadNotifications = await bugg.Notification.getUnreadNotifications();

            this.setState({
                unreadNotifications
            })
        } catch (e) {
            alert(getErrorMessage(e))
            logErrorMessage(e)
        }
    }

    componentDidMount() {
        PubSub.join('project').on('update', this.updateProjects);
        this.updateProjects()
        // this.connectToSocket();
        this.getWelcomeMessage();
        // this.handleErrorTest()
        reconfigToken()
        this.fetchUnreadNotifications()
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




    openNewMessage = () => undefined;

    setOpenNewMessage = (func) => {
        this.openNewMessage = (conversationId) => {
            func(conversationId)
            this.setState({
                toggleDrawer: false
            })
        };
    }

    logout = () => {
        window.localStorage.removeItem('token');
        this.props.history.push('/auth')
    }

    updateProjects = async () => {
        try {
            let { data } = await axios.get('http://localhost:1337/project/all', {
                headers: getDefaultHeader()
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
            case 'NEW_MESSAGE':
                this.openNewMessage(notification.payload.conversationId);
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


    getNotificationCallToAction = (type) => {
        let messages = {
            'PROJECT_INVITE': ' Click this notification to join.',
            'NEW_MESSAGE': ' Click this notification to view.',
        }
        return messages[type] ?? ''
    }

    onRecieveNotitification = (notif) => {
        // alert('SHIT')
        this.fetchUnreadNotifications()
        if (notif.type === 'NEW_MESSAGE' && this.state.activeConversationIds.includes(notif.payload.conversationId)) return

        notification.open({
            message: notif.title,
            description: notif.description + this.getNotificationCallToAction(notif.type),
            onClick: () => {
                this.getAction(notif)
                this.dismissNotification(notif.id)
            }
        })

    }

    /**
     * Dismisses notification on server
     * @param {string} notificationId Id of notification
     */
    dismissNotification = async (notificationId) => {
        try {
            await axios.delete(baseUrl + '/notification/' + notificationId, {
                headers: getDefaultHeader()
            })
            this.fetchUnreadNotifications()

        } catch (e) {
            logErrorMessage(e)

        }

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
            let user = await bugg.User.getMe();
            let userIconUri = await bugg.User.getUserIconUri();
            this.setState({
                name: formatName(user.name),
                userIconUri
            });
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }


    joinProject = async (projectId) => {

        try {
            let { data } = await axios.post('http://localhost:1337/project/join', {
                projectId
            }, {
                headers: getDefaultHeader()
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
                            <Badge
                                offset={[-4, 8]}
                                count={this.state.unreadNotifications}>
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
                            </Badge>

                            <style>
                                {`
                                .bugg-profile-pic:hover {
                                    cursor: pointer;
                                }
                                `}
                            </style>
                            <Dropdown
                                //overlay={<AvatarSettings />}
                                overlay={menu({ logout: this.logout })}
                                trigger={['click']}
                            >

                                <Avatar
                                    className="bugg-profile-pic"
                                    size={64}
                                    src={this.state.userIconUri}
                                    //icon={<UserOutlined />} 

                                    style={{
                                        marginRight: 64,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0,0,0,.2)',
                                        borderStyle: 'solid'
                                    }} />


                            </Dropdown>

                        </Space>

                    </div>
                    <Route exact path="/dashboard">

                        <Home />
                        {/* <Overview /> */}
                    </Route>
                    <Route path='/dashboard/settings'>
                        <Settings getWelcomeMessage={this.getWelcomeMessage} />
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
                    onClose={() => {
                        this.fetchUnreadNotifications()
                        this.setState({ toggleDrawer: false })
                    }}
                    destroyOnClose
                    visible={this.state.toggleDrawer}
                >
                    <Notifications
                        openNewMessage={this.openNewMessage}
                        joinProject={this.joinProject}
                        socket={this.state.socket}
                    />
                </Drawer>

                <Messages
                    setActiveConversationIds={this.setActiveConversationIds}
                    setOpenNewMessage={this.setOpenNewMessage}
                    fetchUnreadNotifications={this.fetchUnreadNotifications} />
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
