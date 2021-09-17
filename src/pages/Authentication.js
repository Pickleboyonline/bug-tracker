import React, { useState } from 'react';
import {
    Redirect,
    // Link
} from "react-router-dom";
import { Card } from 'antd';
import { Typography } from 'antd';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { getErrorMessage } from '../libraries/network-error-handling';
import { useMediaQuery } from 'react-responsive'
import { reconfigToken } from '../libraries/socket';
import { baseUrl } from './config';

const { Title } = Typography;



const AuthenticationHooks = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isMobile = useMediaQuery({ maxWidth: 800 })
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
                res = await axios.post(baseUrl + '/user/login', {
                    email,
                    password
                })
            } else {
                res = await axios.post(baseUrl + '/user/signup',
                    {
                        name,
                        email,
                        password,
                    })
            }
        } catch (e) {
            let message = getErrorMessage(e)
            console.error("Error: " + message);
            notification.error({
                message: `Could not ${mode}: ` + getErrorMessage(e)
            })
        }


        setLoading(false)
        if (res) {
            // store token :)
            alert(res.data.message)
            notification.success({
                message: res.data.message
            })

            window.localStorage.setItem('token', res.data.token);
            reconfigToken()
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
        <div className="App" style={{
            //backgroundColor: 'cyan',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            paddingLeft: isMobile ? 10 : 64,
            paddingRight: isMobile ? 10 : 64,
            paddingTop: 64,
            // alignItems: 'center'
            //position: 'absolute',
            //top: 0,
            //left: 0,
            minHeight: '100vh',
            // width: '100%',
            backgroundImage: "url('https://images.unsplash.com/photo-1617653695386-1d78957d33f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            {isAuthed ? <Redirect to="/dashboard" /> : null}
            <div

                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    flex: isMobile ? 'unset' : 1
                }}>
                <h1 style={{

                    color: 'white',

                    fontSize: 48,
                    margin: 0,

                }}>
                    Bugg
                </h1>
                <p style={{ color: 'white', marginBottom: 30, opacity: .7 }}>A simply bug tracker
                </p>
            </div>

            <div
                style={{
                    flex: isMobile ? 'unset' : 1,
                    display: isMobile ? 'flex' : 'unset',
                    flexDirection: isMobile ? 'row' : 'unset',
                    justifyContent: isMobile ? 'center' : 'unset'
                }}
            >
                <Card style={{
                    maxWidth: isMobile ? 450 : 'unset',
                    marginBottom: 30,
                    borderRadius: 5,
                    flex: 1
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
                                    // onChange={(e) => setConfirmPassword(e.target.value)}

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

        </div>
    )
}

export default AuthenticationHooks;

