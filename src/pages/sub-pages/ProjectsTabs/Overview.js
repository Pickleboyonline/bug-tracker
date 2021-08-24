import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import { Card, Statistic, Row, Col, Button, Space } from 'antd';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false
        };

    }

    componentDidMount() {
        var ctx = document.getElementById('pieChart').getContext('2d');
        var pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Open',
                    'Closed',

                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4
                }]
            }
        })
    }

    render() {
        return (
            <React.Fragment>

                <Row
                    style={{
                        width: '100%'
                    }}
                    gutter={16}>
                    <Col span={8}>
                        <Card
                            title="Statistics"
                            style={{
                                //width: 450
                            }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="Members" value={1002} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Bugs Submited" value={112893} />

                                </Col>
                                <Col span={12}>
                                    <Statistic title="Up Time" value={"25 days"} />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={8}>

                        <Card
                            title="Progress"
                            style={{
                                //width: 450
                            }}>
                            <Space
                                style={{
                                    width: '100%'
                                }}
                                direction='vertical' align='center'>
                                <div style={{ width: 400, height: 400 }}>
                                    <canvas id="pieChart" width="400" height="400"></canvas>
                                </div>
                            </Space>

                        </Card>


                    </Col>
                </Row>





            </React.Fragment>

        );
    }
}


export default App;
