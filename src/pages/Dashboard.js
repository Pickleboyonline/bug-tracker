import React from 'react';
import {
    Route,
    withRouter
} from "react-router-dom";
import SkeletonProject from './sub-pages/SkeletonProject';
import {
    Menu,
    Drawer,
    notification
} from 'antd';
import Home from './../components/Home';
import Settings from './Settings';
import Notifications from './Notifications';
import Messages from './Messages';
import axios from 'axios';
import { getErrorMessage, logErrorMessage } from './../libraries/network-error-handling';
import { addEventListener, reconfigToken, removeEventListener } from '../libraries/socket';
import { baseUrl, getDefaultHeader } from './config';
import MediaQuery from 'react-responsive';
import DesktopNavBar from '../components/DesktopNavBar';
import NavWelcomeHeader from '../components/NavWelcomeHeader';
import MobileNavBar from '../components/MobileNavBar';

const bugg = require('../libraries/bugg')
const PubSub = require('./../PubSub');

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
            activeConversationIds: [],
            initialStyles: {

            }
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
            await axios.get('/throw-error')
        } catch (e) {
            let message = getErrorMessage(e);
            console.log(message)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.updateProjects()
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
            let { data } = await axios.get('/project/all', {
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
            case 'NEW_BUG':
                this.props.history
                    .push('/dashboard/projects/' + notification.payload.projectId + `?action=OPEN_BUG&bugId=${notification.payload.bugId}`);
                this.setState({
                    toggleDrawer: false
                })
                break;
            case 'NEW_ANNOUNCEMENT':
                this.props.history
                    .push('/dashboard/projects/' + notification.payload.projectId + `?action=OPEN_ANNOUNCEMENT&announcementId=${notification.payload.announcementId}`);
                this.setState({
                    toggleDrawer: false
                })
                break;
            default:
                alert("no type given")
        }
    }


    getNotificationCallToAction = (type) => {
        let messages = {
            'PROJECT_INVITE': ' Click this notification to join.',
            'NEW_MESSAGE': ' Click this notification to view.',
        }

        return messages[type] ?? ' Click this notification to view.'
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
            let { data } = await axios.post('/project/join', {
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
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <div
                        id="bugg-dashboard"
                        className="Dashboard" style={{
                            // display: isMobile ? 'inline-flex',
                            width: '100%',
                            paddingLeft: 10,//330,
                            paddingBottom: 64
                        }}>
                        <MediaQuery
                            minWidth={800} >
                            <DesktopNavBar projects={this.state.projects} />
                        </MediaQuery>
                        {
                            isMobile &&
                            <MobileNavBar projects={this.state.projects} />
                        }
                        <div className="main-wrapper" style={{
                            flex: 1
                        }}>

                            <NavWelcomeHeader
                                name={this.state.name}
                                unreadNotifications={this.state.unreadNotifications}
                                logout={this.logout}
                                userIconUri={this.state.userIconUri}
                                toggleNotificationDrawer={() => this.setState({ toggleDrawer: true })}
                            />
                            <Route exact path="/dashboard">

                                <Home
                                    projects={this.state.projects}
                                    updateProjects={this.updateProjects}
                                />
                                {/* <Overview /> */}
                            </Route>
                            <Route path='/dashboard/settings'>
                                <Settings getWelcomeMessage={this.getWelcomeMessage} />
                            </Route>
                            <Route path="/dashboard/projects/:projectId">
                                <SkeletonProject updateProjects={this.updateProjects} />
                            </Route>
                        </div>
                        {
                            // move to react hook for media query
                        }
                        <Drawer
                            // {...notificationDrawerProps}
                            // width={500}

                            width={isMobile ? '80%' : 500}
                            title="Notifications"
                            placement="right"
                            closable={true}
                            onClose={() => {
                                this.fetchUnreadNotifications()
                                this.setState({ toggleDrawer: false })
                            }}
                            destroyOnClose={true}
                            visible={this.state.toggleDrawer}
                        >
                            <Notifications
                                close={() => {
                                    this.fetchUnreadNotifications()
                                    this.setState({ toggleDrawer: false })
                                }}
                                openNewMessage={this.openNewMessage}
                                joinProject={this.joinProject}
                                socket={this.state.socket}
                            />
                        </Drawer>

                        <Messages
                            isMobile={isMobile}
                            setActiveConversationIds={this.setActiveConversationIds}
                            setOpenNewMessage={this.setOpenNewMessage}
                            fetchUnreadNotifications={this.fetchUnreadNotifications} />
                    </div >
                }
            </MediaQuery>
        );
    }
}



export default withRouter(App);
