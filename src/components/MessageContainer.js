import react from 'react';
import {
    Card,
    Space,
    Button,
    Input,
    Avatar,
    List
} from 'antd';
import {
    CloseOutlined, MinusOutlined
} from '@ant-design/icons';
import axios from 'axios';
import anime from 'animejs';


function Message(props) {
    if (props.recipient)
        return (
            <div style={{
                display: 'inline-flex',

                width: '100%'
            }}>
                <Avatar style={{ marginLeft: 7, }}>{props.avatarLetter}</Avatar>
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

            width: '100%'
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
            <Avatar style={{ marginRight: 7, }}>{props.avatarLetter}</Avatar>
        </div>)
    }
    else {
        return null;
    }
}


function getRecipient(participants) {
    return ''
}

export default class MessageContainer extends react.Component {
    state = {
        messages: [],
        body: '',
        toggledState: false,
        listening: false
    }
    TOKEN = window.localStorage.getItem('token')

    componentDidMount() {
        // io.sails.headers = {
        //     'x-auth-t'
        // }
        this.fetchMessages()
        // add message event handler
        if (this.props.socket) this.props.socket.on('new-message', this.onRecieveNewMessage);
        console.log('listing...')
        this.setState({
            listening: true
        })

    }

    componentWillUnmount() {
        // remove message event handler
        if (this.props.socket) this.props.socket.off('new-message', this.onRecieveNewMessage);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.socket === null && this.state.listening === false) {
            if (this.props.socket) this.props.socket.on('new-message', this.onRecieveNewMessage);
            console.log('listing...')
            this.setState({
                listening: true
            })
        }
    }



    // TODO: add invite reverse scroll
    fetchMessages = async () => {
        try {
            let { data } = await axios.get('http://localhost:1337/conversation/' + this.props.conversation.id, {
                headers: {
                    'x-auth-token': this.TOKEN
                },
                params: {
                    limit: 20,
                    skip: 0
                }
            });

            this.setState({
                messages: data.messages.reverse(),
                total: data.total
            })
        } catch (e) {
            console.log(e.response || e)
        }
    }

    sendMessage = async () => {
        if (this.state.body.replace(/ /g, "") === '') return;

        try {
            let { data } = await axios.post('http://localhost:1337/message/' + this.props.conversation.recipient.id, {
                body: this.state.body
            }, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
            let { messages } = this.state;
            messages.push(data.message);
            this.setState({
                messages,
                body: ''
            })
            this.props.fetchConversations()
        } catch (e) {
            console.log(e.response || e)
        }
    }


    toggleCollapse = () => {
        let newToggleState = !this.state.toggledState
        this.setState({
            toggledState: newToggleState
        })

        let elem = document.getElementById(this.props.conversation.id)


        if (newToggleState) {
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

    onRecieveNewMessage = (message) => {
        console.log('NEW MESSAGE')
        let { messages } = this.state;
        messages.push(message);
        this.setState({
            messages
        })
        this.props.fetchConversations()
    }

    render() {
        const { removeConversation, conversation } = this.props;

        return (
            <Card
                headStyle={{
                    backgroundColor: '#2f2f2f',
                    color: 'white',

                }}
                id={conversation.id}
                title={conversation.reciepent.name}
                extra={
                    <Space size='middle'>
                        <Button
                            onClick={this.toggleCollapse}

                            type='text' icon={<MinusOutlined style={{ color: 'white' }} />} />
                        <Button
                            type='text'
                            onClick={() => removeConversation(conversation.id)}
                            icon={<CloseOutlined style={{ color: 'white' }} />}
                        />


                    </Space>}

                style={{
                    width: 350,
                    //height: 64 
                    borderColor: 'rgba(0,0,0,.3)',
                    padding: 0,
                    overflow: 'hidden',
                    display: this.props.toggleHide ? 'none' : 'block'
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
                            // justifyContent: 'flex-end',
                            flexDirection: 'column-reverse',
                            overflowY: 'auto'
                        }}
                        direction='vertical'>
                        {/* <Message sender message="bruh" /> */}
                        {/* {(new Array(20)).fill(2).map((val, ind) => <div>
                            <Message sender message={"bruh " + ind} />
                        </div>)} */}
                        <List

                            dataSource={this.state.messages}
                            renderItem={(item, index) =>
                                <div>
                                    <Message
                                        sender={item.sender.isYou}
                                        recipient={!item.sender.isYou}
                                        timestamp={item.createdAt}
                                        avatarLetter={item.sender.name.substring(0, 1).toUpperCase()}
                                        message={item.body} />
                                </div>

                            }
                        />
                    </div>

                    <div style={{
                        //backgroundColor: 'green',
                        width: '100%',
                        padding: 6,
                        display: 'inline-flex'
                    }}>
                        <Input
                            style={{
                                flex: 1,
                                marginRight: 10
                            }}
                            placeholder='Start Typing...'
                            value={this.state.body}
                            onChange={(e) => this.setState({ body: e.target.value })}
                            onPressEnter={this.sendMessage}

                        />
                        <Button
                            // style={{
                            //     height: 60
                            // }}
                            onClick={this.sendMessage}
                            type='primary' >
                            Send
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }
}