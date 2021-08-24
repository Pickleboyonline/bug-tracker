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
import { Avatar, Menu, Button, Space, Tooltip, Card, Input, } from 'antd';
import {
    UserOutlined,
    MessageOutlined, CloseOutlined, MinusOutlined
} from '@ant-design/icons';
import anime from 'animejs/lib/anime.es.js';
import { List, Typography, Divider } from 'antd';

const data = [
    'Imran S. (ias45@getmixtape.app)',
    'Imran S. (ias45@getmixtape.app)',
    'Imran S. (ias45@getmixtape.app)',
    'Imran S. (ias45@getmixtape.app)',
    'Imran S. (ias45@getmixtape.app)',

];


const { SubMenu } = Menu;
const { Search } = Input;

function Message(props) {
    if (props.recipent)
        return (
            <div style={{
                display: 'inline-flex',
                marginLeft: 7
            }}>
                <Avatar>A</Avatar>
                <p style={{
                    maxWidth: 100,
                    backgroundColor: 'rgb(0 0 0 / 20%)',
                    padding: 5,
                    borderRadius: 4,
                    marginLeft: 10
                }}>
                    {props.message}
                </p>
            </div>)
    else if (props.sender) {
        return (<div style={{
            display: 'inline-flex',
            justifyContent: 'flex-end',
            marginRight: 7
        }}>

            <p style={{
                maxWidth: 100,
                backgroundColor: 'rgb(24 144 255 / 30%)',
                padding: 5,
                borderRadius: 4,
                marginRight: 10
            }}>
                {props.message}
            </p>
            <Avatar>A</Avatar>
        </div>)
    }
    else {
        return null;
    }
}



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            collapsed: false,
            contactsCollapsed: false,
            openMessageCollapsed: false,
            toggleHide: true,
            startToggleHide: true,
            locked: false,
            animationQueue: [],
            waitingFunctions: []
        };

    }

    ticketLock = false;
    currentTicket = 0;
    ticketQueue = 0;


    animationLock = false;

    getTicketLock = async () => {
        while (true) {
            console.log('waiting for ticket')
            if (this.ticketLock === false) {
                this.ticketLock = true;
                return;
            }
        }
    }

    toggleHide = async () => {
        await this.getTicketLock();
        let ticket = this.ticketQueue + 1;
        this.ticketQueue++;
        this.ticketLock = false;

        while (true) {

            console.log('waiting for animation: ' + this.animationLock)
            console.log('my ticket: ' + ticket)
            console.log('currentticket ' + this.currentTicket)
            if (this.animationLock === false && this.currentTicket + 1 === ticket) {
                this.animationLock = true;
                let val = !this.state.toggleHide;
                await new Promise((res) => this.setState({ toggleHide: val }, res));
                let targets = [document.getElementById('open-message-card'), document.getElementById('contacts-card')]
                if (val) {
                    await new Promise((res) => anime({
                        targets,
                        opacity: 0,
                        duration: 500,
                        complete: () => {
                            this.currentTicket++;
                            this.animationLock = false;
                            for (let elem of targets) {
                                elem.style.display = 'none'
                            }
                            res()
                        }
                    }));


                } else {
                    for (let elem of targets) {
                        elem.style.display = 'block'
                    }
                    await new Promise((res) => anime({
                        targets,
                        duration: 500,
                        opacity: 1,
                        complete: () => {
                            this.currentTicket++;
                            this.animationLock = false;
                            res()
                        }
                    }));
                }

                break;
            }
            await new Promise((res) => setTimeout(res, 500))
        }
    }

    toggleHideSimple = () => {
        let val = !this.state.toggleHide;
        this.setState({ toggleHide: val })
        // let targets = [document.getElementById('open-message-card'), document.getElementById('contacts-card')]

        // for (let elem of targets) {
        //     elem.style.display = val ? 'none' : 'block'
        // }

    }


    toggleCollapse = (name) => {
        let toggledState = !this.state[name];

        this.setState({
            [name]: toggledState
        })

        let elem;

        if (name === 'contactsCollapsed') {
            elem = document.getElementById('contacts-card')

        } else if (name === 'openMessageCollapsed') {
            elem = document.getElementById('open-message-card')
        }

        if (toggledState) {
            anime({
                targets: [elem],
                height: 64,
                easing: 'easeInOutQuad',
                duration: 300
            })
        } else {
            anime({
                targets: [elem],
                height: 364,
                easing: 'easeInOutQuad',
                duration: 300
            })
        }

    }

    render() {
        // let match = useRouteMatch();
        return (
            <Space
                align='end'
                size='large'
                style={{
                    position: 'fixed',
                    left: 17.5,
                    bottom: 20,
                    zIndex: 100

                }}>
                <Tooltip
                    placement='right'
                    title="Messages">
                    <Button shape="circle" size='large'
                        onClick={this.toggleHideSimple}
                        icon={<MessageOutlined />} />
                </Tooltip> <>
                    <Card
                        headStyle={{
                            backgroundColor: '#2f2f2f',
                            color: 'white',

                        }}

                        title="Contacts"
                        extra={
                            <Space size='middle'>
                                <Button
                                    onClick={() => this.toggleCollapse('contactsCollapsed')}
                                    type='text' icon={<MinusOutlined style={{ color: 'white' }} />} />
                                <Button
                                    type='text' icon={<CloseOutlined style={{ color: 'white' }} />} />


                            </Space>}

                        style={{
                            width: 350,
                            //height: 64,
                            borderColor: 'rgba(0,0,0,.3)',
                            padding: 0,
                            overflow: 'hidden',
                            display: this.state.toggleHide ? 'none' : 'block'
                        }}
                        id="contacts-card"
                        bodyStyle={{
                            padding: 0,
                            height: 300,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >

                        <style>{`
.bugg-list-item-button:hover {
    background-color: rgb(0 0 0 / 5%);
    cursor: pointer;
}
.bugg-list-item-button {
    background-color: white;
    padding-left: 20px;
}
`}</style>
                        <Space style={{
                            width: '100%',
                            marginTop: 20,
                            marginBottom: 20
                        }}
                        >
                            <Search placeholder="search"
                                style={{
                                    marginLeft: 20,
                                    width: 182
                                }}
                                onSearch={() => alert('hey')} />
                            <Button

                                type='primary'>
                                New Message
                            </Button>
                        </Space>
                        <div style={{
                            flex: 1,
                            overflowY: 'auto'
                        }}>
                            <List
                                //header={<div>Header</div>}
                                //footer={<div>Footer</div>}

                                dataSource={data}
                                renderItem={item => (

                                    <List.Item className="bugg-list-item-button">
                                        <Avatar style={{ marginRight: 10 }}> I</Avatar> {item}
                                    </List.Item>
                                )}
                            />
                        </div>

                    </Card>
                    <Card
                        headStyle={{
                            backgroundColor: '#2f2f2f',
                            color: 'white',

                        }}
                        id="open-message-card"
                        title="Imran S."
                        extra={
                            <Space size='middle'>
                                <Button
                                    onClick={() => this.toggleCollapse('openMessageCollapsed')}

                                    type='text' icon={<MinusOutlined style={{ color: 'white' }} />} />
                                <Button type='text' icon={<CloseOutlined style={{ color: 'white' }} />} />


                            </Space>}

                        style={{
                            width: 350,
                            //height: 64 
                            borderColor: 'rgba(0,0,0,.3)',
                            padding: 0,
                            overflow: 'hidden',
                            display: this.state.toggleHide ? 'none' : 'block'
                        }}
                        bodyStyle={{
                            padding: 0,
                            height: 300
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'column'
                                }}
                                direction='vertical'>
                                <Message sender message="bruh" />
                                <Message recipent message="bruh moment" />
                            </div>

                            <div style={{
                                //backgroundColor: 'green',
                                width: '100%',
                                padding: 6,
                                display: 'inline-flex'
                            }}>
                                <Input.TextArea
                                    style={{
                                        flex: 1,
                                        marginRight: 10
                                    }}
                                    enterButton="Send" />
                                <Button
                                    style={{
                                        height: 60
                                    }}
                                    type='primary' >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </Card> </>
            </Space >
        );
    }
}


export default withRouter(App);
