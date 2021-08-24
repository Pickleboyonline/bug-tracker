import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
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
    Modal
} from 'antd';
import { WarningOutlined, DownOutlined, UserOutlined, AudioOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

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
                <b>Imran Shitta-Bey</b>
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
            Bruh moment
        </h1>
        <p style={{ maxWidth: 700 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
            selectedAnnouncement: null
        };

    }

    componentDidMount() {

    }

    toggleState = (name) => this.setState({ [name]: !this.state[name] })

    render() {
        return (
            <div>

                <Modal
                    title="Create New Announcement"
                    visible={this.state.createAnnouncement} onCancel={() => this.toggleState('createAnnouncement')} onOk={() => this.toggleState('createAnnouncement')}>

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

                        onSearch={() => alert('hey')} style={{ width: 200 }} />
                    <Button>
                        Mark All as Read
                    </Button>

                    <Dropdown overlay={menu}>

                        <Button>
                            Sort By <DownOutlined />
                        </Button>
                    </Dropdown>
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
                    <div style={{
                        borderColor: 'rgba(0,0,0,.2)',
                        backgroundColor: 'rgba(0,0,0,.1)',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: 350,
                        height: 600,
                        overflowY: 'auto',
                        overflowClipBox: 'content-box'

                    }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={[{
                                title: 'Imran Shitta-Bey',
                                ind: 1
                            },
                            {
                                title: 'Barack Obama'
                            }]}
                            renderItem={(item) => (

                                <List.Item
                                    className="bugg-list-item-button"
                                    onClick={() => {
                                        this.setState({
                                            selectedAnnouncement: {}
                                        })
                                    }}
                                >
                                    <List.Item.Meta

                                        avatar={<Avatar
                                            style={{
                                                marginLeft: 20,
                                                marginTop: 9
                                            }}
                                        >A </Avatar>}
                                        title={<> <a href="https://ant.design">{item.title}</a> <Tag color='pink'>ADMIN</Tag> <span style={{ float: 'right', marginRight: 20, opacity: .8 }}>12:20pm</span></>}

                                        description="Ant Design, a design language..."
                                    />
                                </List.Item>


                            )}
                        />

                    </div>
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
                            <Message />
                        }
                    </div>
                </div>
            </div>
        );
    }
}


export default App;
