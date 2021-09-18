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

class MobileNavBar extends React.Component {
    state = {
        collapsed: true,
    }


    toggleCollapsed = async () => {
        let backdrop = document.getElementById('bugg-mobile-nav-backdrop');
        // backdrop.style.display = 'block';
        // backdrop.style.opacity = 1;



        let collapsed = !this.state.collapsed;

        this.setState({
            collapsed
        });

        let logo = document.getElementById('bugg-nav-logo-mobile');
        let panel = document.getElementById('bugg-nav-background-mobile');
        let button = document.getElementById('bugg-nav-collaspe-button-mobile');
        let dashboard = document.getElementById('bugg-dashboard');

        try {
            await animate({
                logo,
                collapsed,
                panel,
                button,
                dashboard,
                backdrop
            })
        } catch (e) {
            alert(e)
        }

    };

    navigateTo = (pathname) => {
        this.props.history.push(pathname);
        this.toggleCollapsed()
    }


    render() {
        let projects = this.props.projects ?? [];
        return (
            <>
                <div style={{
                    height: 64,
                    borderColor: 'rgba(0,0,0,.1)',
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderStyle: 'solid',
                    marginLeft: -20,
                    marginRight: -10

                }}>
                    <div

                        style={{
                            height: 64,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 20,
                            gap: 15,
                            zIndex: 100,
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            boxShadow: 'black 0px -4px 13px 0px',
                            backgroundImage: 'linear-gradient( 43deg, rgb(0, 147, 233) 0%, rgb(128, 208, 199) 100%)',
                            backgroundColor: 'rgb(0, 147, 233)'
                        }}
                    >
                        <Button
                            type='ghost'
                            //type="text"
                            onClick={this.toggleCollapsed}
                            style={styles.Button1}>
                            {this.state.collapsed ? <MenuUnfoldOutlined style={{ color: 'white' }} /> : <MenuFoldOutlined style={{ color: 'white' }} />}

                        </Button>
                        <h3 style={{ margin: 0, color: 'white' }}>Bugg</h3>
                    </div>

                </div>
                <div
                    id="bugg-nav-background-mobile"
                    // className="navigation"
                    style={{
                        ...styles.navigation,
                        transform: 'translateX(-270px)'

                    }}>
                    <Space
                        style={styles.Space1}
                        align='center'
                        direction='horizontal'
                    >
                        <Button
                            id="bugg-nav-collaspe-button-mobile"
                            type="text"
                            onClick={this.toggleCollapsed}
                            style={styles.Button1}>
                            {
                                React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)
                            }
                        </Button>
                        <h2
                            id="bugg-nav-logo-mobile"
                            style={styles.h2}>
                            Bugg
                        </h2>
                    </Space>


                    <Menu
                        defaultSelectedKeys={['home']}
                        defaultOpenKeys={['projects']}
                        mode="inline"
                        theme='dark'
                        style={styles.Menu}
                        inlineCollapsed={this.state.collapsed}
                    >
                        <Menu.Item key="home"
                            onClick={() => this.navigateTo('/dashboard')}
                            style={styles.Item1}
                            icon={<DesktopOutlined />}>
                            Home
                        </Menu.Item>


                        <Menu.Item key="settings"
                            onClick={() => this.navigateTo('/dashboard/settings')}
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
                                        onClick={() => this.navigateTo('/dashboard/projects/' + doc.id)}
                                        //className="bugg-sub-menu"
                                        key={doc.id}>{doc.title}</Menu.Item>
                                )
                            }
                        </SubMenu>

                    </Menu>



                </div>
                <div
                    onClick={() => {
                        if (this.state.collapsed === false) {
                            this.toggleCollapsed()
                        }
                    }}
                    id="bugg-mobile-nav-backdrop"
                    style={{
                        display: 'none',
                        opacity: 0,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0 0 0 / 50%)',
                        zIndex: 10000000,
                    }}
                >dsadsa
                </div>
            </>
        )
    }
}

const animate = async (obj = {
    collapsed: '',
    logo: '',
    panel: '',
    button: '',
    dashboard: '',
    backdrop: ''
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
                translateX: -270,
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
                targets: [obj.backdrop],
                opacity: 0,
                duration: 300,
                easing: 'easeInOutQuad',

            }).finished,
        ])
        obj.backdrop.style.display = 'none'




    } else {
        // Expand
        obj.backdrop.style.display = 'block';
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
                translateX: 0,
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
                targets: [obj.backdrop],
                opacity: 1,
                duration: 300,
                easing: 'easeInOutQuad',

            }).finished,
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
        width: 270,
        zIndex: 100000000,
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


export default withRouter(MobileNavBar)