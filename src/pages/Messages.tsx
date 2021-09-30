import React from 'react';
import {
    withRouter
} from "react-router-dom";
import MessageContacts from './../components/MessageContacts';
import {
    Button,
    Space,
    Tooltip,
} from 'antd';
import {
    MessageOutlined
} from '@ant-design/icons';
import anime from 'animejs';
import MessageContainer from '../components/MessageContainer';
import CreateConversation from '../components/CreateConversation';
import { logErrorMessage } from '../libraries/network-error-handling';
import { addEventListener, removeEventListener } from '../libraries/socket';
import bugg from './../libraries/bugg';

interface Conversation {
    id: string,
    newMessages: boolean
}

class App extends React.Component<any, any> {
    constructor(props: any) {
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

    // TODO: on recieve new message, re fetch conversations
    componentDidMount() {
        this.fetchConversations()
        // this.connectToSocket()
        this.props.setOpenNewMessage(this.openNewMessage);
        addEventListener('new-message', this.fetchConversations)
    }

    componentWillUnmount() {
        removeEventListener('new-message', this.fetchConversations)
    }

    toggleHideSimple = (disableRefresh?: boolean) => {
        let newToggleHide = !this.state.toggleHide;
        this.setState({ toggleHide: newToggleHide })


        if (!newToggleHide && disableRefresh !== true) {
            this.fetchConversations()

        }
    }

    openNewMessage = async (conversationId: string) => {
        // alert('HEY')
        if (this.state.toggleHide) {
            this.toggleHideSimple(true)
        }

        await this.fetchConversations()
        let conversationIds = this.state.conversations.map((doc: any) => doc.id);
        console.log(conversationId)
        console.log(conversationIds)
        let ind = conversationIds.indexOf(conversationId);
        console.log(ind)
        if (ind === -1) return;

        this.selectConversation(this.state.conversations[ind]);
    }

    // TODO: rework to aim for multiple components
    toggleCollapse = (name: string) => {
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
            // let { data: { conversations } } = await axios.get('/conversation/all', {
            //     headers: getDefaultHeader()
            // })
            let conversations = await bugg.Message.getConversations()
            // @ts-ignore
            await new Promise((res) => this.setState({ conversations }, res))
        } catch (e: any) {
            logErrorMessage(e)
        }
    }


    selectConversation = (conversation: Conversation) => {
        let newConvos = this.state.activeConversations
        if (newConvos.map((doc: any) => doc.id).includes(conversation.id)) return

        if (newConvos.length === 2) {
            newConvos.splice(0, 1)
            newConvos.push(conversation)
        } else {
            newConvos.push(conversation)
        }
        this.setState({
            activeConversations: newConvos
        })
        this.props.setActiveConversationIds(newConvos.map((doc: any) => doc.id))
    }

    /**
     * removes conversation from state
     * @param {string} conversationId 
     */
    removeConversation = (conversationId: string) => {
        let newConvos = this.state.activeConversations;
        let index = newConvos.findIndex((value: Conversation) => value.id === conversationId);

        if (index !== -1) {
            newConvos.splice(index, 1);
            this.setState({
                activeConversations: newConvos
            })
            this.props.setActiveConversationIds(newConvos.map((doc: Conversation) => doc.id))
        }
        this.fetchConversations()

    }

    showNew = (conversation: Conversation) => {
        let activeConversationsIds = this.state.activeConversations.map((doc: Conversation) => doc.id);

        if (activeConversationsIds.includes(conversation.id)) {
            return false;
        } else {
            return conversation.newMessages
        }

    }

    render() {
        const { isMobile } = this.props;

        return (
            <Space
                align={isMobile ? 'start' : 'end'}
                size='large'
                direction={isMobile ? 'vertical' : 'horizontal'}
                style={{
                    position: 'fixed',
                    left: isMobile ? 10 : 17.5,
                    bottom: 20,
                    zIndex: 100,


                }}>
                {
                    !isMobile && <Tooltip
                        placement='right'
                        title="Messages">
                        <Button shape="circle" size='large'
                            onClick={() => this.toggleHideSimple()}
                            icon={<MessageOutlined />} />
                    </Tooltip>}
                {
                    // Contacts card
                }
                <div>
                    <MessageContacts
                        toggleCollapse={() => this.toggleCollapse('contactsCollapsed')}
                        toggleHide={this.state.toggleHide}
                        isMobile={isMobile}
                        sendMessage={() => this.setState({ createConversationIsVisible: true })}
                        conversations={this.state.conversations}
                        selectConversation={(e: Event, item: Conversation) => {
                            this.selectConversation(item)
                            e.preventDefault()
                        }}
                        activeConversations={this.state.activeConversations}
                    />
                </div>

                {
                    this.state.activeConversations.map((item: Conversation) =>
                        <MessageContainer
                            key={item.id}
                            socket={this.state.socket}
                            toggleHide={this.state.toggleHide}
                            fetchConversations={this.fetchConversations}
                            removeConversation={this.removeConversation}
                            conversation={item}
                            fetchUnreadNotifications={this.props.fetchUnreadNotifications}
                        />
                    )
                }
                {
                    isMobile && <Tooltip
                        placement='right'
                        title="Messages">
                        <Button shape="circle" size='large'
                            onClick={() => this.toggleHideSimple()}
                            icon={<MessageOutlined />} />
                    </Tooltip>}

                <CreateConversation
                    visible={this.state.createConversationIsVisible}
                    fetchConversations={this.fetchConversations}
                    selectConversation={this.selectConversation}
                    closeModal={() => this.setState({ createConversationIsVisible: false })}
                />
            </Space >
        );
    }
}


export default withRouter(App);
