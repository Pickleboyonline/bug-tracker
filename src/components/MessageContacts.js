import moment from "moment";
import { Tag, Space, Card, Button, List, Avatar } from 'antd'
import {

    MinusOutlined
} from '@ant-design/icons';


function MessageContacts(props) {
    const {
        toggleCollapse,
        toggleHide,
        sendMessage,
        conversations,
        selectConversation,
        activeConversations,
        isMobile
    } = props;

    const showNew = (conversation) => {
        let activeConversationsIds = activeConversations.map(doc => doc.id);

        if (activeConversationsIds.includes(conversation.id)) {
            return false;
        } else {
            return conversation.newMessages
        }

    }

    const getDisplay = () => {
        if (isMobile) {
            if (activeConversations.length > 0) {
                return 'none'
            } else {
                return (toggleHide) ? 'none' : 'block'
            }
        } else {
            return (toggleHide) ? 'none' : 'block'
        }

    }

    const formatName = (name) => {
        var nameSegments = name.split(' ');
        let shortHandName = nameSegments[0];

        if (nameSegments[1]) {
            shortHandName += ' ' + nameSegments[1].substring(0, 1).toUpperCase() + '.'
        }

        return shortHandName
    }


    return (

        <Card
            headStyle={{
                backgroundColor: '#2f2f2f',
                color: 'white',

            }}

            title="Contacts"
            extra={
                <Space size='middle'>
                    <Button
                        onClick={toggleCollapse}
                        type='text' icon={<MinusOutlined style={{ color: 'white' }} />} />
                </Space>
            }

            style={{
                width: 350,
                //height: 64,
                borderColor: 'rgba(0,0,0,.3)',
                padding: 0,
                overflow: 'hidden',
                display: getDisplay()
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
                    onClick={sendMessage}
                    type='primary'>
                    Send New Message
                </Button>
            </Space>
            <div style={{
                flex: 1,
                overflowY: 'auto'
            }}>
                <List
                    dataSource={conversations}
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
                                title={<>
                                    <a href="#" onClick={(e) => selectConversation(e, item)}
                                    >{formatName(item.reciepent.name)}
                                    </a>
                                    {showNew(item) ?
                                        <Tag
                                            style={{
                                                marginLeft: 10
                                            }}
                                            color='red'>New</Tag> : null
                                    }

                                </>}
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
    )
}

export default MessageContacts