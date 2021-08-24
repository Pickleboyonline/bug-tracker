import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Form, Input, Button, Radio, DatePicker } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';



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


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
        };
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };


    componentDidMount() {

    }
    onFinish = (values) => {
        console.log('Success:', values);
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        const { editorState } = this.state;
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
                        remember: true,
                    }}
                    layout='vertical'
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
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
                        <Input />
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
                            onEditorStateChange={this.onEditorStateChange}
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
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" onChange={handleChange}>
                            {children}
                        </Select>,
                    </Form.Item>

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
                            onChange={() => alert('val')} />
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
                            onChange={handleChange}
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
                        >
                            <Option value="1">None</Option>
                            <Option value="2">Critical</Option>
                            <Option value="3">Major</Option>
                            <Option value="4">Minor</Option>
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
                            <Option value="1">Always</Option>
                            <Option value="2">Sometimes</Option>
                            <Option value="3">Rarely</Option>
                            <Option value="4">Unable</Option>
                            <Option value="5">Never tried</Option>
                            <Option value="6">N/A</Option>
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
                            <Option value="1">Security</Option>
                            <Option value="2">Data Loss</Option>
                            <Option value="3">Performance</Option>
                            <Option value="4">Crash/Hang</Option>
                            <Option value="5">Other Bug</Option>
                            <Option value="6">UI</Option>
                            <Option value="7">New Feature</Option>
                            <Option value="8">Enhancement</Option>
                        </Select>
                    </Form.Item>
                </Form>

            </div>

        )
    }
}


export default App;
