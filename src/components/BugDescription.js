import React from 'react';

import { Button, Divider, } from 'antd';
import {
    message, Space,

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
import { getDefaultHeader } from '../pages/config';
import { getErrorMessage } from '../libraries/network-error-handling';
import DOMPurify from 'dompurify';
const { Title, Paragraph, } = Typography;



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

    updateDescription = async (text) => {
        try {
            await axios.put('/bug/' + this.props.bug.id, {
                description: this.state.description
            }, {
                headers: getDefaultHeader(),
            });

            message.success("Description was updated!")
        } catch (e) {
            let message = getErrorMessage(e)
            console.error(message)
            message.error('Error: ' + message)
        }
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
                        level={5}>Description</Title>
                    <Button shape="circle"
                        onClick={() => {
                            if (this.state.editDescription) {
                                this.updateDescription()
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
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(this.state.description) }} />
                        </Paragraph>

                }
                <br />


            </div>
        );
    }
}


export default BugDescription;
