import { useEffect, useState } from 'react';
import { Input, Space, Button, Select, Form, Upload, notification } from 'antd';
import axios from 'axios';
import { getDefaultHeader } from '../pages/config';
import { getErrorMessage } from '../libraries/network-error-handling';

const { Option } = Select;
let formData = new FormData();


export function CreateProject(props) {


    const [value, setValue] = useState([]);
    // const [loading, setLoading] = useState(false);
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
            res = await axios.post('/project/create', {
                title: e.title,
                description: e.description,
                members: value.join()
            },
                {
                    headers: getDefaultHeader()
                });
            if (formData.get('icon')) {
                await axios.post('/icon/upload', formData, {
                    headers: {
                        ...(getDefaultHeader()),
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        projectId: res.data.id
                    }
                })
            }
            //  let imageResponse = 

        } catch (e) {
            console.error(getErrorMessage(e))
            notification.error({
                message: getErrorMessage(e)
            })
        }
        if (res) {
            console.log(res.data)
            // message.success('project was created')
            notification.success({
                message: 'project was created'
            })
            form.resetFields();
            props.updateProjects()
            setImageUri('')
            props.closeFunc()


        }

    }
    // const [name, setName] = useState('imran')
    const [members, setMembers] = useState([]);
    const [query, setQuery] = useState();

    useEffect(() => {
        const handleChange = async () => {
            let results;
            // setLoading(true);

            try {
                results = await axios.get('/user/search', {
                    params: {
                        query: query
                    },
                    headers: getDefaultHeader()
                })
            } catch (e) {
                console.error(getErrorMessage(e))
                // setLoading(false);
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
                            accept='image/*'
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




