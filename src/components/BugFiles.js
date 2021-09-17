import React from 'react';

import { Button, Divider, Upload } from 'antd';
import {

    List, message, Space,

} from 'antd';
import {
    EditOutlined, InboxOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';
import axios from 'axios';
import { getErrorMessage } from '../libraries/network-error-handling';
import { getDefaultHeader } from '../pages/config';

const { Title } = Typography;
const { Dragger } = Upload;

class BugDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editFiles: false,
            files: [],
            filesToRender: []
        };

    }

    componentDidMount() {
        // console.log(this.props.bug.files)
        let tempFiles = this.props.bug.files.map((item) => {
            let tempFile = new File([], item.name)
            tempFile.uid = '' + (new Date()).getTime() + '-' + tempFile.name;
            tempFile.serverId = item.id;
            tempFile.isUploaded = true;
            return tempFile;
        })
        this.setState({
            files: tempFiles
        })
    }

    toggleFunc = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }
    token = window.localStorage.getItem('token');

    beforeUpload = async (file) => {

        let formData = new FormData()
        formData.append('files', file);
        // handle uploading
        try {
            let { data } = await axios.post('/file/', formData, {
                headers: {
                    ...(getDefaultHeader()),
                    // 'x-auth-token': this.token,
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    bugId: this.props.bug.id
                },
                // onUploadProgress: (progress) => console.log(progress)
            })
            file.isUploaded = true;
            // console.log(data)
            let fileId = data.uploadedFiles[0].id;
            file.serverId = fileId;
            message.success(`"${file.name}" was uploaded!"`)
            this.setState({
                files: [...this.state.files, file]
            })
        } catch (e) {
            message.error("Error: " + getErrorMessage(e))
        }


        return false;
    }

    _onFileDelete = async (file) => {
        let { files } = this.state;
        // console.log("HEY")
        for (let i = 0; i < files.length; i++) {
            if (files[i].uid === file.uid) {
                try {

                    await axios.delete('/file/' + file.serverId, {
                        headers: getDefaultHeader(),
                    })

                    message.success(`"${file.name}" was deleted!`)
                    files.splice(i, 1);
                    this.setState({
                        files
                    })

                } catch (e) {
                    message.error("Error: " + getErrorMessage(e))
                }
                break;
            }
        }
        // if file was uploaded to server, remove on server
    }

    _onFileUpload = () => {

    }

    render() {

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
                            multiple
                            beforeUpload={this.beforeUpload}
                            onRemove={this._onFileDelete}
                            fileList={this.state.files}
                        >

                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                            </p>
                        </Dragger> :
                        <List
                            bordered
                            size='small'
                            dataSource={this.state.files}
                            renderItem={item => <List.Item key={item.serverId}>
                                <a href={"/file/" + item.serverId}>{item.name}</a>
                            </List.Item>}
                        />

                }
                <br />


            </div>
        );
    }
}


export default BugDescription;
