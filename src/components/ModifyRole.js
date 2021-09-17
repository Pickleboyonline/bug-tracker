import { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Select, Space, Button, message } from "antd";
import axios
    from "axios";

import { CirclePicker } from 'react-color';
import { getErrorMessage } from "../libraries/network-error-handling";
import { getDefaultHeader } from "../pages/config";

import {
    withRouter
} from "react-router-dom";
const PERMISSIONS = {
    ALL: 'ALL',
    MODIFY_GENERAL: 'MODIFY_GENERAL',
    MODIFY_MEMBERS: 'MODIFY_MEMBERS',
    MODIFY_BUGS: 'MODIFY_BUGS',
    MODIFY_ANNOUNCEMENTS: 'MODIFY_ANNOUNCEMENTS'
}

// const PERMISSIONS_ARRAY = [
//     'ALL',
//     'MODIFY_GENERAL',
//     'MODIFY_MEMBERS',
//     'MODIFY_BUGS',
//     'MODIFY_ANNOUNCEMENTS'
// ]

const { Option } = Select;

const ModifyRole = (props) => {
    useEffect(() => {
        if (props.role) {
            setMembers(props.role.users)
            setSelectedMembers(props.role.users.map((item) => item.id))
            if (props.role.color) setColor(props.role.color)
        }
    }, [props.role]);

    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([])
    const [search, setSearch] = useState('');
    const { toggleUpdateRoleModal, fetchRoles } = props;
    const [color, setColor] = useState('#f44336')


    // TODO: only search for users apart of the project
    const handleUserSearch = async () => {
        try {
            let { data } = await axios.get('/user/search', {
                params: {
                    query: search,
                    projectId: props.match.params.projectId,
                    isIn: true
                },
                headers: getDefaultHeader()
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
            setMembers(newMembers)
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    const updateRole = async (data) => {
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
            await axios.put('/role', {
                roleId: props.role.id,
                title,
                color,
                permissions: permissions.join(','),
                users: selectedMembers.join(',')
            }, {
                headers: getDefaultHeader()
            })
            toggleUpdateRoleModal();
            fetchRoles();
            message.success("Role updated")
        } catch (e) {
            console.error(getErrorMessage(e))
            message.error(getErrorMessage(e))
        }
    }

    const getInitialValue = (field) => {
        if (field === 'title') return props.role.title


        if (props.role.permissions === 'ALL') {

            return true
        };

        const permissions = props.role.permissions.split(',');

        return permissions.includes(field)
    }
    console.log(props.role)


    return (
        <div>
            <Modal title="Update Role"
                visible={props.visible}
                // onOk={updateRole}
                footer={null}
                destroyOnClose
                onCancel={toggleUpdateRoleModal}
            >
                {
                    props.role !== null ?
                        <Form
                            layout='vertical'
                            onFinish={updateRole}

                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                initialValue={getInitialValue('title')}
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
                                initialValue={selectedMembers}
                            >
                                <Select
                                    showSearch
                                    mode='multiple'
                                    // value={selectedMembers}
                                    placeholder={"search..."}
                                    // style={this.props.style}
                                    // defaultActiveFirstOption={false}
                                    // showArrow={false}
                                    filterOption={false}
                                    onSearch={(value) => {
                                        setSearch(value);
                                        handleUserSearch();
                                    }}
                                    onChange={setSelectedMembers}
                                // notFoundContent={""}
                                >
                                    {/* <Option key={'1'}>{query}</Option> */}
                                    {
                                        members.map(doc => <Option key={doc.id}>{`${doc.name} (${doc.email})`}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Color"
                                name="color"
                            >
                                <CirclePicker
                                    color={color}
                                    onChangeComplete={(value) => setColor(value.hex)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Can modify bugs"
                                name={PERMISSIONS.MODIFY_BUGS}
                                initialValue={getInitialValue(PERMISSIONS.MODIFY_BUGS)}
                                valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                label="Can modify announcements" name={PERMISSIONS.MODIFY_ANNOUNCEMENTS}
                                valuePropName="checked"
                                initialValue={getInitialValue(PERMISSIONS.MODIFY_ANNOUNCEMENTS)}
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                label="Can modify project" name={PERMISSIONS.MODIFY_GENERAL}
                                valuePropName="checked"
                                initialValue={getInitialValue(PERMISSIONS.MODIFY_GENERAL)}
                            >
                                <Switch />
                            </Form.Item>
                            <Form.Item
                                label="Can modify members"
                                valuePropName="checked"
                                name={PERMISSIONS.MODIFY_MEMBERS}
                                initialValue={getInitialValue(PERMISSIONS.MODIFY_MEMBERS)}
                            >
                                <Switch />
                            </Form.Item>
                            <Space style={{
                                width: '100%',
                                marginTop: 20,
                                display: 'inline-flex',
                                justifyContent: 'flex-end'
                            }}>
                                <Button onClick={toggleUpdateRoleModal}>
                                    Cancel
                                </Button>
                                <Button
                                    htmlType='submit'
                                    type='primary'>
                                    Update
                                </Button>
                            </Space>
                        </Form> : null}
            </Modal>
        </div>
    );
}

export default withRouter(ModifyRole);