import React from 'react'
import {
    Input, Button
    , Modal, Divider, Space, //Timeline,
    List,
    Avatar,
    Upload,


} from 'antd';
import { message } from 'antd';
import MediaQuery from 'react-responsive';
import bugg, { getMe } from '../libraries/bugg';
import { reconfigToken } from '../libraries/socket';
import { getErrorMessage, logErrorMessage } from '../libraries/network-error-handling';

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
        loadingUpdatePassword: false,
        previewImageUri: ''
    }
    componentDidMount() {
        this.fetchUser()
    }



    beforeUpload = async (file) => {

        let formData = new FormData();

        formData.append('icon', file);


        try {
            await bugg.User.uploadUserIcon(formData);
            this.fetchUser()
            this.props.getWelcomeMessage()
            message.success('Icon updated')
        } catch (e) {

            logErrorMessage(e)
            message.error(getErrorMessage(e))
        }

        return false;
    }

    updateIcon = async () => {
        try {
            let iconUri = await bugg.User.getUserIconUri();
            this.setState({
                previewImageUri: iconUri
            })
        } catch (e) {

        }
    }

    fetchUser = async () => {
        try {
            let user = await getMe();
            this.updateIcon()

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
            },
            {
                title: 'User Icon',
                reactNode: (
                    <div>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            accept='image/*'
                            showUploadList={false}

                            beforeUpload={this.beforeUpload}
                        // beforeUpload={() => { message.error('das'); return false; }}
                        >
                            {
                                !this.state.previewImageUri ?
                                    "Upload Icon" :
                                    <div style={{
                                        width: '80%',
                                        height: '80%',
                                        backgroundImage: 'url(' + this.state.previewImageUri + ')',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                    />

                            }

                        </Upload>
                    </div>

                )
            },
        ]
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <div
                        style={{
                            marginRight: isMobile ? 10 : 64
                        }}
                    >
                        <style>{`
.bugg-list-item-button:hover {
    background-color: rgb(0 0 0 / 5%);
    cursor: pointer;
}
.bugg-list-item-button {
    background-color: white;
}
`}</style>


                        <h1>
                            Settings
                        </h1>
                        <Divider

                        />



                        <div style={{
                            display: isMobile ? 'flex' : 'inline-flex',
                            width: '100%',
                            flexDirection: isMobile ? 'column' : 'unset'
                        }}>

                            <div>

                                <List
                                    // header={<div>Header</div>}
                                    // footer={<div>Footer</div>}
                                    bordered
                                    dataSource={data}
                                    style={{
                                        width: isMobile ? 'unset' : 200,
                                        marginBottom: isMobile ? 20 : 'unset'
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
                                marginLeft: isMobile ? 0 : 20
                            }}>
                                {
                                    (() => {

                                        switch (this.state.selectedSetting) {
                                            case data[0].toLowerCase():
                                                return (
                                                    <List
                                                        bordered
                                                        style={{
                                                            // maxWidth: 600
                                                        }}
                                                        itemLayout="vertical"
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

                        </div>
                    </div>
                }
            </MediaQuery>
        )

    }
}

export default Settings;