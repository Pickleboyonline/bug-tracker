import React, { useState, useEffect } from 'react';
import {
    withRouter
} from "react-router-dom";
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Form, Input, Button, Space, DatePicker, notification } from 'antd';

import { Select } from 'antd';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import draftToHtml from 'draftjs-to-html';
import { getDefaultHeader } from './../pages/config';
import { getErrorMessage } from '../libraries/network-error-handling';

const { Dragger } = Upload;
const { Option } = Select;





const App = (props) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [value, setValue] = useState([]);

    const [dueDate, setDueDate] = useState(0);
    const [assignTo] = useState([]);
    const [severity, setSeverity] = useState('');
    const [reproducibility, setReproducibility] = useState('');
    const [catagory, setCatagory] = useState('');
    const [formData] = useState(new FormData());
    const [fileRegister] = useState([]);


    const beforeUpload = async (file, fileList) => {
        fileRegister.push(file)
        return false
    };
    const onRemove = (file) => {
        for (let i = 0; i < fileRegister.length; i++) {
            if (fileRegister[i].uid === file.uid) {
                fileRegister.splice(i, 1);
                break;
            }
        }
    }

    async function onFinish(values) {
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
                assignees: value.join(','),
                projectId: props.match.params.projectId
            }
            // console.log(requestData)
            let res = await axios.post('/bug/create', requestData, {
                headers: getDefaultHeader()
            })

            const { data } = res;

            // TODO: add file upload

            if (fileRegister.length !== 0) {

                for (let i = 0; i < fileRegister.length; i++) {
                    formData.append(`files`, fileRegister[i])
                }
                console.log(formData.getAll('files'))
                await axios.post('/file/', formData, {
                    headers: {
                        ...(getDefaultHeader()),
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
            console.error(getErrorMessage(e))
            notification.error({
                message: getErrorMessage(e)
            })
        }

    };

    const handleChange = (val, option) => {
        //console.log(value)
        setValue(val)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        notification.error({
            message: 'Please input title'
        })
    };

    // const [name, setName] = useState('imran')
    const [members, setMembers] = useState([]);
    const [query, setQuery] = useState();

    useEffect(() => {
        const handleChange = async () => {
            let results;
            //setLoading(true);

            try {
                results = await axios.get('/user/search', {
                    params: {
                        query: query,
                        projectId: props.match.params.projectId,
                        isIn: true
                    },
                    headers: getDefaultHeader()
                })
            } catch (e) {
                console.error(getErrorMessage(e))
                // setLoading(false);
                return
            }

            //console.log(results.data)
            let newMembers = [];
            let users = results.data.results;
            for (let i = 0; i < users.length; i++) {
                newMembers.push({
                    key: users[i].id,
                    name: users[i].name,
                    email: users[i].email,
                    id: users[i].id
                })
            }

            setMembers(newMembers);
            //setLoading(false);
            // console.log('Updated: ')
            //console.log(newMembers);
        }

        handleChange()
    }, [query]);

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
                            remember: false
                            // message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input
                        type="text"
                        // value={'this.state.title'}
                        autoComplete='off'
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
                        onEditorStateChange={setEditorState}
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
                        showSearch
                        mode='multiple'
                        // value={this.state.value}
                        placeholder={"search..."}
                        // style={this.props.style}
                        // defaultActiveFirstOption={false}
                        // showArrow={false}
                        filterOption={false}
                        onSearch={setQuery}
                        onChange={handleChange}
                    // notFoundContent={""}
                    >
                        {/* <Option key={'1'}>{query}</Option> */}
                        {
                            members.map(doc => <Option key={doc.id}>{`${doc.name} (${doc.email})`}</Option>)
                        }
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
                        onClick={props.toggleFunc}
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
