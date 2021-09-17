import React from 'react';
// import moment from 'moment';
import {
    Space,
    Input, Avatar, Select,
    Button, Divider, Typography, List, Pagination, Modal, message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { getErrorMessage } from '../libraries/network-error-handling';
import { getDefaultHeader } from '../pages/config';
import {
    withRouter,

} from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;


class BugStats extends React.Component {
    state = {
        editAssigned: false,
        assignees: [],
        search: '',
        page: 1,
        pageSize: 10,
        total: 0,
        query: '',
        members: [],
        selectedMembers: []
    };


    componentDidMount() {
        this._handleUpdateAssignees()
    }

    TOKEN = window.localStorage.getItem('token');

    // updates and retrives ALL assignees. _handlePagination takes care of all pagination of array
    _handleUpdateAssignees = async () => {
        let { search } = this.state;

        if (search === '') search = undefined;
        // console.log(search)
        try {
            let { data } = await axios.get('/bug/assignee', {
                headers: getDefaultHeader(),
                params: {
                    bugId: this.props.bug.id,
                    search
                }
            });

            // console.log(data)
            this.setState({
                assignees: data.users,
                total: data.total
            })
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    _handlePagination = (page, pageSize) => {
        if (page === 0) page = 1;

        this.setState({
            page,
            pageSize
        })
    }

    // TODO: only search for users apart of the project
    _handleUserSearch = async () => {
        let results;
        const { query } = this.state;
        try {
            results = await axios.get('/user/search', {
                params: {
                    query: query,
                    projectId: this.props.match.params.projectId,
                    isIn: true
                },
                headers: getDefaultHeader(),
            })
        } catch (e) {
            console.error(getErrorMessage(e))

            return
        }

        //console.log(results.data)
        let newMembers = [];
        let users = results.data.results;
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
    }

    _handleSelectUser = (val) => {
        this.setState({
            selectedMembers: val
        })
    }

    _handleAddMembers = async () => {
        const { selectedMembers } = this.state;
        try {
            await axios.post('/bug/assignee', {
                assignees: selectedMembers.join(','),
                bugId: this.props.bug.id
            }, {
                headers: getDefaultHeader(),
            })
            this.setState({ editAssigned: false })
            message.success('Members added')
        } catch (e) {
            console.error(getErrorMessage(e))
            message.error("Error: " + getErrorMessage(e))
        }
    }

    render() {
        const { page, pageSize, members } = this.state;
        // console.log("Page: " + page)
        // console.log('PageSize: ' + pageSize)

        return (
            <div>
                <Space align='center'>
                    <Title
                        style={{
                            margin: 0,
                            marginRight: 10
                        }}
                        level={5}>Assigned To</Title>

                </Space>

                <Divider />
                <List
                    size="small"
                    header={<Space>

                        <Input.Search
                            onChange={(e) => {
                                this.setState({
                                    search: e.target.value
                                }, this._handleUpdateAssignees);
                            }}
                            placeholder="search" style={{ width: 200 }} />
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => this.setState({ editAssigned: true })} type='primary'>

                        </Button>
                    </Space>}
                    footer={<div
                        style={{
                            width: '100%',
                            display: 'inline-flex',
                            justifyContent: 'flex-end'
                        }}
                    >

                        <Pagination
                            size="small"
                            total={this.state.total}
                            current={this.state.page}
                            onChange={this._handlePagination} showSizeChanger showQuickJumper />

                    </div>}
                    bordered
                    dataSource={this.state.assignees}
                    renderItem={(item, ind) => {
                        //console.log(ind)
                        if (ind >= (page - 1) * pageSize && ind < (page - 1) * pageSize + pageSize) {
                            return (
                                <List.Item key={item.id ?? ind}>
                                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginRight: 15 }}>
                                        {item.name.substring(0, 1)}
                                    </Avatar>
                                    {`${item.name.split(' ')[0]} ${(item.name.split(' ')[1] ? item.name.split(' ')[1].substring(0, 1).toUpperCase() + '.' : '')} (${item.email})`}
                                </List.Item>
                            )
                        }

                        return null
                    }
                    }
                />

                <Modal title="Add More Members..."
                    visible={this.state.editAssigned}
                    onOk={() => {
                        this._handleAddMembers()
                        this._handleUpdateAssignees()
                    }} onCancel={() => this.setState({ editAssigned: false })}>
                    <Select
                        showSearch
                        mode='multiple'
                        // value={this.state.value}
                        placeholder={"search..."}
                        style={{ width: '100%' }}
                        // defaultActiveFirstOption={false}
                        // showArrow={false}
                        filterOption={false}
                        onSearch={(e) => {
                            this.setState({
                                query: e
                            }, this._handleUserSearch)
                        }}
                        onChange={this._handleSelectUser}
                    // notFoundContent={""}
                    >
                        {/* <Option key={'1'}>{query}</Option> */}
                        {
                            members.map(doc => <Option key={doc.id}>{`${doc.name} (${doc.email})`}</Option>)
                        }
                    </Select>
                </Modal>
            </div>


        );
    }
}


export default withRouter(BugStats);
