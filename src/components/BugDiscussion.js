import React from 'react';
import {
    Comment,
    Space, Divider,
    Avatar, Form, Button, List, Input, Typography, message
} from 'antd';
import moment from 'moment';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor as DraftEditor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getErrorMessage } from '../libraries/network-error-handling';

const { TextArea } = Input;
const { Title } = Typography;


const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment  {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>

        </Form.Item>
    </>
);


class App extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
        editorState: EditorState.createEmpty(),
    };

    TOKEN = window.localStorage.getItem('token');

    componentDidMount() {
        this._handleUpdateComments()
    }

    _handleUpdateComments = async () => {
        try {
            let { data } = await axios.get('http://localhost:1337/comment', {
                headers: {
                    'x-auth-token': this.TOKEN
                },
                params: {
                    bugId: this.props.bug.id
                }
            });

            let comments = data.comments.map((item) => {

                return {
                    author: item.owner.name,
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: <div
                        style={{
                            width: 700,
                            minHeight: 50,
                            overflowX: 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: item.body }} />,
                    datetime: moment(new Date(item.createdAt)).fromNow(),

                }
            })
            // for (let i = 0; i < comments.length; i++) {
            //     this.state.comments.push(comments[i])
            // }
            // console.log(this.state.comments)

            this.setState({
                comments: [...this.state.comments, ...comments].reverse()
            })
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    handleSubmit = async () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        try {
            await axios.post('http://localhost:1337/comment/', {
                bugId: this.props.bug.id,
                body: this.state.value
            }, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            })
        } catch (e) {
            if (e.response) {
                console.log(e.response)
            } else {
                console.log(e)
            }
            message.error('Could not send message: ' + getErrorMessage(e))
            return this.setState({ submitting: false })
        }



        this.setState({
            submitting: false,
            value: '',
            comments: [

                {
                    author: 'Han Solo',
                    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                    content: <div
                        style={{
                            width: 700,
                            minHeight: 50,
                            overflowX: 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: this.state.value }} />,
                    datetime: moment().fromNow(),
                },
                ...this.state.comments,
            ],
        });

    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        const { comments, submitting, value } = this.state;

        return (
            <>
                <br />

                <Space align='center'>
                    <Title
                        style={{
                            margin: 0,
                            marginRight: 10
                        }}
                        level={5}>Discussion</Title>


                </Space>

                <Divider />
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        // <Editor
                        //     onChange={this.handleChange}
                        //     onSubmit={this.handleSubmit}
                        //     submitting={submitting}
                        //     value={value}
                        // />
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
                                        value: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                                        editorState
                                    })
                                }}
                            />
                            <Button htmlType="submit" loading={submitting} onClick={this.handleSubmit} type="primary">
                                Add Comment
                            </Button>
                        </React.Fragment>

                    }
                />
                {comments.length > 0 && <CommentList comments={comments} />}
            </>
        );
    }
}


export default App;
