import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Popup from './../../../components/Popup';
import CreateBug from './../../../components/CreateBug';
import { Button, Divider, Modal, Tag } from 'antd';
import {
    List, Avatar, Skeleton,
    Menu, Dropdown, Switch as AntSwitch, Space, Drawer,
    Input, Pagination
} from 'antd';
import {
    CalendarOutlined,
    DownOutlined,
    FontSizeOutlined,
    FileSyncOutlined,
    ExclamationCircleOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';
import BugDissussion from './../../../components/BugDiscussion';
import BugStats from '../../../components/BugStats';
import BugAssignedTo from './../../../components/BugAssignedTo';
import ViewBug from './ViewBug';
import axios from 'axios';


const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;

const selectedColor = '#1890ff';

const menu = (props) => (
    <Menu

        onClick={props.handleChange}>
        <Menu.Item key="1"

            icon={<CalendarOutlined style={{
                color: props.selectedSort === '1' ? selectedColor : 'unset'
            }}
            />}
        >
            <span style={{
                color: props.selectedSort === '1' ? selectedColor : 'unset'
            }}>
                Upload Date
            </span>
        </Menu.Item>
        <Menu.Item key="2" icon={<FontSizeOutlined style={{
            color: props.selectedSort === '2' ? selectedColor : 'unset'
        }} />}>
            <span style={{
                color: props.selectedSort === '2' ? selectedColor : 'unset'
            }}>
                Title
            </span>

        </Menu.Item>
        <Menu.Item key="3" icon={<FileSyncOutlined style={{
            color: props.selectedSort === '3' ? selectedColor : 'unset'
        }} />}>
            <span style={{
                color: props.selectedSort === '3' ? selectedColor : 'unset'
            }}>
                Last Modified
            </span>

        </Menu.Item>
    </Menu>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCreatePopup: false,
            toggleViewBugPopup: false,
            toggleDrawer: false,
            totalBugCount: 0,
            pageSize: 10,
            searchQuery: '',
            sortBy: '',
            page: 1,
            bugs: [],
            selectedSort: '0',
            checked: true,
            selectedBug: null,
            selectedBugTitle: ''
        };

    }

    componentDidMount() {
        this._handleListUpdate()
    }

    _handlePaginationChange = (page, pageSize) => {
        let updateList = false;
        if (this.state.page !== page || this.state.pageSize !== pageSize) updateList = true;

        this.setState({
            page,
            pageSize
        }, () => {
            if (updateList) {
                this._handleListUpdate()
            }
        })

    }

    _handleListUpdate = async (search,) => {
        const token = window.localStorage.getItem('token')
        let id = this.props.location.pathname.split('/');
        id = id[id.length - 1];
        let { pageSize, page } = this.state;

        if (search) {
            page = 1
        }

        let order;
        let sortBy;
        let { selectedSort, checked } = this.state;
        if (selectedSort === '1') {
            sortBy = 'upload-date'
        } else if (selectedSort === '2') {
            sortBy = 'title'
        } else if (selectedSort === '3') {
            sortBy = 'last-modified'
        }
        if (selectedSort !== '0') {
            if (checked) {
                order = 'ASC'
            } else {
                order = 'DESC'
            }
        }

        try {
            let { data } = await axios.get('http://localhost:1337/bug/all', {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    projectId: id,
                    limit: pageSize,
                    skip: pageSize * (page - 1),
                    search,
                    sortBy,
                    order
                }
            });
            //console.log(data)
            this.setState({
                bugs: data.bugs,
                totalBugCount: data.total,
                page
            })
        } catch (e) {
            console.log(e);
        }
    }

    createBugState = null;

    toggleFunc = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }

    _handleSortChange = (obj) => {
        //console.log(obj)
        if (obj.key === this.state.selectedSort) {
            this.setState({
                selectedSort: '0',
                page: 1
            }, this._handleListUpdate)
        } else {
            this.setState({
                selectedSort: obj.key,
                page: 1
            }, this._handleListUpdate)
        }
    }

    render() {

        var listData = [];

        for (let i = 0; i < 10; i++) {
            listData.push({ bugId: 'y938cbu9', title: 'Videos will not play', state: 'priority', loading: false })
        }
        return (
            <div>
                <Space style={{
                    marginBottom: 20
                }}>
                    <Button

                        type="primary" onClick={() => this.toggleFunc('toggleCreatePopup')}>Submit New</Button>
                    <Search placeholder="Search"
                        onChange={(e) => this._handleListUpdate(e.target.value)}
                        onSearch={(e) => this._handleListUpdate(e)} style={{ width: 200 }} />

                    <Dropdown overlay={menu({
                        selectedSort: this.state.selectedSort,
                        handleChange: this._handleSortChange
                    })}>
                        <Button>
                            Sort By <DownOutlined />
                        </Button>
                    </Dropdown>
                    {
                        this.state.selectedSort !== '0' ?
                            <AntSwitch
                                checkedChildren="ASC"
                                unCheckedChildren="DESC"
                                defaultChecked
                                onChange={(checked) => {

                                    this.setState({
                                        page: 1,
                                        checked
                                    }, this._handleListUpdate)

                                }}
                            />
                            : null
                    }

                </Space>

                <Modal
                    destroyOnClose
                    title="Submit New Bug"
                    visible={this.state.toggleCreatePopup}
                    // onOk={() => this.toggleFunc('toggleCreatePopup')}
                    width={900}
                    footer={null}
                    onCancel={() => this.toggleFunc('toggleCreatePopup')}>
                    <CreateBug
                        _handleListUpdate={this._handleListUpdate}
                        toggleFunc={() => this.toggleFunc('toggleCreatePopup')}
                    />
                </Modal>


                <div style={{
                    width: 1000
                }}>
                    <List
                        // className="demo-loadmore-list"
                        style={{
                            width: 1000
                        }}
                        // loading={initLoading}
                        itemLayout="horizontal"
                        // loadMore={loadMore}
                        dataSource={this.state.bugs}
                        renderItem={item => (
                            <List.Item
                                actions={[<a key="list-loadmore-edit" onClick={(e) => {
                                    this.setState({
                                        toggleDrawer: true,
                                        selectedBugTitle: item.title,
                                        selectedBug: item
                                    })
                                    e.preventDefault()
                                }

                                }>view</a>]}
                            >
                                <Skeleton avatar title={false}
                                    loading={false}
                                    active>
                                    <List.Item.Meta
                                        // avatar={
                                        //     <ExclamationCircleOutlined
                                        //         twoToneColor="red"
                                        //         style={{
                                        //             color: 'red',
                                        //             fontSize: 24,
                                        //             marginTop: 10
                                        //         }}
                                        //     />
                                        // }
                                        title={<div style={{
                                            display: 'inline'
                                        }}>
                                            <a href="#" onClick={(e) => {
                                                this.setState({
                                                    toggleDrawer: true,
                                                    selectedBugTitle: item.title,
                                                    selectedBug: item
                                                })
                                                e.preventDefault()
                                            }

                                            }>{item.title}</a>
                                            {/* <Tag color="#f50" style={{ marginLeft: 10 }}>PRIOIRTY</Tag> */}
                                        </div>}
                                        //description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                        //description={convertToPlain(item.description)}
                                        description={item.plainTextDescription}
                                    />
                                    <div>Last Modified at 12:30pm</div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                    <Pagination
                        style={{ float: 'right', marginTop: 20 }}
                        defaultCurrent={1} total={this.state.totalBugCount}
                        onChange={this._handlePaginationChange}
                    // pageSizeOptions={[5, 50, 100]}
                    />
                </div>
                <Drawer
                    width={800}
                    title={this.state.selectedBugTitle}
                    placement="right"
                    closable={true}
                    onClose={() => this.setState({ toggleDrawer: false })}
                    visible={this.state.toggleDrawer}
                    destroyOnClose
                >
                    <ViewBug bug={this.state.selectedBug} />
                </Drawer>


            </div>
        );
    }
}


export default withRouter(App);
