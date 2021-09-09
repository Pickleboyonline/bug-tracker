import react from "react";
import { List, Switch } from 'antd'


export default class Notifications extends react.Component {
    state = {
        enableNotifications: true
    }


    getCurrentSetting = async () => {

    }

    setCurrentSetting = async (checked) => {
        this.setState({ enableNotifications: checked })
    }

    render() {
        return <div style={{
            width: 500
        }}>
            <List
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                bordered
                dataSource={[0]}
                renderItem={item => (
                    <List.Item
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