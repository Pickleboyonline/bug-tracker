import React, { useState } from 'react'
import {
    Card, Button, Input
    , Col, Row, Divider, Space, Timeline, Modal, notification
} from 'antd'
import { CreateProject } from './CreateProject'
import axios from 'axios';
import {
    withRouter
} from "react-router-dom";
const PubSub = require('./../PubSub');

const JoinProject = (props) => {
    const [projectId, setProjectId] = useState('');

    const handleSubmit = async () => {
        const token = window.localStorage.getItem('token');
        let res;

        try {
            res = await axios.post('http://localhost:1337/project/join', {
                projectId
            }, {
                headers: {
                    'x-auth-token': token
                }
            })
        } catch (e) {

            if (e.response) {
                console.log(e.response.data)
                notification.error({
                    message: e.response.data.split('\n')[0]
                })
            } else {
                console.log(e)
                notification.error({
                    message: e.message
                })
            }
            return
        }

        notification.success({
            message: 'You have joined project ' + res.data.title + '!'
        })
        PubSub.join('project').emit('update');
        setProjectId('');
        props.closeFunc();

    }

    return (
        <div>
            <Input
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Type project ID here..." />
            <Space style={{
                width: '100%',
                marginTop: 20,
                display: 'inline-flex',
                justifyContent: 'flex-end'
            }}>
                <Button onClick={() => {
                    setProjectId('');
                    props.closeFunc();
                    PubSub.join('project').emit('update');
                }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    type='primary'>
                    Join
                </Button>
            </Space>
        </div>

    )
}

const ProjectButton = (props) => {
    return (<Col span={12}>
        <Space
            style={{
                width: '100%'
            }}
            direction='vertical'
            align='center'>
            <Button
                onClick={props.onClick}
                style={{
                    width: 110,
                    height: 130,

                }}
                icon={
                    <div>
                        {/* <img style={{
                            borderRadius: 5,
                            borderColor: 'rgba(0,0,0,.2)',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            width: 100,
                            backgroundColor: 'rgba(0 0 0 / 20%)'
                        }}
                            //src="https://getmixtape.app/static/media/JUSTFORAPPLE.fa2ec9e8.png"
                            src={props.imageUrl}
                        /> */}
                        <div style={{
                            width: 100,
                            height: 100,
                            borderRadius: 5,
                            borderColor: 'rgba(0,0,0,.2)',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            backgroundImage: 'url(' + props.imageUrl + ')',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }} />
                        <h4>
                            {props.title}
                        </h4>
                    </div>
                }
                type='text' />


        </Space>

    </Col>)
}

class Home extends React.Component {
    state = {
        visibleCreate: false,
        visibleJoin: false,
        projects: []
    }



    componentDidMount() {
        PubSub.join('project').on('update', this._handleProjectUpdate);
        this._handleProjectUpdate()
    }

    componentWillUnmount() {
        PubSub.join('project').removeListener('update', this._handleProjectUpdate);
    }

    _handleProjectUpdate = async () => {
        const token = window.localStorage.getItem('token');

        try {
            let { data } = await axios.get('http://localhost:1337/project/all', {
                headers: {
                    'x-auth-token': token
                }
            });
            this.setState({
                projects: data.projects
            });
            // console.log(data.projects)
        } catch (e) {
            console.log(e)
        }
    }

    _renderProjects = () => {
        let renderedProjects = [];
        let batch = [];
        let projects = this.state.projects;

        console.log(projects)
        for (let i = 0; i < projects.length; i++) {
            if (batch.length < 2) {
                batch.push(<ProjectButton
                    title={projects[i].title}
                    onClick={() => this.props.history.push('/dashboard/projects/' + projects[i].id)}
                    imageUrl={'http://localhost:1337/icon/' + (projects[i].icon ? projects[i].icon.id : 'NA')}
                />);
            }

            if (batch.length === 2 || i + 1 === projects.length) {

                renderedProjects.push(<Row style={{
                    marginBottom: 20
                }}>
                    {batch}
                </Row>);
                batch = [];
            }

        }
        console.log(renderedProjects)

        return renderedProjects;
    }

    render() {
        return (
            <div style={{ width: 1100 }}>
                <div style={{ width: 800 }}>


                    <h1>
                        Home
                    </h1>
                    <Divider

                    />
                </div>
                <Modal
                    title="Create Project"
                    footer={null}
                    onCancel={() => this.setState({ visibleCreate: false })}
                    visible={this.state.visibleCreate}>
                    <CreateProject closeFunc={() => this.setState({ visibleCreate: false })} />
                </Modal>


                <Modal
                    title="Join Project"
                    footer={null}
                    onCancel={() => this.setState({ visibleJoin: false })}
                    visible={this.state.visibleJoin}>
                    <JoinProject closeFunc={() => this.setState({ visibleJoin: false })} />
                </Modal>




                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            extra={
                                <Space>
                                    <Button onClick={() => this.setState({ visibleCreate: true })}>Create</Button>
                                    <Button onClick={() => this.setState({ visibleJoin: true })}>Join</Button>
                                </Space>
                            }
                            title="Projects">
                            {
                                this._renderProjects()
                            }

                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card

                            title="Activity Feed">
                            <Timeline>
                                <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                                <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                                <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                            </Timeline>
                        </Card>
                    </Col>
                </Row>
            </div>
        )

    }
}

export default withRouter(Home);