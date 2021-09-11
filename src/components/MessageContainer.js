import react from 'react';
import {
    Card,
    Space,
    Button,
    Input,
    Avatar
} from 'antd';
import {
    CloseOutlined, MinusOutlined
} from '@ant-design/icons';

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


function getRecipient(participants) {
    return ''
}

export default class MessageContainer extends react.Component {
    state = {
        messages: [],
        body: '',

    }

    componentDidMount() {
        this.fetchMessages()
    }

    // TODO: add invite reverse scroll
    fetchMessages = async () => {
        try {

        } catch (e) {
            console.log(e.response || e)
        }
    }

    sendMessage = async () => {
        try {

        } catch (e) {
            console.log(e.response || e)
        }
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
                            onClick={() => true}

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
            </Card>
        )
    }
}