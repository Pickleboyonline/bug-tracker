import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Overview from './sub-pages/Overview';
import SkeletonProject from './sub-pages/SkeletonProject';
import { Avatar, Menu, Button, Space, Tooltip, Card, } from 'antd';
import { UserOutlined, MessageOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import anime from 'animejs/lib/anime.es.js';


import {

} from '@ant-design/icons';

const { SubMenu } = Menu;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            collapsed: false
        };

    }

    componentDidMount() {
        //alert('hey')
    }

    onMinimize = () => {

    }

    render() {
        // let match = useRouteMatch();
        return (
            <Space
                align='end'
                size='large'
                style={{
                    position: 'fixed',
                    left: 17.5,
                    bottom: 20,
                    zIndex: 100

                }}>
                <Tooltip
                    placement='right'
                    title="Messages">
                    <Button shape="circle" size='large' icon={<MessageOutlined />} />
                </Tooltip>
                <Card
                    headStyle={{
                        backgroundColor: '#2f2f2f',
                        color: 'white',

                    }}

                    title="Contacts"
                    extra={
                        <Space size='middle'>
                            <Button type='text' icon={<MinusOutlined style={{ color: 'white' }} />} />
                            <Button type='text' icon={<CloseOutlined style={{ color: 'white' }} />} />


                        </Space>}

                    style={{
                        width: 300,
                        //height: 64 
                    }}>


                </Card>
            </Space >
        );
    }
}


export default withRouter(App);
