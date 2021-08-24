import React from 'react'
import {
    Card, Button, Statistic
    , Col, Row, Divider, Space, Timeline
} from 'antd'


class Home extends React.Component {

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

                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            extra={
                                <Space>
                                    <Button>Create</Button>
                                    <Button>Join</Button>
                                </Space>
                            }
                            title="Projects">
                            <Row>
                                <Col span={12}>
                                    <Space
                                        style={{
                                            width: '100%'
                                        }}
                                        direction='vertical'
                                        align='center'>
                                        <Button
                                            style={{
                                                width: 110,
                                                height: 130,

                                            }}
                                            icon={
                                                <div>
                                                    <img style={{
                                                        borderRadius: 5,
                                                        borderColor: 'rgba(0,0,0,.2)',
                                                        borderStyle: 'solid',
                                                        borderWidth: 1,
                                                        width: 100,
                                                        backgroundColor: 'rgba(0 0 0 / 20%)'
                                                    }}
                                                        src="https://getmixtape.app/static/media/JUSTFORAPPLE.fa2ec9e8.png"

                                                    />
                                                    <h4>
                                                        Mixtape
                                                    </h4>
                                                </div>
                                            }
                                            type='text' />


                                    </Space>

                                </Col>
                                <Col span={12}>
                                    <Space
                                        style={{
                                            width: '100%'
                                        }}
                                        direction='vertical'
                                        align='center'>
                                        <Button
                                            style={{
                                                width: 110,
                                                height: 130,

                                            }}
                                            icon={
                                                <div>
                                                    <img style={{
                                                        borderRadius: 5,
                                                        borderColor: 'rgba(0,0,0,.2)',
                                                        borderStyle: 'solid',
                                                        borderWidth: 1,
                                                        width: 100,
                                                        backgroundColor: 'rgba(0 0 0 / 20%)'
                                                    }}
                                                        src="https://getmixtape.app/static/media/JUSTFORAPPLE.fa2ec9e8.png"

                                                    />
                                                    <h4>
                                                        Mixtape
                                                    </h4>
                                                </div>
                                            }
                                            type='text' />


                                    </Space>

                                </Col>
                            </Row>
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

export default Home;