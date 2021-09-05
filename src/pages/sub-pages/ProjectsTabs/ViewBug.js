import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Popup from '../../../components/Popup';
import CreateBug from '../../../components/CreateBug';
import { Button, Divider, Modal, Tag } from 'antd';
import {
    List, Avatar, Skeleton,
    Menu, Dropdown, message, Space, Drawer,
    Input,
} from 'antd';
import {
    EditOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';
import BugDissussion from '../../../components/BugDiscussion';
import BugStats from '../../../components/BugStats';
import BugAssignedTo from '../../../components/BugAssignedTo';
import BugDescription from '../../../components/BugDescription';
import BugFiles from './../../../components/BugFiles';

const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;




class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {
        console.log(this.props.bug)
    }



    render() {

        return (
            <div>

                <BugStats bugId={this.props.bug.id} bug={this.props.bug} />


                <BugDescription bug={this.props.bug} description={this.props.bug.description} />

                <BugFiles bug={this.props.bug} />

                <BugAssignedTo bug={this.props.bug} />

                <BugDissussion bug={this.props.bug} />

            </div>
        );
    }
}


export default App;
