import { useEffect, useState } from 'react';
import { Input, Space, Button, Select, Form, Upload, notification } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
const PubSub = require('./../PubSub');

const { Option } = Select;
let formData = new FormData();


export function CreateProject(props) {
    const token = window.localStorage.getItem('token')
    const [title, setTitle] = useState('');
    const [value, setValue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUri, setImageUri] = useState('');




    const beforeUpload = async (file) => {
        //console.log(file)
        if (formData.get('icon')) {
            formData.delete('icon')
        }
        formData.append('icon', file);

        let fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
            setImageUri(fileReader.result);
        }, false)

        fileReader.readAsDataURL(file);

        return false;
    }

    const handleSubmit = async (e) => {
        let res;
        console.log(value)

        try {
            res = await axios.post('http://localhost:1337/project/create', {
                title: e.title,
                description: e.description,
                members: value.join()
            },
                {
                    headers: {
                        'x-auth-token': token
                    }
                });
            if (formData.get('icon')) {
                await axios.post('http://localhost:1337/icon/upload', formData, {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        projectId: res.data.id
                    }
                })
            }
            //  let imageResponse = 

        } catch (e) {
            if (e.response) {
                console.log(e.response.data)
                //message.error()
                notification.error({
                    message: e.response.data.split('\n')[0]
                })
            } else {
                console.log(e)
                notification.error({
                    message: e.message
                })
            }
        }
        if (res) {
            console.log(res.data)
            // message.success('project was created')
            notification.success({
                message: 'project was created'
            })
            form.resetFields();
            props.closeFunc()
            PubSub.join('project').emit('update');
            setImageUri('')
        }

    }
    // const [name, setName] = useState('imran')
    const [members, setMembers] = useState([]);
    const [query, setQuery] = useState();

    useEffect(() => {
        const handleChange = async () => {
            let results;
            setLoading(true);

            try {
                results = await axios.get('http://localhost:1337/user/search', {
                    params: {
                        query: query
                    },
                    headers: {
                        'x-auth-token': token
                    }
                })
            } catch (e) {
                if (e.response) {
                    //console.log(e.response.data)
                    //message.error()
                } else {
                    console.log(e)
                }
                setLoading(false);
                return
            }

            //console.log(results.data)
            let newMembers = [];
            let users = results.data.results;
            for (let i = 0; i < users.length; i++) {
                newMembers.push({
                    key: users[i].id,
                    name: users[i].name,
                    email: users[i].email,
                    id: users[i].id
                })
            }

            setMembers(newMembers);
            //setLoading(false);
            // console.log('Updated: ')
            //console.log(newMembers);
        }

        handleChange()
    }, [query])


    const handleChange = (val, option) => {
        //console.log(value)
        setValue(val)
    }

    return (
        <div>

            <Space direction='vertical' style={{ width: '100%' }}>
                <Form
                    layout='vertical'
                    onFinish={handleSubmit}
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

                    <Form.Item
                        label="Description"
                        name="description"

                    >
                        <Input
                            type="text" />
                    </Form.Item>

                    <Form.Item
                        label="Icon"
                        name="icon"

                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"

                            showUploadList={false}
                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                        // onChange={this.handleChange}
                        >
                            {
                                imageUri === '' ?
                                    "Upload Icon" :
                                    <div style={{
                                        width: '80%',
                                        height: '80%',
                                        backgroundImage: 'url(' + imageUri + ')',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                    />

                            }

                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Members"
                        name="members"
                    >
                        <Select
                            showSearch
                            mode='multiple'
                            // value={this.state.value}
                            placeholder={"search..."}
                            // style={this.props.style}
                            // defaultActiveFirstOption={false}
                            // showArrow={false}
                            filterOption={false}
                            onSearch={setQuery}
                            onChange={handleChange}
                        // notFoundContent={""}
                        >
                            {/* <Option key={'1'}>{query}</Option> */}
                            {
                                members.map(doc => <Option key={doc.id}>{`${doc.name} (${doc.email})`}</Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Space style={{
                        width: '100%',
                        marginTop: 20,
                        display: 'inline-flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Button onClick={() => {
                            form.resetFields();
                            props.closeFunc()
                            setImageUri('')
                        }}>
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
    )
}




