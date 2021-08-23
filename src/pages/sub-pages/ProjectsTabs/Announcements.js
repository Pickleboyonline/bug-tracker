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
    Avatar
} from 'antd';
import { WarningOutlined, DownOutlined, UserOutlined, AudioOutlined, ExclamationCircleOutlined } from '@ant-design/icons';



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
            isAuthed: false
        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>

                <Space style={{
                    marginBottom: 20
                }}>
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

                <div style={{
                    display: 'inline-flex'

                }}>
                    <div style={{
                        borderColor: 'rgba(0,0,0,.1)',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: 5,
                        width: 300,
                        height: 600
                    }}>
                        <div style={{
                            height: 100,
                            width: '100%',
                            // backgroundColor: 'red',
                            borderStyle: 'solid',
                            borderColor: 'rgba(0,0,0,.1)',
                            borderWidth: 0,
                            borderBottomWidth: 1,
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>


                            <Avatar size={'large'} style={{
                                marginLeft: 20,
                                marginRight: 10
                            }} icon={<UserOutlined />} />


                            <div style={{ flex: 1, marginRight: 20 }}>
                                <div style={{
                                    display: 'inline-flex',
                                    justifyContent: 'space-between',
                                    width: '100%',

                                }}>
                                    <p style={{
                                        margin: 0
                                    }}>
                                        <b>Imran Shitta-Bey</b>
                                    </p>
                                    <p style={{
                                        margin: 0
                                    }}>
                                        12:30pm
                                    </p>
                                </div>

                                <p style={{
                                    margin: 0
                                }}>
                                    Do your job!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>
                        <div style={{
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
                        </p>


                    </div>
                </div>
            </div>
        );
    }
}


export default App;
