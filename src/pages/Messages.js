import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";

import { Avatar, Menu, Button, Space, Tooltip, Card, Input, } from 'antd';
import {
    UserOutlined,
    MessageOutlined, CloseOutlined, MinusOutlined
} from '@ant-design/icons';
import anime from 'animejs/lib/anime.es.js';
import { List, Typography, Divider } from 'antd';
import axios from 'axios';
import MessageContainer from '../components/MessageContainer';
import moment from 'moment';
import CreateConversation from '../components/CreateConversation';

const { SubMenu } = Menu;
const { Search } = Input;

// var socketIOClient = require('socket.io-client');
// var sailsIOClient = require('sails.io.js');

// var IO = sailsIOClient(socketIOClient);

// IO.sails.url = 'http://localhost:1337';
// IO.sails.transports = ['websocket'];

// IO.sails.rejectUnauthorized = false

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            collapsed: true,
            contactsCollapsed: false,
            openMessageCollapsed: false,
            toggleHide: true,
            conversations: [],
            activeConversations: [],
            socket: null,
            createConversationIsVisible: false
        };

    }

    TOKEN = window.localStorage.getItem('token');

    // TODO: on recieve new message, re fetch conversations
    componentDidMount() {
        this.fetchConversations()
        this.connectToSocket()
    }

    connectToSocket = () => {
        let io = document.io;
        io.sails.rejectUnauthorized = false;
        io.sails.url = 'http://localhost:1337';
        io.sails.autoConnect = false;
        io.sails.reconnection = true;
        io.sails.headers = {
            'x-auth-token': this.TOKEN
        }
        try {
            let socket = io.sails.connect()
            socket.on('connect', () => {
                socket.post('http://localhost:1337/message/subscribe', {}, (res, jwr) => {
                    console.log(res)
                    console.log(jwr)
                });
                this.setState({
                    socket
                })
            })

        } catch (e) {
            console.log(e)
        }

        console.log("hello")
    }

    toggleHideSimple = () => {
        let val = !this.state.toggleHide;
        this.setState({ toggleHide: val })
        if (val) this.fetchConversations()
        // let targets = [document.getElementById('open-message-card'), document.getElementById('contacts-card')]

        // for (let elem of targets) {
        //     elem.style.display = val ? 'none' : 'block'
        // }

    }

    // TODO: rework to aim for multiple components
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

    /**
     * Recieves conversations from server and sets state
     * 
     */
    fetchConversations = async () => {
        try {
            let { data: { conversations } } = await axios.get('http://localhost:1337/conversation/all', {
                headers: {
                    'x-auth-token': this.TOKEN
                },
            })
            await new Promise((res) => this.setState({ conversations }, res))
        } catch (e) {
            console.log(e.response || e)
        }
    }


    selectConversation = (conversation) => {
        let newConvos = this.state.activeConversations
        if (newConvos.map((doc) => doc.id).includes(conversation.id)) return

        if (newConvos.length === 2) {
            newConvos.splice(0, 1)
            newConvos.push(conversation)
        } else {
            newConvos.push(conversation)
        }
        this.setState({
            activeConversations: newConvos
        })
    }

    /**
     * removes conversation from state
     * @param {string} conversationId 
     */
    removeConversation = (conversationId) => {
        let newConvos = this.state.activeConversations;
        let index = newConvos.findIndex((value) => value.id === conversationId);

        if (index !== -1) {
            newConvos.splice(index, 1);
            this.setState({
                activeConversations: newConvos
            })
        }
        this.fetchConversations()
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
                </Tooltip>
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
                            {/* <Button
                                    type='text' icon={<CloseOutlined style={{ color: 'white' }} />} /> */}


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
                    <Space style={{
                        width: '100%',
                        marginTop: 20,
                        marginBottom: 20
                    }}
                    >
                        <Button
                            style={{
                                marginLeft: 20
                            }}
                            onClick={() => this.setState({ createConversationIsVisible: true })}
                            type='primary'>
                            Send New Message
                        </Button>
                    </Space>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto'
                    }}>
                        <List
                            dataSource={this.state.conversations}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    style={{
                                        paddingLeft: 20,
                                        paddingRight: 20
                                    }}
                                    extra={[moment((new Date(item.updatedAt)).getTime()).fromNow()]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <a href="#" onClick={(e) => {
                                                this.selectConversation(item)
                                                e.preventDefault()
                                            }}
                                            >{item.reciepent.name}
                                            </a>}
                                        avatar={
                                            <Avatar style={{ marginRight: 10 }}>
                                                {item.reciepent.name.substring(0, 1).toUpperCase()}
                                            </Avatar>}
                                        description={item.lastMessageText}
                                    />

                                </List.Item>
                            )}
                        />
                    </div>

                </Card>
                {
                    this.state.activeConversations.map((item) =>
                        <MessageContainer
                            key={item.id}
                            // io={io}
                            socket={this.state.socket}
                            toggleHide={this.state.toggleHide}
                            fetchConversations={this.fetchConversations}
                            removeConversation={this.removeConversation}
                            conversation={item} />
                    )
                }


                <CreateConversation
                    visible={this.state.createConversationIsVisible}// {}
                    fetchConversations={this.fetchConversations}
                    selectConversation={this.selectConversation}
                    closeModal={() => this.setState({ createConversationIsVisible: false })}
                />
            </Space >
        );
    }
}


export default withRouter(App);
