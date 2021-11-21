import react from "react";
import { List, message, Switch } from 'antd'
import axios from "axios";
import { getDefaultHeader } from './../../../config';
import { getErrorMessage, logErrorMessage } from "../../../../libraries/network-error-handling";


export default class Notifications extends react.Component {
    state = {
        enableNotifications: true
    }
    TOKEN = window.localStorage.getItem('token')

    componentDidMount() {
        this.getCurrentSetting()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.project.id !== this.props.project.id) {
            this.getCurrentSetting()
        }
    }

    getCurrentSetting = async () => {
        try {
            const { data } = await axios.get('/notification-setting/' + this.props.project.id, {
                headers: getDefaultHeader()
            })
            this.setState({
                enableNotifications: data.notificationSetting.recieveNotifications
            })

        } catch (e) {
            logErrorMessage(e)
            message.error("Error: " + getErrorMessage(e))
        }
    }

    setCurrentSetting = async (checked) => {
        try {
            await axios.put('/notification-setting/' + this.props.project.id, {
                recieveNotifications: checked
            }, {
                headers: getDefaultHeader()
            });
            message.success('Setting updated!')
            this.setState({ enableNotifications: checked })
        } catch (e) {
            logErrorMessage(e)
            message.error('Error: ' + getErrorMessage(e))
        }

    }

    render() {
        const { isMobile } = this.props
        return <div style={{
            width: isMobile ? 'unset' : 500 //500
        }}>
            <List
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                bordered
                dataSource={[0]}
                renderItem={item => (
                    <List.Item
                        key={item}
                        extra={
                            <Switch
                                onChange={this.setCurrentSetting}
                                checked={this.state.enableNotifications} />
                        }
                    >
                        Enable notifications for this project?

                    </List.Item>
                )}
            />
        </div>
    }
}