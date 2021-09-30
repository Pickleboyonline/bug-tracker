import React from 'react';
import {
    Route,
    withRouter
} from "react-router-dom";
import SkeletonProject from './sub-pages/SkeletonProject';
import {
    Menu,
    Drawer,
    notification,
    message
} from 'antd';
import Home from '../components/Home';
import Settings from './Settings';
import Notifications from './Notifications';
import Messages from './Messages';
import axios from 'axios';
import MediaQuery from 'react-responsive';
import DesktopNavBar from '../components/DesktopNavBar';
import NavWelcomeHeader from '../components/NavWelcomeHeader';
import MobileNavBar from '../components/MobileNavBar';
import { getErrorMessage, logErrorMessage } from '../libraries/network-error-handling';
import { baseUrl, getDefaultHeader } from './config';
import bugg from '../libraries/bugg';
import { addEventListener, removeEventListener, reconfigToken, unsubscribeFromMessages } from '../libraries/socket';
import { StaticContext } from 'react-router';

interface DashboardProps {
    location: any,
    history: any
}

export interface BuggNotification {
    payload: any,
    type: string,
    id: string,
    title: string,
    read: boolean,
    description: string,
    createdAt: number
}

interface DashboardState extends StaticContext {
    isAuthed: boolean,
    collapsed: boolean,
    toggleDrawer: boolean,
    projects: any,
    socket: any,
    name: string,
    userIconUri: string,
    unreadNotifications: number,
    activeConversationIds: any,
    initialStyles: any
}

class App extends React.Component<any, DashboardState, unknown> {
    constructor(props: DashboardProps) {
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

    setActiveConversationIds = (value: string[]) => this.setState({ activeConversationIds: value })

    fetchUnreadNotifications = async () => {

        try {
            let unreadNotifications = await bugg.Notification.getUnreadNotifications();

            this.setState({
                unreadNotifications
            })
        } catch (e: any) {
            // alert(getErrorMessage(e))
            logErrorMessage(e)
        }
    }

    componentDidMount() {
        this.updateProjects()
        this.getWelcomeMessage();
        reconfigToken()
        this.fetchUnreadNotifications()
        addEventListener('new-notification', this.onRecieveNotitification)
    }

    handleErrorTest = async () => {
        try {
            await axios.get('/throw-error')
        } catch (e) {
            let message = getErrorMessage(e as Error);
            console.log(message)
        }
    }

    componentDidUpdate(prevProps: any) {
        if ((this.props.location as any) !== prevProps.location) {
            this.updateProjects()
        }
    }


    openNewMessage = (conversationId: string) => { };

    setOpenNewMessage = (func: (convoId: string) => void) => {
        this.openNewMessage = (conversationId: string) => {
            func(conversationId)
            this.setState({
                toggleDrawer: false
            })
        };
    }

    logout = () => {
        let token = window.localStorage.getItem('token') ?? '';
        unsubscribeFromMessages(token);
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
            console.error(getErrorMessage(e as Error))
        }
    }

    getAction = (notification: BuggNotification) => {
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
                message.error("no type given")
        }
    }


    getNotificationCallToAction = (type: string) => {
        let messages = {
            'PROJECT_INVITE': ' Click this notification to join.',
            'NEW_MESSAGE': ' Click this notification to view.',
        }
        // @ts-ignore
        return messages[type] ?? ' Click this notification to view.'
    }

    onRecieveNotitification = (notif: any) => {
        // alert('SHIT')
        this.fetchUnreadNotifications()
        // @ts-ignore
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
    dismissNotification = async (notificationId: string) => {
        try {
            await axios.delete(baseUrl + '/notification/' + notificationId, {
                headers: getDefaultHeader()
            })
            this.fetchUnreadNotifications()

        } catch (e: any) {
            logErrorMessage(e)

        }

    }

    componentWillUnmount() {
        removeEventListener('new-notification', this.onRecieveNotitification)
    }

    getWelcomeMessage = async () => {
        let formatName = (name: string) => {
            var nameSegments = name.split(' ');
            let shortHandName = nameSegments[0];

            if (nameSegments[1]) {
                shortHandName += ' ' + nameSegments[1].substring(0, 1).toUpperCase() + '.'
            }

            return shortHandName
        }
        try {
            let user = await bugg.User.getMe();
            let userIconUri = await bugg.User.getUserIconUri()
            this.setState({
                name: formatName(user.name),
                userIconUri
            });
        } catch (e: any) {
            console.error(getErrorMessage(e))
        }
    }


    joinProject = async (projectId: string) => {

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
        } catch (e: any) {
            logErrorMessage(e);
            notification.error({
                message: getErrorMessage(e)
            })

        }
    }

    render() {

        return (
            <MediaQuery maxWidth={800}>
                {(isMobile: boolean) =>
                    <div
                        id="bugg-dashboard"
                        className="Dashboard" style={{
                            // display: isMobile ? 'inline-flex',
                            width: '100%',
                            paddingLeft: 20,//330,
                            paddingRight: 10,
                            paddingBottom: 64
                        }}>
                        {!isMobile &&
                            <DesktopNavBar projects={this.state.projects} />
                        }
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

                            width={isMobile ? '90%' : 500}
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


// @ts-ignore
export default withRouter(App);
