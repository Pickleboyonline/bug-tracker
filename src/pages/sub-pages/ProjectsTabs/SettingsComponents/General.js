import react, { useState, useEffect } from "react";
import {
    Input, Form,
    Button,
    Divider,
    Select, Upload,
    Space,
    message,
    List,
    Popconfirm,
    notification
} from 'antd';
import axios from "axios";
import { getErrorMessage, logErrorMessage } from "../../../../libraries/network-error-handling";
import { useHistory } from "react-router";
import config, { getDefaultHeader } from "../../../config";

export default function General(props) {

    const initializeComponent = () => {

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
                    headers: getDefaultHeader(),
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
                logErrorMessage(e)
            }
        }

        retreiveProject()

    }
    useEffect(initializeComponent, [props.project.id])
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [project, setProject] = useState({});



    // upload image and set imageUri
    const beforeUpload = async (file) => {
        let formData = new FormData();
        formData.append('icon', file);
        try {
            let { data } = await axios.post('http://localhost:1337/icon/upload', formData, {
                headers: {
                    ...(getDefaultHeader()),
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    projectId: project.id
                }
            });
            console.log(data)
            let newImageUri = 'http://localhost:1337/icon/' + data.uploadedFiles[0].id;
            // TODO: Update project URI
            props.updateProject()
            setImageUri(newImageUri)
            message.success('Icon was updated')
        } catch (e) {
            logErrorMessage(e)
            message.error('Error: ' + getErrorMessage(e))
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
                headers: getDefaultHeader()
            })

            let newProject = data.project;
            setProject(newProject)

            message.success(`${field} was updated to "${value}"`)
            props.updateProject()
        } catch (e) {
            logErrorMessage(e)
            message.error("Error: " + getErrorMessage(e))
        }
    }

    let history = useHistory();
    const deleteProject = async () => {
        const projectId = props.project.id;
        try {
            await axios.delete(config.baseUrl + '/project/' + projectId, {
                headers: config.getDefaultHeader()
            });
            notification.success({
                message: "Project was deleted"
            })
            props.updateProjectOnNavigation()
            history.push('/dashboard')
        } catch (e) {
            logErrorMessage(e)
            message.error('Error: ' + getErrorMessage(e))
        }
    }


    useEffect(initializeComponent, [])


    const settings = [
        {
            title: 'Title',
            reactNode: (<Space  >
                {
                    title !== project.title ?
                        <Button
                            onClick={() => updateProject('title')}
                            type='primary'>
                            Update
                        </Button> : null}
                <Input
                    value={title}
                    onPressEnter={() => {
                        if (title !== project.title) updateProject('title')
                    }}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    type="text" />

            </Space>)
        },
        {
            title: 'Description',
            reactNode: (
                <Space >
                    {
                        description !== project.description ?
                            <Button
                                onClick={() => updateProject('description')}
                                type='primary'>
                                Update
                            </Button> : null}
                    <Input
                        value={description}
                        onPressEnter={() => {
                            if (description !== project.description) updateProject('description')
                        }}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                        o
                        type="text" />

                </Space>
            )
        },
        {
            title: 'Project Icon',
            reactNode: (
                <div>
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
                </div>

            )
        },
        {
            title: 'Delete Project?',
            reactNode: (
                <Popconfirm
                    title="Are you sure?"
                    onConfirm={deleteProject}
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            )
        }
    ]


    return (<div style={{ width: '100%' }}>
        <List
            style={{
                width: '100%',
                maxWidth: 600
            }}
            dataSource={settings}
            bordered
            renderItem={(item) => <List.Item
                key={item.title}
                extra={[item.reactNode]}
            >
                {item.title}
            </List.Item>}
        />





    </div >
    )
}