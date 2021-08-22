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

    render() {
        const { editorState } = this.state;
        return (
            <div style={{
                width: 800,


            }}>
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
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>

        )
    }
}


export default App;
