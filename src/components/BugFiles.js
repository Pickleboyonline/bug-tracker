import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import { Button, Divider, Modal, Upload } from 'antd';
import {
    List, Avatar, Skeleton,
    Menu, Dropdown, message, Space, Drawer,
    Input,
} from 'antd';
import {
    EditOutlined, InboxOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';


const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;
const { Dragger } = Upload;

const props = {
    name: 'file',
    multiple: true,
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};


class BugDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editFiles: false,
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

        return (
            <div>

                <Space align='center'>
                    <Title
                        style={{
                            margin: 0,
                            marginRight: 10
                        }}
                        level={5}>Files</Title>
                    <Button
                        onClick={() => this.toggleFunc('editFiles')}
                        shape="circle"
                        icon={<EditOutlined />}
                    />

                </Space>

                <Divider />
                {
                    this.state.editFiles ?
                        <Dragger
                            style={{
                                marginBottom: 20
                            }}
                            {...props}>

                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                            </p>
                        </Dragger> :
                        <Paragraph>
                            files go brrrr...
                        </Paragraph>}
                <br />


            </div>
        );
    }
}


export default BugDescription;
