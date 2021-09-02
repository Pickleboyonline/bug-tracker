import React, { useState } from 'react';
import {
    withRouter
} from "react-router-dom";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Form, Input, Button, Space, DatePicker, notification } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import draftToHtml from 'draftjs-to-html';

const { Dragger } = Upload;
const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
    console.log(`selected ${value}`);
}

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


const App = (props) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [files, setFiles] = useState(null);
    const [dueDate, setDueDate] = useState(0);
    const [assignTo, setAssignTo] = useState([]);
    const [severity, setSeverity] = useState('');
    const [reproducibility, setReproducibility] = useState('');
    const [catagory, setCatagory] = useState('');
    const [formData, setFormData] = useState(new FormData());
    const [fileRegister, setFileRegister] = useState([]);
    const token = window.localStorage.getItem('token')

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };

    const beforeUpload = async (file, fileList) => {
        // console.log("Before Upload: ")
        // console.log(file)
        // console.log(fileList)
        // for (let fileElem of fileList) {
        //     fileRegister.push(fileElem)
        // }
        fileRegister.push(file)

        // console.log("File Register: ");
        // console.log(fileRegister);
        return false
    };
    const onRemove = (file) => {
        // console.log('On remove: ')
        // console.log(file);

        for (let i = 0; i < fileRegister.length; i++) {
            if (fileRegister[i].uid === file.uid) {
                fileRegister.splice(i, 1);
                break;
            }
        }
        // console.log("File Register: ");
        // console.log(fileRegister);
    }

    async function onFinish(values) {

        // console.log('Success:', values);
        // console.log('Pure Values: ');
        // console.log({
        //     editorState,
        //     title,
        //     tags,
        //     files,
        //     dueDate,
        //     assignTo,
        //     severity,
        //     reproducibility,
        //     catagory
        // })
        let description = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        try {
            // console.log(props.location.pathname.split('/')[3])
            let requestData = {
                description,
                title,
                tags: tags.join(','),
                dueDate: (dueDate === 0 ? undefined : dueDate.toDate().getTime()),
                assignTo: assignTo.join(','),
                severity,
                reproducibility,
                catagory,
                projectId: props.location.pathname.split('/')[3]
            }
            // console.log(requestData)
            let res = await axios.post('http://localhost:1337/bug/create', requestData, {
                headers: {
                    'x-auth-token': token
                }
            })

            const { data } = res;
            console.log(data)
            // TODO: add file upload

            if (fileRegister.length !== 0) {

                for (let i = 0; i < fileRegister.length; i++) {
                    formData.append(`files`, fileRegister[i])
                }
                console.log(formData.getAll('files'))
                await axios.post('http://localhost:1337/file/', formData, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        bugId: data.id
                    }
                })
            }
            props.toggleFunc()
            props._handleListUpdate();
            notification.success({
                message: 'Bug was submitted!'
            })

        } catch (e) {
            let { message } = e;

            console.log(e)

            notification.error({
                message
            })
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        notification.error({
            message: 'Please input title'
        })
    };

    return (
        <div style={{
            width: '100%',


        }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 24,
                }}
                initialValues={{
                    remember: false,
                }}
                layout='vertical'
                // preserve={f}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input
                        type="text"
                        // value={'this.state.title'}

                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Item>

                <style>
                    {`
                    .demo-editor {
                        padding: 0px 10px 0px 10px;
                        border-color: rgba(0,0,0,.1);
                        border-style: solid;
                        border-width: 1px;
                        min-height: 150px
                    }
                    `}
                </style>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={onEditorStateChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Tags"
                    name="tags"
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Select

                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Tags Mode"
                        onChange={(e) => setTags(e)}
                    // onChange={handleChange}
                    >
                        {children}
                    </Select>,
                </Form.Item>

                <Dragger
                    style={{
                        marginBottom: 20
                    }}
                    //{...props}
                    multiple
                    beforeUpload={beforeUpload}
                    onRemove={onRemove}
                >

                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                    </p>
                </Dragger>
                <Form.Item
                    label="Due Date"
                    name="due-date"
                    style={{
                        marginTop: 20
                    }}
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <DatePicker
                        style={{
                            width: '100%'
                        }}
                        // onChange={() => alert('val')}
                        onChange={setDueDate}
                    />
                </Form.Item>
                <Form.Item
                    label="Assign To..."
                    name="assignees"
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        // defaultValue={['a10', 'c12']}
                        // onChange={handleChange}
                        onChange={setAssignTo}
                    >
                        <Option>
                            Imran S. (ias45@getmixtape.app)
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Severity"
                    name="severity"
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        //style={{ width: 200 }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        onChange={setSeverity}
                    >
                        <Option value="None">None</Option>
                        <Option value="Critical">Critical</Option>
                        <Option value="Major">Major</Option>
                        <Option value="Minor">Minor</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Reproducibility"
                    name="reproducibility"
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Select
                        onChange={setReproducibility}
                        showSearch
                        // style={{ width: 200 }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        <Option value="Always">Always</Option>
                        <Option value="Sometimes">Sometimes</Option>
                        <Option value="Rarely">Rarely</Option>
                        <Option value="Unable">Unable</Option>
                        <Option value="Never tried">Never tried</Option>
                        <Option value="N/A">N/A</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Catagory"
                    name="catagory"
                    rules={[
                        {
                            required: false,
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Select
                        showSearch
                        onChange={setCatagory}
                        //style={{ width: 200 }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        <Option value="Security">Security</Option>
                        <Option value="Data Loss">Data Loss</Option>
                        <Option value="Performance">Performance</Option>
                        <Option value="Crash/Hang">Crash/Hang</Option>
                        <Option value="Other Bug">Other Bug</Option>
                        <Option value="UI">UI</Option>
                        <Option value="New Feature">New Feature</Option>
                        <Option value="Enhancement">Enhancement</Option>
                    </Select>
                </Form.Item>
                <Space
                    style={{
                        width: '100%',
                        display: 'inline-flex',
                        justifyContent: 'flex-end'
                    }}

                >
                    <Button
                    // onClick={this._onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        htmlType='submit'

                        type='primary'>
                        Submit
                    </Button>
                </Space>

            </Form>

        </div>

    )

}


export default withRouter(App);
