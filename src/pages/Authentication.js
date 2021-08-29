import React, { Component, useState } from 'react';
import {
    Redirect,
    // Link
} from "react-router-dom";
import { Card } from 'antd';
import { Typography } from 'antd';
import { Form, Input, Button } from 'antd';
import axios from 'axios';

const { Title } = Typography;



const AuthenticationHooks = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [form] = Form.useForm();


    const handleSubmit = async () => {
        setLoading(true)
        var res;
        console.log(password)
        // attempt to get token
        try {
            if (mode === 'login') {
                console.log(password)
                res = await axios.post('http://localhost:1337/user/login', {
                    email,
                    password
                })
            } else {
                res = await axios.post('http://localhost:1337/user/signup',
                    {
                        name,
                        email,
                        password,
                    })
            }
        } catch (e) {
            console.log("Error: " + e.message);
            if (e.response) {
                console.log(e.response.data)
                alert(e.response.data.split('\n')[0])
            }
        }


        setLoading(false)
        if (res) {
            // store token :)
            alert(res.data.message)
            window.localStorage.setItem('token', res.data.token);

            setIsAuthed(true)
        }

    }
    const onFinishedFailed = () => false;
    const toggleMode = () => {
        if (mode === 'login') {
            setMode('signup')
        } else {
            setMode('login')
        }
    }

    return (
        <div className="App" style={styles.App}>
            {isAuthed ? <Redirect to="/dashboard" /> : null}

            <h1 style={styles.h1}>
                Bugg
            </h1>

            <Card style={styles.Card}>

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
                    form={form}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishedFailed}
                >
                    <Typography>
                        {
                            mode === 'login' ?
                                <Title>Login</Title> : <Title>Signup</Title>
                        }

                    </Typography>
                    <h4 style={{
                        marginBottom: 30
                    }}>
                        {mode === 'login' ?
                            <>
                                Don't have an account? <a href='#' onClick={toggleMode}>Sign up</a>
                            </> :
                            <>
                                Already have an account? <a href='#' onClick={toggleMode}>Login</a>
                            </>
                        }

                    </h4>
                    {
                        mode === 'signup' ?
                            <>
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
                                    <Input
                                        type="text" onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Item>

                            </>
                            :
                            null
                    }
                    <Form.Item name='email' label="Email" rules={[{
                        required: true,
                        type: 'email'
                    }]}>
                        <Input

                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}

                        />
                    </Form.Item>

                    {
                        mode === 'signup' ?
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
                                    onChange={(e) => setConfirmPassword(e.target.value)}

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
                        <Button
                            loading={loading}
                            type="primary" htmlType="submit">
                            SUBMIT
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default AuthenticationHooks;

const styles = {
    App: {
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
    },
    h1: {
        marginTop: 100,
        paddingTop: 0,
        color: 'black',
        marginLeft: 100,
        fontSize: 48
    },
    Card: {
        width: 450,
        float: 'right',
        borderRadius: 5,
        position: 'absolute',
        top: 110,
        right: 100
    },
}