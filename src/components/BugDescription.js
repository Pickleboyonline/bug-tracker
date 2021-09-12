import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
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
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor as DraftEditor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import axios from 'axios';

const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;




class BugDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editDescription: false,
            editorState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(this.props.bug.description))),
            description: ''
        };

    }

    componentDidMount() {
        this.setState({
            description: this.props.bug.description
        })
        console.log(this.props.bug.description)
    }

    toggleFunc = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }

    _handleUpdateDescription = async (text) => {
        const token = await window.localStorage.getItem('token')
        try {
            await axios.put('http://localhost:1337/bug/' + this.props.bug.id, {
                description: this.state.description
            }, {
                headers: {
                    'x-auth-token': token
                }
            });

            message.success("Description was updated!")
        } catch (e) {
            console.log(e)
            message.error('Error: ' + e.message)
        }
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
                        level={5}>Description</Title>
                    <Button shape="circle"
                        onClick={() => {
                            if (this.state.editDescription) {
                                this._handleUpdateDescription()
                            }
                            this.toggleFunc('editDescription')
                        }}
                        icon={<EditOutlined />}
                    />

                </Space>

                <Divider />
                {
                    this.state.editDescription ?
                        <React.Fragment>
                            <style>
                                {`
            .demo-editor {
                padding: 0px 10px 0px 10px;
                border-color: rgba(0,0,0,.1);
                border-style: solid;
                border-width: 1px;
                min-height: 120px;
                margin-bottom: 20px;
            }
            `}
                            </style>
                            <DraftEditor
                                editorState={this.state.editorState}
                                wrapperClassName="demo-wrapper"
                                editorClassName="demo-editor"
                                onEditorStateChange={(editorState) => {
                                    this.setState({
                                        description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                                        editorState
                                    })
                                }}
                            />
                            {/* <Button
                                style={{
                                    marginBottom: 30
                                }}
                                onClick={() => this.setState({ editDescription: false })}
                                htmlType="submit" type="primary">
                                Update
                            </Button> */}
                        </React.Fragment> :
                        <Paragraph >
                            <div
                                // style={{ textAlign: 'center' }}
                                dangerouslySetInnerHTML={{ __html: this.state.description }} />
                        </Paragraph>

                }
                <br />


            </div>
        );
    }
}


export default BugDescription;
