import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    // Link
} from "react-router-dom";
import { Card } from 'antd';
import { Typography, Divider } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export default class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            mode: 'login',
            isAuthed: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // Updates value of text field in state
    // e is event and target is name of mutible property
    handleChange(e, target) {
        this.setState({ [target]: e.target.value });
    }

    // TODO
    // Add server side functionality
    handleSubmit(e) {
        let success = false;

        alert('server stuff stilol needs implimentation :3');
        success = true;
        // send data to server
        // check if server verify and recieve token

        if (success) {
            // store token :)

            window.localStorage.setItem('token', 'bruh');

            this.setState({
                isAuthed: true
            })
        }
        e.preventDefault();
    }
    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    toggleMode = () => { let prevMode = this.state.mode; this.setState({ mode: (prevMode === 'login') ? 'signup' : 'login' }); }

    render() {
        return (
            <div className="App" style={{
                backgroundColor: 'cyan',
                margin: 0,
                padding: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                backgroundImage: "url('https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                {this.state.isAuthed ? <Redirect to="/dashboard" /> : null}


                <h1 style={{
                    marginTop: 100,
                    paddingTop: 0,
                    color: 'black',
                    marginLeft: 100,
                    fontSize: 48
                }}>
                    Bugg
                </h1>

                <Card style={{
                    width: 450,
                    float: 'right',
                    borderRadius: 5,
                    position: 'absolute',
                    top: 110,
                    right: 100
                }}>

                    <Form
                        name="basic"
                        labelAlign="left"
                        labelCol={{
                            //span: 8,
                            span: 8,
                        }}
                        wrapperCol={{
                            //span: 16,
                            span: 16
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.handleSubmit}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Typography>
                            {this.state.mode === 'login' ? <Title>Login</Title> : <Title>Signup</Title>}

                        </Typography>

                        <h4 style={{
                            marginBottom: 30
                        }}>
                            {this.state.mode === 'login' ?
                                <React.Fragment>
                                    Don't have an account? <a href='#' onClick={this.toggleMode}>Sign up</a>
                                </React.Fragment> :
                                <React.Fragment>
                                    Already have an account? <a href='#' onClick={this.toggleMode}>Login</a>
                                </React.Fragment>
                            }

                        </h4>





                        {
                            this.state.mode === 'signup' ?
                                <React.Fragment>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        style={{

                                        }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your name!',
                                            },
                                        ]}
                                    >
                                        <Input value={this.state.name} type="text" onChange={(e) => this.handleChange(e, 'name')} />
                                    </Form.Item>

                                </React.Fragment>
                                :
                                null
                        }

                        <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
                            <Input
                                value={this.state.email}
                                onChange={(e) => this.handleChange(e, 'email')}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password
                                onChange={(e) => this.handleChange(e, 'password')}
                                value={this.state.password}
                            />
                        </Form.Item>



                        {
                            this.state.mode === 'signup' ?
                                <Form.Item
                                    label="Confirm Passord"
                                    name="confirm-password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        onChange={(e) => this.handleChange(e, 'confirmPassword')}
                                        value={this.state.confirmPassword}
                                    />
                                </Form.Item>

                                :
                                null
                        }
                        <Form.Item
                            wrapperCol={{
                                offset: 0,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                SUBMIT
                            </Button>
                        </Form.Item>

                    </Form>

                </Card>
            </div >
        );
    }
}