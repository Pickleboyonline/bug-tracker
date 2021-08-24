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
import { EditorState, convertToRaw } from 'draft-js';
import { Editor as DraftEditor } from 'react-draft-wysiwyg';
import './../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;




class BugDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editDescription: false,
            editorState: EditorState.createEmpty()
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
                        level={5}>Description</Title>
                    <Button shape="circle"
                        onClick={() => this.toggleFunc('editDescription')}
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
                                        //value: draftToHtml(convertToRaw(editorState.getCurrentContent())),
                                        editorState
                                    })
                                }}
                            />
                            <Button
                                style={{
                                    marginBottom: 30
                                }}
                                onClick={() => this.setState({ editDescription: false })}
                                htmlType="submit" type="primary">
                                Update
                            </Button>
                        </React.Fragment> :
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus non enim praesent elementum facilisis leo vel fringilla. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa. Morbi tincidunt ornare massa eget egestas purus viverra accumsan. Elementum nisi quis eleifend quam. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Amet luctus venenatis lectus magna fringilla urna porttitor. </Paragraph>

                }
                <br />


            </div>
        );
    }
}


export default BugDescription;
