import React from 'react';
import {
    Button,
    Space,
    Menu,
    Dropdown,
    Divider,
    Empty,
    Avatar,
    List,
    Tag,
    Input,
    Modal,
    message,
    Spin
} from 'antd';
import { WarningOutlined, DownOutlined, UserOutlined, AudioOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CreateAnnouncement from '../../../components/CreateAnnouncement';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
const { Search } = Input;

function Message(props) {
    return (<><div style={{
        display: 'inline-flex',
        alignItems: 'center'
    }}>
        <Avatar size={64}
            style={{
                marginRight: 20
            }}
            icon={<UserOutlined />} />
        <span>
            <p style={{
                margin: 0,
                fontSize: 18
            }}>
                <b>{props.announcement.submitter.name}</b>
            </p>
            <p style={{
                margin: 0
            }}>
                Director
            </p>
        </span>
        <span>
            <Button type="text" style={{
                color: '#1890ff',
                marginLeft: 20
            }}>Reply</Button>
        </span>
    </div>
        <Divider />
        <h1>
            {props.announcement.title}
        </h1>
        <p
            dangerouslySetInnerHTML={{ __html: props.announcement.body }}
            style={{ maxWidth: 700 }}>

        </p></>
    )
}

const menu = (
    <Menu onClick={() => alert('sup')}>
        <Menu.Item key="1" icon={<UserOutlined />}>
            Date
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
            Name
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
            Priority
        </Menu.Item>
    </Menu>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            createAnnouncement: false,
            selectedAnnouncement: null,
            announcements: [],
            total: 0,
            loading: false,
            search: '',
            sortBy: '',
            hasMore: true,
            firstLoad: true
        };

    }

    // Fetch initial annoncements and data
    async componentDidMount() {
        // await (new Promise((res) => this.setState({ loading: true }, res)))
        // await this.fetchAndSetAnnouncements();
        // this.setState({ loading: false })
    }

    // fetch announcemnents, set data, and total that match the query
    // will append new announcemnts
    // DOES NOT CHANGE LOADING STATE
    // Will query for 20 at a time
    fetchAndSetAnnouncements = async (resetList) => {
        // await (new Promise((res) => setTimeout(res, 2000)))
        const { announcements, search, sortBy } = this.state
        let skip = announcements.length;
        if (resetList) {
            skip = 0;
            // await (new Promise((res) => this.setState({ hasMore: true }, res)))
        }
        const limit = 5;
        const TOKEN = window.localStorage.getItem('token')
        try {
            let { data } = await axios.get('http://localhost:1337/announcement/', {
                headers: {
                    'x-auth-token': TOKEN
                },
                params: {
                    projectId: this.props.project.id,
                    limit,
                    skip,
                    search,
                    sortBy
                }
            });
            console.log(data);
            let newAnnouncements;

            if (resetList) {
                newAnnouncements = data.announcements
            } else {
                newAnnouncements = [...announcements, ...data.announcements]
            }
            this.setState({
                total: data.total,
                announcements: newAnnouncements,
                hasMore: true
            })
        } catch (e) {
            console.log(e);
            console.log(e.repsonse);
            console.log(this.props.project.id)
        }
    }

    _handleOnSearch = async (search) => {
        let resetList = false;
        if (search !== this.state.search) resetList = true;

        this.setState({
            search,
        }, () => this.fetchAndSetAnnouncements(resetList))
    }

    handleInfiniteLoad = async () => {
        // console.log('EXEC')
        let { announcements, total, firstLoad } = this.state;

        this.setState({ loading: true })
        console.log('State: ')
        console.log(this.state)
        if (announcements.length === total && firstLoad === false) {
            message.warning('All announcements are loaded')
            this.setState({
                hasMore: false,
                loading: false
            })
            return
        }
        console.log('EXEC')
        await this.fetchAndSetAnnouncements();
        this.setState({
            loading: false,
            firstLoad: false
        })
    }

    toggleState = (name) => this.setState({ [name]: !this.state[name] })

    render() {
        return (
            <div>

                <Modal
                    title="Create New Announcement"
                    visible={this.state.createAnnouncement}
                    destroyOnClose
                    footer={null}
                    width={800}
                    onCancel={() => this.toggleState('createAnnouncement')}
                    onOk={() => this.toggleState('createAnnouncement')}>
                    <CreateAnnouncement
                        project={this.props.project}
                        closeModal={() => this.toggleState('createAnnouncement')}
                    />
                </Modal>
                <Space style={{
                    marginBottom: 20
                }}>
                    <Button
                        onClick={() => this.toggleState('createAnnouncement')}
                        type='primary'>
                        New Announcement
                    </Button>
                    <Search placeholder="search"
                        onChange={(e) => this._handleOnSearch(e.target.value)}
                        onSearch={() => alert('hey')} style={{ width: 200 }} />
                    {/* <Button>
                        Mark All as Read
                    </Button> */}
                    {/* 
                    <Dropdown overlay={menu}>

                        <Button>
                            Sort By <DownOutlined />
                        </Button>
                    </Dropdown> */}
                </Space>
                <br />
                <style>{`
.bugg-list-item-button:hover {
    background-color: rgb(255 255 255 / 90%);
    cursor: pointer;
}
.bugg-list-item-button {
    background-color: white;
}
`}</style>
                <div style={{
                    display: 'inline-flex'

                }}>
                    <div
                        style={{
                            borderColor: 'rgba(0,0,0,.2)',
                            // backgroundColor: 'rgba(0,0,0,.1)',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderRadius: 5,
                            width: 350,
                            height: 600,
                            overflowY: 'auto',
                            overflowClipBox: 'content-box'
                        }}
                    >


                        <InfiniteScroll
                            initialLoad={true}

                            // threshold={10}
                            pageStart={0}
                            loadMore={this.handleInfiniteLoad}
                            hasMore={!this.state.loading && this.state.hasMore}
                            useWindow={false}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.announcements}
                                renderItem={(item) => (

                                    <List.Item
                                        className="bugg-list-item-button"
                                        onClick={() => {
                                            this.setState({
                                                selectedAnnouncement: item
                                            })
                                        }}
                                    >
                                        <List.Item.Meta

                                            avatar={<Avatar
                                                style={{
                                                    // marginLeft: 20,
                                                    marginTop: 9
                                                }}
                                            >A </Avatar>}
                                            title={<> <a
                                                onClick={e => e.preventDefault()}
                                                href="#">{item.submitter.name}</a> <Tag color='pink'>ADMIN</Tag> <span style={{ float: 'right', marginRight: 20, opacity: .8 }}>12:20pm</span></>}

                                            description={item.plainTextBody}
                                        />
                                    </List.Item>


                                )}
                            />
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </InfiniteScroll>
                    </div>
                    <style>{`
                    .demo-loading-container {
                        position: relative;
                        bottom: 0px;
                        background-color: white;
                        width: 100%;
                        text-align: center;
                      }
                    `}</style>
                    <div style={{
                        flex: 1,
                        marginLeft: 20,
                        width: 600,
                        minHeight: 600
                    }}>
                        {this.state.selectedAnnouncement === null ?
                            <Empty style={{
                                marginTop: 100
                            }}
                                description="Select an announcement to view"
                            /> :
                            <Message announcement={this.state.selectedAnnouncement} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}


export default App;
