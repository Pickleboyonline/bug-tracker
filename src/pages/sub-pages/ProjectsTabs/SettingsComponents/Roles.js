import react from "react";
import {
    Button,
    Divider,
    Modal,
    Space,
    Empty,
    message,
    Select,
    Form,
    Input,
    Switch,
    Menu,
    List,
    Popconfirm, Tag
} from 'antd';
import axios from "axios";
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import ModifyRole from './../../../../components/ModifyRole'
import { CirclePicker } from 'react-color'

const { SubMenu } = Menu;

const PERMISSIONS = {
    ALL: 'ALL',
    MODIFY_GENERAL: 'MODIFY_GENERAL',
    MODIFY_MEMBERS: 'MODIFY_MEMBERS',
    MODIFY_BUGS: 'MODIFY_BUGS',
    MODIFY_ANNOUNCEMENTS: 'MODIFY_ANNOUNCEMENTS'
}

const PERMISSIONS_ARRAY = [
    'ALL',
    'MODIFY_GENERAL',
    'MODIFY_MEMBERS',
    'MODIFY_BUGS',
    'MODIFY_ANNOUNCEMENTS'
]
const { Option } = Select;

export default class Roles extends react.Component {
    state = {
        roles: [],
        selectedRole: null,
        isModalVisible: false,
        members: [],
        selectedMembers: [],
        search: '',
        current: 'display',
        updateRoleModalVisible: false,
        color: '#f44336'
    }
    TOKEN = window.localStorage.getItem('token')

    componentDidMount() {
        this.fetchRoles()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.project.id !== this.props.project.id) {
            this.fetchRoles()
        }
    }

    // TODO: only search for users apart of the project
    _handleUserSearch = async () => {
        const { search } = this.state;
        try {
            let { data } = await axios.get('http://localhost:1337/user/search', {
                params: {
                    query: search
                },
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
            //console.log(results.data)
            let newMembers = [];
            let users = data.results;
            for (let i = 0; i < users.length; i++) {
                newMembers.push({
                    key: users[i].id,
                    name: users[i].name,
                    email: users[i].email,
                    id: users[i].id
                })
            }
            this.setState({
                members: newMembers
            })
        } catch (e) {
            if (e.response) {
                console.log(e.response.data)
                //message.error()
            } else {
                console.log(e)
            }

            return
        }
    }

    _handleSelectUser = (val) => {
        this.setState({
            selectedMembers: val
        })
    }

    createRole = async (data) => {
        console.log(data)

        let title = data.title;
        let permissions = [];

        // default checked is undefined, so normalize to true
        let getValue = (value) => {
            if (value || value === undefined) {
                return true
            } else {
                return false
            }
        }

        // construct permission array
        let modAnnouncements = getValue(data[PERMISSIONS.MODIFY_ANNOUNCEMENTS])
        let modBugs = getValue(data[PERMISSIONS.MODIFY_BUGS])
        let modGen = getValue(data[PERMISSIONS.MODIFY_GENERAL])
        let modMembers = getValue(data[PERMISSIONS.MODIFY_MEMBERS])

        if (modAnnouncements && modBugs
            && modGen && modMembers) {
            permissions.push(PERMISSIONS.ALL)
        } else {
            if (modAnnouncements) permissions.push(PERMISSIONS.MODIFY_ANNOUNCEMENTS);
            if (modBugs) permissions.push(PERMISSIONS.MODIFY_BUGS);
            if (modGen) permissions.push(PERMISSIONS.MODIFY_GENERAL);
            if (modMembers) permissions.push(PERMISSIONS.MODIFY_MEMBERS);
        }

        try {
            let { data: { role } } = await axios.post('http://localhost:1337/role', {
                projectId: this.props.project.id,
                title,
                permissions: permissions.join(','),
                color: this.state.color,
                users: this.state.selectedMembers.join(',')
            }, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
            this.setState({
                roles: [...this.state.roles, role],
                isModalVisible: false
            })
            message.success("Role created")
        } catch (e) {
            console.log(e)
            console.log(e.response)
            message.error("Role could not be created: " + e.message)
        }
    }


    fetchRoles = async () => {
        try {
            let { data: { roles } } = await axios.get('http://localhost:1337/role/all/' + this.props.project.id, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
            console.log("Roles on fetch: ")
            console.log(roles)
            this.setState({
                roles
            })
        } catch (e) {
            console.log(e)
            console.log(e.repsponse)
        }
    }

    toggleUpdateRoleModal = () => {
        this.setState({
            updateRoleModalVisible: !this.state.updateRoleModalVisible
        })
    }
    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
    };

    deleteRole = async (roleId) => {
        try {
            await axios.delete('http://localhost:1337/role/' + roleId, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            });
            this.fetchRoles()
            message.success('role was deleted')
        } catch (e) {
            console.log(e)
            console.log(e.repsonse)
            message.error("Role could not be deleted: " + e.message)
        }
    }

    render() {
        const { current } = this.state;
        return (<><div
            style={{
                display: 'inline-flex'
            }}
        >
            <div style={{
                width: 500
            }}>
                <div style={{
                    display: 'inline-flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    marginBottom: 20
                }}>
                    <h3 style={{ margin: 0 }}>
                        All Roles
                    </h3>
                    <Button
                        onClick={() => this.setState({ isModalVisible: true })}
                        type='primary'>
                        Create New
                    </Button>
                </div>

                <List
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={this.state.roles}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            extra={
                                <Space>
                                    <Button

                                        onClick={(e) => {
                                            this.setState({
                                                selectedRole: item,
                                                updateRoleModalVisible: true
                                            })
                                            e.preventDefault()
                                        }}>
                                        Edit
                                    </Button>
                                    <Popconfirm
                                        title="Are you sure?"
                                        onConfirm={() => this.deleteRole(item.id)}
                                    >

                                        <Button
                                            danger
                                        >
                                            Delete
                                        </Button>
                                    </Popconfirm>
                                </Space>

                            }
                        >
                            <Tag color={item.color}>{item.title} </Tag>

                        </List.Item>
                    )}
                />


            </div>


        </div>
            <Modal title="Create Role"
                visible={this.state.isModalVisible}
                onOk={this.createRole}
                footer={null}
                destroyOnClose
                onCancel={() => this.setState({ isModalVisible: false })}
            >
                <Form
                    layout='vertical'
                    onFinish={this.createRole}

                >
                    <Form.Item
                        label="Title"
                        name="title"
                        // initialValue="hey"
                        rules={[
                            {
                                required: true,
                                message: 'Please add a title',
                            },
                        ]}
                    >
                        <Input

                            type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Members"
                        name="members"
                    >
                        <Select
                            showSearch
                            mode='multiple'
                            placeholder={"search..."}
                            filterOption={false}
                            onSearch={(value) => this.setState({ search: value }, this._handleUserSearch)}
                            onChange={this._handleSelectUser}
                        // notFoundContent={""}
                        >
                            {
                                this.state.members.map(doc => <Option key={doc.id}>{`${doc.name} (${doc.email})`}</Option>)
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Color"
                        name="color"
                    >
                        <CirclePicker
                            color={this.state.color}
                            onChangeComplete={this.handleChangeComplete}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Can modify bugs"
                        name={PERMISSIONS.MODIFY_BUGS}

                        valuePropName="checked">
                        <Switch

                            defaultChecked={true} />
                    </Form.Item>
                    <Form.Item
                        label="Can modify announcements" name={PERMISSIONS.MODIFY_ANNOUNCEMENTS}
                        valuePropName="checked"
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item
                        label="Can modify project" name={PERMISSIONS.MODIFY_GENERAL}
                        valuePropName="checked"
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item
                        label="Can modify members"
                        valuePropName="checked"
                        name={PERMISSIONS.MODIFY_MEMBERS}>
                        <Switch defaultChecked />
                    </Form.Item>
                    <Space style={{
                        width: '100%',
                        marginTop: 20,
                        display: 'inline-flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Button onClick={() => {
                            this.setState({
                                isModalVisible: false
                            })
                        }}>
                            Cancel
                        </Button>
                        <Button
                            htmlType='submit'
                            type='primary'>
                            Create
                        </Button>
                    </Space>
                </Form>
            </Modal>

            <ModifyRole
                visible={this.state.updateRoleModalVisible}
                toggleUpdateRoleModal={this.toggleUpdateRoleModal}
                role={this.state.selectedRole}
                fetchRoles={this.fetchRoles}
            />
        </>
        )
    }

}

const CreateRole = (props) => {


    return <></>
}