import React, { useEffect, useState } from 'react'
import {
    Card, Button
    , Col, Row, Divider, Space, Modal
} from 'antd'
import { CreateProject } from './CreateProject'
import {
    useHistory, withRouter
} from "react-router-dom";
import JoinProject from './JoinProject';
import { useMediaQuery } from 'react-responsive'



function Home(props) {

    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleJoin, setVisibleJoin] = useState(false);
    const projects = props.projects ?? [];
    const history = useHistory();
    const isMobile = useMediaQuery({ maxWidth: 800 })
    useEffect(props.updateProjects, [])


    return (
        <div style={{
            marginRight: (isMobile ? 10 : 64),
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div >


                <h1>
                    Home
                </h1>

                <Divider />


            </div>
            <Modal
                title="Create Project"
                footer={null}
                onCancel={() => setVisibleCreate(false)}
                visible={visibleCreate}>
                <CreateProject
                    updateProjects={props.updateProjects}
                    closeFunc={() => setVisibleCreate(false)} />
            </Modal>


            <Modal
                title="Join Project"
                footer={null}
                onCancel={() => setVisibleJoin(false)}
                visible={visibleJoin}>
                <JoinProject
                    updateProjects={props.updateProjects}
                    closeFunc={() => setVisibleJoin(false)} />
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
                // style={{ width: '90%' }}
                gutter={16}>
                <Col span={24}>
                    <Card
                        bodyStyle={{
                            paddingLeft: 40,
                            paddingRight: 40
                        }}
                        extra={
                            <Space>
                                <Button type='primary' onClick={() => setVisibleCreate(true)}>Create</Button>
                                <Button onClick={() => setVisibleJoin(true)}>Join</Button>
                            </Space>
                        }
                        title="Projects">

                        <Row gutter={[40, 40]} >
                            {
                                projects.map((item) => {
                                    function getImageUri() {
                                        if (item.icon.id) {
                                            return '/icon/' + item.icon.id
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
                                                onClick={() => history.push('/dashboard/projects/' + item.id)}
                                                imageUrl={getImageUri()}
                                            />
                                        </Col>
                                    )
                                })

                            }
                        </Row>


                    </Card>
                </Col>
            </Row>
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

export default withRouter(Home);