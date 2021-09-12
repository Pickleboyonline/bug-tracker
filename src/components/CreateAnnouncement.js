import react, { useState } from 'react';
import { Form, Button, Input, Space, message } from 'antd'
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import axios from 'axios';

function CreateAnnouncement(props) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    // const [title, setTitle] = useState('');
    const [form] = Form.useForm();

    const onFormSubmit = async (vals) => {
        const TOKEN = window.localStorage.getItem('token')
        let title = vals.title;
        let body = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        try {
            await axios.post('http://localhost:1337/announcement', {
                projectId: props.project.id,
                title,
                body
            }, {
                headers: {
                    'x-auth-token': TOKEN
                }
            })
            message.success('Announcement was created')
            props.closeModal()
            props.updateList()
            // TODO, refresh list on create
        } catch (e) {
            console.log(e)
            console.log(e.response)
            message.error('Could not create announcement')
        }

    }

    return (<div>

        <Space direction='vertical' style={{ width: '100%' }}>
            <Form
                layout='vertical'
                onFinish={onFormSubmit}
                form={form}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please add a title',
                        },
                    ]}
                >
                    <Input
                        type="text" />
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
                    label="Body"
                    name="body"

                >
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={setEditorState}
                    />
                </Form.Item>


                <Space style={{
                    width: '100%',
                    marginTop: 20,
                    display: 'inline-flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button onClick={props.closeModal}>
                        Cancel
                    </Button>
                    <Button
                        htmlType='submit'
                        type='primary'>
                        Create
                    </Button>
                </Space>
            </Form>





        </Space>

    </div>

    );
}


export default CreateAnnouncement;