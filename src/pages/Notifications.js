import React from 'react'
import {
    Card, Button, Avatar
    , Col, Row, Divider, List, notification, Space, message
} from 'antd'
import axios from 'axios';
import { MailOutlined } from '@ant-design/icons'
import moment from 'moment';
import { getErrorMessage, logErrorMessage } from '../libraries/network-error-handling';
import { getDefaultHeader } from './config';

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
                this.props.joinProject(notification.payload.projectId)
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
                headers: getDefaultHeader()
            })
            this.fetchNotifications()
            message.success("Notification Dismissed")
        } catch (e) {
            logErrorMessage(e)
            message.error("Error: " + getErrorMessage(e))
        }

    }

    dismissAllNotifications = async () => {
        try {
            await axios.delete('http://localhost:1337/notification/all', {
                headers: getDefaultHeader()
            })
            this.fetchNotifications()
            message.success("All notifications were dismissed")
        } catch (e) {
            logErrorMessage(e)
            message.error("Error: " + getErrorMessage(e))
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
                headers: getDefaultHeader(),
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
            logErrorMessage(e)
        }
    }

    updatePagination = (page, pageSize) => {
        this.setState({
            page, pageSize
        })
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
                        <div
                            key={item.id}
                            style={{
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