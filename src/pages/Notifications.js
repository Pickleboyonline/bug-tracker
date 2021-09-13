import React from 'react'
import {
    Card, Button, Avatar
    , Col, Row, Divider, List, notification, Space, message
} from 'antd'
import axios from 'axios';
import { MailOutlined } from '@ant-design/icons'
import moment from 'moment';

class Notification extends React.Component {

    state = {
        page: 1,
        pageSize: 10,
        notifications: [],
        isListening: false
    }
    TOKEN = window.localStorage.getItem('token')


    componentDidMount() {
        let { socket } = this.props
        if (socket) socket.on('new-notification', this.onRecieveNotitification)
        this.fetchNotifications()
        // alert('hi')
    }

    getAction = (notification) => {
        switch (notification.type) {
            case 'PROJECT_INVITE':
                alert("project invite")
                break;
            default:
                alert("no type given")
        }
        this.dismissNotification(notification.id)
    }


    componentWillUnmount() {
        let { socket } = this.props;
        if (this.props.socket) socket.off('new-notification', this.onRecieveNotitification)
    }

    /**
     * Dismisses notification on server
     * @param {string} notificationId Id of notification
     */
    dismissNotification = async (notificationId) => {
        try {
            await axios.delete('http://localhost:1337/notification/' + notificationId, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
            this.fetchNotifications()
            message.success("Notification Dismissed")
        } catch (e) {
            console.log(e.response || e)
            message.error("Notification could not be dismissed due to an error")
        }

    }

    dismissAllNotifications = async () => {
        try {
            await axios.delete('http://localhost:1337/notification/all', {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
            this.fetchNotifications()
            message.success("All notifications were dismissed")
        } catch (e) {
            console.log(e.response || e)
            message.error("Notifications could not be dismissed due to an error")
        }

    }


    onRecieveNotitification = (notif) => {
        this.setState({
            page: 1
        }, this.fetchNotifications);

    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.socket === null && this.props.socket !== null) {
    //         this.props.socket.on('new-notification', this.onRecieveNotitification)
    //     }
    // }


    fetchNotifications = async () => {
        const { page, pageSize } = this.state;

        try {
            let { data } = await axios.get('http://localhost:1337/notification/all', {
                headers: {
                    'x-auth-token': this.TOKEN
                },
                params: {
                    limit: pageSize,
                    skip: (page - 1) * pageSize
                }
            });
            console.log(data)

            this.setState({
                notifications: data.notifications
            })

        } catch (e) {
            console.log(e.response || e)
        }
    }

    updatePagination = (page, pageSize) => {

    }

    render() {
        return (
            <div >
                <Space style={{
                    marginBottom: 20
                }}>
                    <Button
                        onClick={this.dismissAllNotifications}
                        type='primary'>
                        Dismiss All
                    </Button>
                </Space>
                <List
                    pagination={{
                        pageSize: this.state.pageSize,
                        page: this.state.page,
                        onChange: this.updatePagination,

                    }}
                    dataSource={this.state.notifications}
                    renderItem={item =>
                        <div style={{
                            marginBottom: 20
                        }}>
                            <Card
                                actions={[
                                    <Button
                                        onClick={() => this.getAction(item)}
                                        type='primary'>Join Project</Button>,
                                    <Button
                                        onClick={() => this.dismissNotification(item.id)}
                                        type='link'>Dismiss</Button>
                                ]}
                            >
                                <Card.Meta
                                    avatar={<Avatar icon={<MailOutlined />} />}
                                    title={item.title}

                                    description={
                                        item.description + ' - ' + moment(new Date(item.createdAt)).fromNow()
                                    }
                                />
                            </Card>
                        </div>
                    }
                />
            </div>
        )

    }
}

export default Notification;