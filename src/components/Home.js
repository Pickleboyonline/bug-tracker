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
import { getErrorMessage } from '../libraries/network-error-handling';
import { getDefaultHeader } from '../pages/config';
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
                headers: getDefaultHeader()
            })
        } catch (e) {

            console.error(getErrorMessage(e))
            notification.error({
                message: getErrorMessage(e)
            })
            return
        }

        notification.success({
            message: 'You have joined project ' + res.data.project.title + '!'
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
    return (
        <Space
            style={{
                width: '100%',
                borderRadius: 5
            }}

            direction='vertical'
            onClick={props.onClick}
            align='center'>

            <div
                className="bugg-button"
                style={{
                    width: 120,
                    borderRadius: 5,
                    paddingTop: 5
                }}>

                <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: 5,
                    borderColor: 'rgba(0,0,0,.2)',
                    borderStyle: 'solid',
                    backgroundRepeat: 'no-repeat',
                    borderWidth: 1,
                    backgroundImage: 'url(' + props.imageUrl + ')',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundColor: 'rgba(0 0 0 / 5%)',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }} />
                <h4 style={{ maxWidth: 120, textAlign: 'center' }}>
                    {props.title}
                </h4>
            </div>

        </Space>

    )
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


        try {
            let { data } = await axios.get('http://localhost:1337/project/all', {
                headers: getDefaultHeader()
            });
            this.setState({
                projects: data.projects
            });
            // console.log(data.projects)
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    _renderProjects = () => {
        let renderedProjects = [];
        let batch = [];
        let projects = this.state.projects;

        //(projects)
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
        //console.log(renderedProjects)

        return renderedProjects;
    }

    render() {
        return (
            <div >
                <div style={{ width: '90%' }}>


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



                <style>{`
.bugg-button:hover {
    background-color: rgba(0 0 0 / 10%);
    cursor: pointer;
}

.bugg-button {
    transition: 0.5s;
}
`}</style>
                <Row
                    style={{ width: '90%' }}
                    gutter={16}>
                    <Col span={24}>
                        <Card
                            bodyStyle={{
                                paddingLeft: 40,
                                paddingRight: 40
                            }}
                            extra={
                                <Space>
                                    <Button type='primary' onClick={() => this.setState({ visibleCreate: true })}>Create</Button>
                                    <Button onClick={() => this.setState({ visibleJoin: true })}>Join</Button>
                                </Space>
                            }
                            title="Projects">
                            {
                                null && this._renderProjects()
                            }
                            <Row gutter={[40, 40]} >
                                {
                                    this.state.projects.map((item) => {
                                        function getImageUri() {
                                            if (item.icon.id) {
                                                return 'http://localhost:1337/icon/' + item.icon.id
                                            } else {
                                                return ''
                                            }
                                        }
                                        return (
                                            <Col //span={3}
                                                xs={12}
                                                md={6}
                                                xl={3}
                                            >
                                                <ProjectButton
                                                    title={item.title}
                                                    onClick={() => this.props.history.push('/dashboard/projects/' + item.id)}
                                                    imageUrl={getImageUri()}
                                                />
                                            </Col>
                                        )
                                    })

                                }
                            </Row>


                        </Card>
                    </Col>
                    {/* <Col span={12}>
                        <Card

                            title="Activity Feed">
                            <Timeline>
                                <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                                <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                                <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                            </Timeline>
                        </Card>
                    </Col> */}
                </Row>
            </div>
        )

    }
}

export default withRouter(Home);