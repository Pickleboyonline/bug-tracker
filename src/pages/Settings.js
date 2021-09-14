import React from 'react'
import {
    Input, Button, Statistic
    , Col, Row, Divider, Space, Timeline,
    List,
    Avatar
} from 'antd'
import { getMe } from '../libraries/bugg';
import { logErrorMessage } from '../libraries/network-error-handling';

const data = [
    'General',

];
class Settings extends React.Component {
    state = {
        selectedSetting: data[0].toLowerCase(),
        user: {
            name: '',
            email: '',
            id: '',
        },
        name: '',
        email: ''
    }
    componentDidMount() {
        this.fetchUser()
    }


    fetchUser = async () => {
        try {
            let user = await getMe();
            this.setState({
                user,
                name: user.name
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }

    /**
     * Udates user name and email?
     */
    updateUserField = (field, value) => {

    }



    render() {
        return (
            <div style={{ width: 1100 }}>
                <div style={{ width: 800 }}>


                    <h1>
                        Settings
                    </h1>
                    <Divider

                    />
                </div>

                <div style={{
                    display: 'inline-flex',
                    width: '100%'
                }}>
                    <style>{`
.bugg-list-item-button:hover {
    background-color: rgb(0 0 0 / 5%);
    cursor: pointer;
}
.bugg-list-item-button {
    background-color: white;
}
`}</style>
                    <List
                        // header={<div>Header</div>}
                        // footer={<div>Footer</div>}
                        bordered
                        dataSource={data}
                        style={{
                            width: 300
                        }}
                        renderItem={item => (
                            <List.Item
                                style={{
                                    color: (this.state.selectedSetting === item.toLowerCase() ? '#0094f7' : 'black')
                                }}
                                className="bugg-list-item-button">
                                <Avatar
                                    style={{
                                        marginRight: 10
                                    }}
                                >{item.substring(0, 1).toLocaleUpperCase()}</Avatar> {item}
                            </List.Item>
                        )}
                    />
                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>
                        {
                            (() => {
                                const settings = [
                                    {
                                        title: 'Name',
                                        reactNode: (<Space  >
                                            {
                                                this.state.name !== this.state.user.name ?
                                                    <Button
                                                        //onClick={() => updateProject('title')}
                                                        type='primary'>
                                                        Update
                                                    </Button> : null}
                                            <Input
                                                value={this.state.name}
                                                onPressEnter={() => {
                                                    //  if (title !== project.title) updateProject('title')
                                                }}
                                                onChange={(e) => {
                                                    this.setState({
                                                        name: e.target.value
                                                    })
                                                }}
                                                type="text" />

                                        </Space>)
                                    },]
                                switch (this.state.selectedSetting) {
                                    case data[0].toLowerCase():
                                        return (
                                            <List
                                                bordered
                                                style={{
                                                    maxWidth: 600
                                                }}
                                                dataSource={settings}
                                                renderItem={item =>
                                                    <List.Item
                                                        extra={[item.reactNode]}
                                                    >
                                                        {item.title}
                                                    </List.Item>}
                                            />
                                        )
                                    default:
                                        return 'no tab selected'
                                }

                            })()
                        }
                    </div>
                    {/* <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>

                        <h1>
                            Go Ahead, Change Some Stuff
                        </h1>
                        <p style={{ maxWidth: 700 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>


                    </div> */}
                </div>
            </div>
        )

    }
}

export default Settings;