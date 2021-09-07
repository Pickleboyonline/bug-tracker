import react, { useState, useEffect } from "react";
import {
    Input, Form,
    Button,
    Select, Upload,
    Space,
    message
} from 'antd';
import axios from "axios";

export default function General(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState(null);
    const [form] = Form.useForm()
    const [imageUri, setImageUri] = useState('');
    const [project, setProject] = useState({});
    const TOKEN = window.localStorage.getItem('token')
    // upload image and set imageUri
    const beforeUpload = async (file) => {
        let formData = new FormData();
        formData.append('icon', file);
        try {
            let { data } = await axios.post('http://localhost:1337/icon/upload', formData, {
                headers: {
                    'x-auth-token': TOKEN,
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    projectId: project.id
                }
            });
            console.log(data)
            let newImageUri = 'http://localhost:1337/icon/' + data.uploadedFiles[0].id;
            setImageUri(newImageUri)
            message.success('Icon was updated')
        } catch (e) {
            console.log(e)
            console.log(e.response)
            message.error('Could not upload image')
        }


        return false;
    }

    const updateProject = async (field) => {
        let value;
        if (field === 'title') {
            value = title;
        } else if (field === 'description') {
            value = description;
        }

        try {
            let { data } = await axios.put('http://localhost:1337/project/' + project.id, {
                [field]: value
            }, {
                headers: {
                    'x-auth-token': TOKEN
                }
            })

            let newProject = data.project;
            setProject(newProject)

            message.success(`${field} was updated to "${value}"`)
        } catch (e) {
            console.log(e)
            console.log(e.resonse)
            message.error("Could not update project details")
        }
    }

    useEffect(() => {
        setProject(props.project);
        setTitle(props.project.title);
        setDescription(props.project.description)
        try {
            setImageUri('http://localhost:1337/icon/' + props.project.icon[0].id)
        } catch (e) {

        }

        const retreiveProject = async () => {
            try {
                let { data } = await axios.get('http://localhost:1337/project/find', {
                    headers: {
                        'x-auth-token': TOKEN
                    },
                    params: {
                        projectId: props.project.id
                    }
                });

                if (data.project) {
                    console.log(data.project)
                    setProject(data.project)
                    setImageUri('http://localhost:1337/icon/' + data.project.icon[0].id)
                    setTitle(data.project.title);
                    setDescription(data.project.description)
                }
            } catch (e) {
                console.log(e)
            }
        }

        retreiveProject()
    }, [])


    return (<div>


        <p>Title</p>
        <Space style={{ marginBottom: 20 }} >
            <Input
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
                type="text" />
            {
                title !== project.title ?
                    <Button
                        onClick={() => updateProject('title')}
                        type='primary'>
                        Update
                    </Button> : null}
        </Space>

        <br />
        <p>Description</p>
        <Space style={{ marginBottom: 20 }}>
            <Input
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value)
                }}
                type="text" />
            {
                description !== project.description ?
                    <Button
                        onClick={() => updateProject('description')}
                        type='primary'>
                        Update
                    </Button> : null}
        </Space>
        <br />

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

        <br />




    </div >
    )
}