import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Overview from './sub-pages/Overview';
import SkeletonProject from './sub-pages/SkeletonProject';
import { Avatar, Menu, Button, Space, Drawer, Dropdown } from 'antd';
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
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';
import Messages from './Messages';
import AvatarSettings from '../components/AvatarSettings';

const { SubMenu } = Menu;
const menu = (
    <Menu>
        <Menu.Item key="0">
            1st menu item
        </Menu.Item>
        <Menu.Item key="1">
            2nd menu item
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
);
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            collapsed: false,
            toggleDrawer: false
        };

    }

    componentDidMount() {
        let elem = document.getElementsByClassName('ant-menu ant-menu-sub ant-menu-inline')[0];
        elem.style['background-color'] = 'transparent';
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


        if (collapsed) {
            // TODO collaspe animation
            anime({
                targets: [logo],
                color: 'rgba(0, 0, 0, .5)',
                translateX: 30,
                duration: 300,
                easing: 'easeInOutQuad',
            })
            anime({
                targets: [panel],
                width: 75,
                easing: 'easeInOutQuad',
                duration: 300
            })

            anime({
                targets: [button],
                translateX: 8,
                duration: 100,
                easing: 'easeInOutQuad',
                scale: 1.2
            })
            anime({
                targets: [dashboard],
                paddingLeft: 200,
                duration: 300,
                easing: 'easeInOutQuad',

            })
        } else {
            // Expand
            anime({
                targets: [logo],
                color: 'rgba(255, 255, 255, 1)',
                translateX: 0,
                duration: 300,
                easing: 'easeInOutQuad',
            })
            anime({
                targets: [panel],
                width: 270,
                easing: 'easeInOutQuad',
                duration: 300
            })
            anime({
                delay: 0,
                targets: [button],
                translateX: 0,
                duration: 100,
                easing: 'easeInOutQuad',
                scale: 1
            })
            anime({
                targets: [dashboard],
                paddingLeft: 330,
                duration: 300,
                easing: 'easeInOutQuad',

            })
        }

    };
    render() {
        // let match = useRouteMatch();
        return (
            <div
                id="bugg-dashboard"
                className="Dashboard" style={{
                    display: 'inline-flex',
                    width: '100%',
                    paddingLeft: 330,
                    paddingBottom: 64
                }}>

                <div
                    id="bugg-nav-background"
                    className="navigation" style={{
                        color: 'white',
                        width: 270,
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
                    <Space
                        style={{
                            marginTop: 30,
                            paddingLeft: 9,
                            marginBottom: 30
                        }}
                        align='center' direction='horizontal'>
                        <Button
                            id="bugg-nav-collaspe-button"
                            type="text" onClick={this.toggleCollapsed}
                            style={{

                                //marginLeft: 9, 
                                color: 'white'
                            }}>
                            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                        </Button>
                        <h2
                            id="bugg-nav-logo"
                            style={{
                                // marginBottom: 30,
                                // marginLeft: 0,
                                // marginTop: 30,
                                margin: 0,
                                color: 'white',
                                position: 'fixed',
                                top: 29,
                                left: 70
                            }}>
                            Bugg
                        </h2>
                    </Space>


                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme='dark'
                        style={{
                            backgroundColor: 'transparent'
                        }}
                        inlineCollapsed={this.state.collapsed}
                    >
                        <Menu.Item key="1"
                            onClick={() => this.props.history.push('/dashboard')}
                            style={{
                                backgroundColor: 'transparent'
                            }}
                            icon={<DesktopOutlined />}>
                            Home
                        </Menu.Item>
                        <Menu.Item key="1"
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
                            <Menu.Item
                                style={{
                                    backgroundColor: 'transparent'
                                }}
                                onClick={() => this.props.history.push('/dashboard/projects/mixtape')}
                                //className="bugg-sub-menu"
                                key="5">Mixtape</Menu.Item>

                        </SubMenu>

                    </Menu>



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
                        <SkeletonProject />
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
                    <Notifications />
                </Drawer>

                <Messages />
            </div >
        );
    }
}


export default withRouter(App);
