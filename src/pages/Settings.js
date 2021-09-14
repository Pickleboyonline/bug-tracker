import React from 'react'
import {
    Input, Button
    , Modal, Divider, Space, //Timeline,
    List,
    Avatar,
    notification,
    message
} from 'antd'
import bugg, { getMe } from '../libraries/bugg';
import { getErrorMessage, logErrorMessage } from '../libraries/network-error-handling';
import { reconfigToken } from '../libraries/socket';

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
        email: '',
        loading: false,
        password: '',
        newPassword: '',
        updatePasswordVisible: false,
        loadingUpdatePassword: false
    }
    componentDidMount() {
        this.fetchUser()

    }


    fetchUser = async () => {
        try {
            let user = await getMe();
            this.setState({
                user,
                name: user.name,
                email: user.email
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }

    /**
     * Udates user name and email
     */
    updateUser = async (field, value) => {
        this.setState({ loading: true })
        try {
            let user = await bugg.User.updateUser(field, value)

            this.setState({
                user,
                name: user.name,
                email: user.email
            });
            this.props.getWelcomeMessage()
            message.success("user updated")
        } catch (e) {
            this.setState({
                [field]: this.state.user[field]
            })
            message.error('Error: ' + getErrorMessage(e))
        }
        this.setState({ loading: false })
    }

    updatePassword = async () => {
        const { password, newPassword } = this.state;

        if (!(password && newPassword)) {
            message.error('Please input current and new password')
            return;
        }
        this.setState({
            loadingUpdatePassword: true
        })
        try {
            let token = await bugg.User.updatePassword(password, newPassword);
            message.success('Password updated');
            this.setState({
                updatePasswordVisible: false
            })
            window.localStorage.setItem('token', token);
            reconfigToken();
            this.fetchUser()

        } catch (e) {
            message.error(getErrorMessage(e))
        }
        this.setState({
            loadingUpdatePassword: false
        })
    }

    render() {
        const settings = [
            {
                title: 'Name',
                reactNode: (<Space  >

                    <Input
                        value={this.state.name}
                        onPressEnter={() => {
                            if (this.state.name !== this.state.user.name) this.updateUser('name', this.state.name)
                        }}
                        onChange={(e) => {
                            this.setState({
                                name: e.target.value
                            })
                        }}
                        type="text" />
                    <Button
                        loading={this.state.loading}
                        onClick={() => this.updateUser('name', this.state.name)}
                        type='primary'
                        disabled={(this.state.name === this.state.user.name)}

                    >
                        Update
                    </Button>

                </Space>)
            }, {
                title: 'Email',
                reactNode: (<Space  >

                    <Input
                        value={this.state.email}
                        onPressEnter={() => {
                            if (this.state.email !== this.state.user.email) this.updateUser('email', this.state.email)
                        }}
                        onChange={(e) => {
                            this.setState({
                                email: e.target.value
                            })
                        }}
                        type="text" />
                    <Button
                        loading={this.state.loading}
                        onClick={() => this.updateUser('email', this.state.email)}
                        type='primary'
                        disabled={(this.state.email === this.state.user.email)}

                    >
                        Update
                    </Button>

                </Space>)
            }, {
                title: 'Password',
                reactNode: (
                    <Button

                        onClick={() => this.setState({ updatePasswordVisible: true })}
                        type='primary'


                    >
                        Update
                    </Button>
                )
            }]
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
                    <div> <List
                        // header={<div>Header</div>}
                        // footer={<div>Footer</div>}
                        bordered
                        dataSource={data}
                        style={{
                            width: 300
                        }}
                        renderItem={(item, ind) => (
                            <List.Item
                                key={ind}
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
                    /></div>

                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>
                        {
                            (() => {

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
                                                        key={item.title}
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
                    <Modal
                        okButtonProps={{
                            loading: this.state.loadingUpdatePassword
                        }}
                        destroyOnClose
                        visible={this.state.updatePasswordVisible}
                        title="Update Password"
                        onOk={this.updatePassword}
                        onCancel={() => this.setState({ updatePasswordVisible: false })}
                    >
                        <p style={{ marginBottom: 10 }}>Current Password: </p>
                        <Input
                            type='password'
                            autoComplete='new-password'
                            name='new-password'
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            placeholder='Type here...'
                        />

                        <p style={{ marginBottom: 10, marginTop: 20 }}>New Password: </p>
                        <Input
                            type='password'
                            autoComplete='new-password'
                            value={this.state.newPassword}
                            onChange={(e) => this.setState({ newPassword: e.target.value })}
                            placeholder='Type here...'
                        />
                    </Modal>
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