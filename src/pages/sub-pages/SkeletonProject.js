import React from 'react';
import {
    withRouter
} from "react-router-dom";
import Overview from './ProjectsTabs/Overview';
import Bugs from './ProjectsTabs/Bugs';
import Announcements from './ProjectsTabs/Announcements';
import Calendar from './ProjectsTabs/Calendar';
import Settings from './ProjectsTabs/Settings';
import Collaborators from './ProjectsTabs/Collaborators'
import { Menu, Space } from 'antd';
import {

    BugOutlined,
    SettingOutlined,
    DashboardOutlined,
    CalendarOutlined,
    NotificationOutlined,
    TeamOutlined

} from '@ant-design/icons';
import axios from 'axios';
import MediaQuery from 'react-responsive'
import { logErrorMessage } from '../../libraries/network-error-handling';
import { baseUrl, getDefaultHeader } from '../config';


class App extends React.Component {
    constructor(props) {
        super(props);
        let id = this.props.location.pathname.split('/');
        id = id[id.length - 1];
        this.state = {
            activeTab: 'overview',
            title: '',
            imageUrl: '',
            project: { id }
        };

    }

    componentDidMount() {
        let id = this.props.location.pathname.split('/');
        id = id[id.length - 1];
        // console.log(id)
        this.updateProject(id);

        const { location } = this.props;
        let query = new URLSearchParams(location.search)
        if (query.has('action')) {
            this.getUriAction(query.get('action'))();
        }
    }

    getUriAction = (action) => {
        let actionSet = {
            'OPEN_BUG': () => this.setState({ activeTab: 'bugs' }),
            'OPEN_ANNOUNCEMENT': () => this.setState({ activeTab: 'announcements' })
        }
        return actionSet[action] ?? (() => null);
    }


    componentDidUpdate(prevProps) {
        const locationChanged =
            this.props.location !== prevProps.location;


        if (locationChanged) {
            let id = this.props.location.pathname.split('/');
            id = id[id.length - 1];
            this.updateProject(id);

            const { location } = this.props;
            let query = new URLSearchParams(location.search)
            if (query.has('action')) {
                this.getUriAction(query.get('action'))();
            }
        }
    }

    updateProject = async (id) => {
        const token = window.localStorage.getItem('token');
        id = id || this.state.project.id;
        try {
            let { data } = await axios.get('/project/find', {
                headers: getDefaultHeader(),
                params: {
                    projectId: id
                }
            });
            // console.log(data)
            if (data.project) {
                this.setState({
                    title: data.project.title,
                    project: data.project,
                    imageUrl: baseUrl + '/icon/' + (data.project.icon && data.project.icon[0] ? data.project.icon[0].id : '')
                });
            }


        } catch (e) {
            logErrorMessage(e)
        }
    }


    handleClick = e => this.setState({ activeTab: e.key });

    getImageSize = (isMobile) => {
        if (isMobile) {
            return 70
        } else {
            return (this.state.project.description ? 107 : 72)
        }
    }
    render() {
        const current = this.state.activeTab;
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <React.Fragment>
                        <style>
                            {
                                `
                        .bugg-skeleton-project-icon {
                            transition: .3s
                        }
                        `
                            }
                        </style>
                        <Space align='center'>


                            <div
                                className="bugg-skeleton-project-icon"
                                style={{
                                    width: this.getImageSize(isMobile),
                                    height: this.getImageSize(isMobile),
                                    borderRadius: 5,
                                    borderColor: 'rgba(0,0,0,.2)',
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundImage: 'url(' + this.state.imageUrl + ')',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundColor: 'rgba(0 0 0 / 5%)',
                                    marginRight: 10
                                }} />
                            <div>

                                <h1 style={{
                                    fontSize: isMobile ? 26 : 50,
                                    margin: 0
                                }}>
                                    {this.state.title}
                                </h1>
                                <p style={{ margin: 0, opacity: .7, marginLeft: 3 }}>{this.state.project.description ?? ''}</p>
                            </div>
                        </Space>

                        <div style={{
                            display: 'flex',
                            marginRight: isMobile ? 10 : 64,
                            flexDirection: 'column',

                        }}>


                            <Menu
                                overflowedIndicator='More'
                                style={{
                                    marginBottom: 20,
                                    marginTop: 20,
                                    position: 'relative',
                                    // flex: 1
                                    width: '99%',
                                    //left: -18,
                                    // maxWidth: 900
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
                                            this.updateProject()
                                            this.props.updateProjects()

                                        }}
                                            updateProjectOnNavigation={this.props.updateProjects}
                                        />
                                    case "collaborators":
                                        return <Collaborators
                                            isMobile={isMobile}
                                            updateProject={this.props.updateProjects}
                                            project={this.state.project} />
                                    default:
                                        return 'hi'
                                }

                            })()
                        }



                    </React.Fragment>
                }
            </MediaQuery>
        );
    }
}


export default withRouter(App);
