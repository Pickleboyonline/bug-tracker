import React from 'react';
import {
    Comment,
    Space, Divider,
    Avatar, Button, List, Typography, message
} from 'antd';
import moment from 'moment';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor as DraftEditor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import axios from 'axios';
import { getErrorMessage } from '../libraries/network-error-handling';
import { getDefaultHeader } from '../pages/config';

const { Title } = Typography;


const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment  {...props} />}
    />
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
                headers: getDefaultHeader(),
                params: {
                    bugId: this.props.bug.id
                }
            });

            let comments = data.comments.map((item) => ({
                author: item.owner.name,
                key: item.id,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                content: <div
                    style={{
                        width: 700,
                        minHeight: 50,
                        overflowX: 'auto'
                    }}
                    dangerouslySetInnerHTML={{ __html: item.body }} />,
                datetime: moment(new Date(item.createdAt)).fromNow(),

            })
            )
            this.setState({
                comments: [...this.state.comments, ...comments].reverse()
            })
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    handleSubmit = async () => {
        if (!this.state.value) return

        this.setState({ submitting: true });

        try {
            await axios.post('http://localhost:1337/comment/', {
                bugId: this.props.bug.id,
                body: this.state.value
            }, {
                headers: getDefaultHeader(),
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
        const { comments, submitting } = this.state;

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
