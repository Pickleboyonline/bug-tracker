import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Popup from './../../../components/Popup';
import CreateBug from './../../../components/CreateBug';
import { Button, Divider, Modal, Tag } from 'antd';
import {
    List, Avatar, Skeleton,
    Menu, Dropdown, message, Space, Drawer,
    Input,
} from 'antd';
import {
    WarningOutlined,
    DownOutlined,
    UserOutlined,
    AudioOutlined,
    ExclamationCircleOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div
                onClick={this.props.onClick}
                style={{
                    backgroundColor: 'grey',
                    height: 50,
                    marginTop: 10,
                    width: '80%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingLeft: 10
                }}>
                {this.props.title}
            </div>
        )
    }
}
function handleButtonClick(e) {
    message.info('Click on left button.');
    console.log('click left button', e);
}

function handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
}

const menu = (
    <Menu onClick={handleMenuClick}>
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
            toggleCreatePopup: false,
            toggleViewBugPopup: false,
            toggleDrawer: true
        };

    }

    componentDidMount() {

    }

    toggleFunc = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
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
                    <Search placeholder="search"

                        onSearch={() => alert('hey')} style={{ width: 200 }} />

                    <Dropdown overlay={menu}>
                        <Button>
                            Sort By <DownOutlined />
                        </Button>
                    </Dropdown>
                    <Button

                        type="primary" onClick={() => this.toggleFunc('toggleCreatePopup')}>Submit New</Button>
                </Space>


                {/* 
                {
                    this.state.toggleCreatePopup ?
                        <Popup
                            title="Submit New Bug"
                            toggleFunc={() => this.toggleFunc('toggleCreatePopup')}>
                            <CreateBug />
                        </Popup> : null
                } */}

                <Modal
                    title="Submit New Bug"
                    visible={this.state.toggleCreatePopup}
                    onOk={() => this.toggleFunc('toggleCreatePopup')}
                    width={900}
                    onCancel={() => this.toggleFunc('toggleCreatePopup')}>
                    <CreateBug />
                </Modal>


                <div>
                    <List
                        // className="demo-loadmore-list"
                        style={{
                            width: 1000
                        }}
                        // loading={initLoading}
                        itemLayout="horizontal"
                        // loadMore={loadMore}
                        dataSource={listData}
                        renderItem={item => (
                            <List.Item
                                actions={[<a key="list-loadmore-edit" onClick={
                                    () => this.setState({
                                        toggleDrawer: true
                                    })
                                }>select</a>, <a key="list-loadmore-more">more</a>]}
                            >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        avatar={
                                            // <WarningOutlined
                                            //     twoToneColor="red"
                                            //     style={{
                                            //         color: 'red',
                                            //         fontSize: 24,
                                            //         marginTop: 10
                                            //     }}
                                            // />
                                            <ExclamationCircleOutlined
                                                twoToneColor="red"
                                                style={{
                                                    color: 'red',
                                                    fontSize: 24,
                                                    marginTop: 10
                                                }}
                                            />
                                        }
                                        title={<div style={{
                                            display: 'inline'
                                        }}>
                                            <a href="#">{item.title}</a>
                                            <Tag color="#f50" style={{ marginLeft: 10 }}>PRIOIRTY</Tag>
                                        </div>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    />
                                    <div>Last Modified at 12:30pm</div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />

                </div>

                <Drawer
                    width={800}
                    title="Videos will not play"
                    placement="right"
                    closable={true}
                    onClose={() => this.setState({ toggleDrawer: false })}
                    visible={this.state.toggleDrawer}
                >
                    <Space align='center'>
                        <Title
                            style={{
                                margin: 0,
                                marginRight: 10
                            }}
                            level={5}>Description</Title>
                        <Button shape="circle"
                            icon={<EditOutlined />}
                        />

                    </Space>

                    <Divider />
                    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus non enim praesent elementum facilisis leo vel fringilla. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa. Morbi tincidunt ornare massa eget egestas purus viverra accumsan. Elementum nisi quis eleifend quam. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Amet luctus venenatis lectus magna fringilla urna porttitor. </Paragraph>
                    <br />
                    <Space align='center'>
                        <Title
                            style={{
                                margin: 0,
                                marginRight: 10
                            }}
                            level={5}>Discussion</Title>
                        <Button shape="circle"
                            icon={<EditOutlined />}
                        />

                    </Space>

                    <Divider />

                </Drawer>
            </div>
        );
    }
}


export default App;
