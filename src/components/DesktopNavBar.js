import { withRouter } from 'react-router-dom';
import { Space, Button, Menu } from 'antd'
import anime from "animejs";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DesktopOutlined,
    SettingOutlined,
    CodeOutlined
} from '@ant-design/icons';
import React from 'react';

const { SubMenu } = Menu;

class DesktopNavBar extends React.Component {
    state = {
        collapsed: false,
    }

    componentDidMount() {
        if (this.props.initialCollasped !== undefined) {
            this.toggleCollapsed(this.props.initialCollasped)
        } else {
            this.toggleCollapsed(false)
        }
    }

    async componentWillUnmount() {
        await this.toggleCollapsed(true, true)
        // await anime({
        //     targets: [document.getElementById('bugg-dashboard')],
        //     paddingLeft: 10,
        //     duration: 300,
        //     easing: 'easeInOutQuad',
        // }).finished
        //  document.getElementById('bugg-dashboard').style.paddingLeft = '10px';
    }

    toggleCollapsed = async (value, willUnmount) => {
        let collapsed = !this.state.collapsed;
        if (typeof value === 'boolean') collapsed = value;

        this.setState({
            collapsed
        });

        let logo = document.getElementById('bugg-nav-logo');
        let panel = document.getElementById('bugg-nav-background');
        let button = document.getElementById('bugg-nav-collaspe-button');
        let dashboard = document.getElementById('bugg-dashboard');

        await animate({
            logo,
            collapsed,
            panel,
            button,
            dashboard
        }, willUnmount)
    };

    render() {
        let projects = this.props.projects ?? [];
        return (
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
                    defaultSelectedKeys={['home']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme='dark'
                    style={styles.Menu}
                    inlineCollapsed={this.state.collapsed}
                >
                    <Menu.Item key="home"
                        onClick={() => this.props.history.push('/dashboard')}
                        style={styles.Item1}
                        icon={<DesktopOutlined />}>
                        Home
                    </Menu.Item>


                    <Menu.Item key="settings"
                        onClick={() => this.props.history.push('/dashboard/settings')}
                        style={{
                            backgroundColor: 'transparent'
                        }}
                        icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>

                    <SubMenu
                        key="projects"
                        style={{
                            backgroundColor: 'transparent'
                        }}
                        icon={<CodeOutlined />}
                        title="Projects"
                        className="bugg-sub-menu"

                    >
                        {
                            projects.map((doc, ind) =>
                                <Menu.Item
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                    onClick={() => this.props.history.push('/dashboard/projects/' + doc.id)}
                                    //className="bugg-sub-menu"
                                    key={doc.id}>{doc.title}</Menu.Item>
                            )
                        }
                    </SubMenu>

                </Menu>



            </div>
        )
    }
}

const animate = async (obj = {
    collapsed: '',
    logo: '',
    panel: '',
    button: '',
    dashboard: ''
}, willUnmount) => {
    if (obj.collapsed) {
        // TODO collaspe animation
        await Promise.all([
            anime({
                targets: [obj.logo],
                // color: 'rgba(0, 0, 0, .5)',
                opacity: 0,
                translateX: 30,
                duration: 300,
                easing: 'easeInOutQuad',
            }).finished,
            anime({
                targets: [obj.panel],
                width: 75,
                easing: 'easeInOutQuad',
                duration: 300
            }).finished,
            anime({
                targets: [obj.button],
                translateX: 8,
                duration: 100,
                easing: 'easeInOutQuad',
                scale: 1.2
            }).finished,
            anime({
                targets: [obj.dashboard],
                paddingLeft: (willUnmount ? 20 : 130),
                duration: 300,
                easing: 'easeInOutQuad',

            }).finished,
        ])





    } else {
        // Expand
        await Promise.all([
            anime({
                targets: [obj.logo],
                color: 'rgba(255, 255, 255, 1)',
                opacity: 1,
                translateX: 0,
                duration: 300,
                easing: 'easeInOutQuad',
            }).finished,
            anime({
                targets: [obj.panel],
                width: 270,
                easing: 'easeInOutQuad',
                duration: 300
            }).finished,
            anime({
                delay: 0,
                targets: [obj.button],
                translateX: 0,
                duration: 100,
                easing: 'easeInOutQuad',
                scale: 1
            }).finished,
            anime({
                targets: [obj.dashboard],
                paddingLeft: 330,
                duration: 300,
                easing: 'easeInOutQuad',

            }).finished
        ])



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
        width: 0,//270,
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
        // position: 'fixed',
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


export default withRouter(DesktopNavBar)