import React from 'react';
import {
    Popconfirm, List,
    Input,
    Avatar, Button, Space, Modal, Select, message, Tag
} from 'antd';
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons'
import { getMe } from '../../../libraries/bugg';
import { getErrorMessage, logErrorMessage } from '../../../libraries/network-error-handling';
import { getDefaultHeader } from '../../config';

const { Search } = Input;
const { Option } = Select;

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleAddMember: false,
            page: 1,
            pageSize: 50,
            total: 0,
            search: '',
            members: [],
            membersToAdd: [],
            query: '',
            selectedMembersToAdd: [],
            confirmVisible: false,
            deleteButtonLoading: false
        };

    }
    TOKEN = window.localStorage.getItem('token')
    componentDidMount() {
        this.fetchMembers()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.project.id !== this.props.project.id) {
            this.fetchMembers()
        }
    }

    fetchMembers = async () => {
        var { page, pageSize, search } = this.state;

        try {
            const { data } = await axios.get('/project/users/' + this.props.project.id, {
                headers: getDefaultHeader(),
                params: {
                    skip: (page - 1) * pageSize,
                    limit: pageSize,
                    search
                }
            })

            this.setState({
                members: data.members,
                total: data.total
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }


    updateSearch = (search) => {
        this.setState({
            search: search,
            page: 1
        }, this.fetchMembers)
    }

    onChangePagination = (page, pageSize) => {
        this.setState({
            page, pageSize
        }, this.fetchMembers)
    }


    toggleAddMember = () => this.setState({ toggleAddMember: !this.state.toggleAddMember })
    updateMembersToAdd = (val) => this.setState({ selectedMembersToAdd: val })


    addMembers = async () => {
        const { selectedMembersToAdd } = this.state;

        try {
            await axios.post('/project/member', {
                userEmails: selectedMembersToAdd,
                projectId: this.props.project.id
            }, {
                headers: getDefaultHeader()
            });
            message.success("users invited!")
            this.toggleAddMember()
            this.fetchMembers()
        } catch (e) {
            logErrorMessage(e)
            message.error('Error: ' + getErrorMessage(e))
        }
    }

    // sets members users with that match search
    // inserts email that does not match in server
    searchMembers = async () => {
        const { query } = this.state;
        try {
            let results = await axios.get('/user/search', {
                params: {
                    query: query,
                    projectId: this.props.match.params.projectId,
                    isIn: false
                },
                headers: getDefaultHeader()
            })
            let members = results.data.results.map((item) => ({
                key: item.email,
                name: item.name,
                email: item.email,
                id: item.id,
                isInServer: true
            }));

            if (validateEmail(query)) {
                members = [{
                    isInServer: false,
                    email: query,
                    key: query
                }, ...members];
            }

            this.setState({
                membersToAdd: members
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }

    removeMember = async (userId) => {

        try {
            await axios.delete('/project/member', {
                headers: getDefaultHeader(),
                data: {
                    projectId: this.props.project.id,
                    userId
                }
            })
            this.fetchMembers()
            this.setState({
                confirmVisible: false,
                deleteButtonLoading: false
            })


            try {
                let user = await getMe();
                if (user.id === userId) {
                    this.props.updateProject()
                    this.props.history.push('/dashboard')
                }

            } catch (e) {
                logErrorMessage(e)
            }

        } catch (e) {
            logErrorMessage(e)
            message.error('Error: ' + getErrorMessage(e))
        }
    }

    render() {
        const { isMobile } = this.props;

        return (
            <div
                style={{

                    marginRight: isMobile ? 10 : 64
                }}
            >
                <div style={{
                    marginBottom: 20,
                    gap: 6,
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                    <Search
                        style={{ width: 200 }}
                        placeholder="search"
                        value={this.state.search}
                        onChange={(e) => this.updateSearch(e.target.value)}
                        onSearch={this.updateSearch} />
                    <Button
                        onClick={this.toggleAddMember}
                        type='primary'>
                        Add New Member
                    </Button>
                </div>

                <List

                    pagination={{
                        current: this.state.page,
                        total: this.state.total,
                        pageSize: this.state.pageSize,
                        onChange: this.onChangePagination
                    }}
                    bordered
                    dataSource={this.state.members}
                    style={{
                        maxWidth: 900
                    }}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                (!item.isOwner && <Popconfirm
                                    title="Are you sure?"
                                    // visible={this.state.confirmVisible}
                                    okButtonProps={{ loading: this.state.deleteButtonLoading }}
                                    onConfirm={() => this.removeMember(item.id)}
                                >
                                    <Button
                                        // onClick={() => this.setState({ confirmVisible: true })}

                                        {
                                        ...(isMobile ? {
                                            icon: <DeleteOutlined />
                                        } : {})
                                        }
                                        danger>{isMobile ? '' : 'Remove'}</Button>
                                </Popconfirm>)

                            ]}
                        >
                            <Avatar style={{ marginRight: 10 }}>{item.name.substring(0, 1)}</Avatar>
                            {`${item.name.split(' ')[0]} ${(item.name.split(' ')[1] ? item.name.split(' ')[1].substring(0, 1).toUpperCase() + '.' : '')} (${item.email})`}
                            {
                                item.isOwner && <Tag color='red' style={{ marginLeft: 10 }}>OWNER</Tag>
                            }

                        </List.Item>
                    )}
                />
                <Modal title="Add More Members..."
                    visible={this.state.toggleAddMember}
                    destroyOnClose
                    onOk={this.addMembers}
                    onCancel={this.toggleAddMember}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Start typing..."
                        onSearch={(e) => {
                            this.setState({
                                query: e
                            }, this.searchMembers)
                        }}
                        onChange={this.updateMembersToAdd}
                    >
                        {
                            this.state.membersToAdd.map(doc => {
                                if (doc.isInServer) {
                                    return <Option key={doc.key}>{`${doc.name} (${doc.email})`}</Option>
                                } else {
                                    return <Option key={doc.key}>{`Invite person with email '${doc.email}'`}</Option>
                                }
                            })
                        }

                    </Select>
                </Modal>

            </div>
        );
    }
}


export default withRouter(App);
