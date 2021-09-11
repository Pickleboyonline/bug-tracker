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
import axios from 'axios';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            totalBugs: 0,
            totalBugsClosed: 0,
            totalBugsOpen: 0,
            totalMembers: 0,
            pieChart: null
        };

    }
    TOKEN = window.localStorage.getItem('token');


    async componentDidMount() {
        await this.renderChart();
        this.fetchStats()


    }

    componentDidUpdate(prevProps) {
        if (prevProps.project.id !== this.props.project.id) {
            this.fetchStats()
        }
    }

    renderChart = () => {
        return new Promise((res) => {
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
                        data: [this.state.totalBugsOpen, this.state.totalBugsClosed],
                        backgroundColor: [
                            '#f50',
                            '#389e0d',
                        ],
                        hoverOffset: 4
                    }]
                }
            })

            this.setState({
                pieChart
            }, res)
        })
    }

    updateChart = async () => {
        let { pieChart } = this.state;
        pieChart.data.datasets[0].data = [this.state.totalBugsOpen, this.state.totalBugsClosed];
        pieChart.update()
    }

    fetchStats = async () => {
        try {
            let { data } = await axios.get('http://localhost:1337/project/stats/' + this.props.project.id, {
                headers: {
                    'x-auth-token': this.TOKEN
                }
            });

            let {
                totalBugs,
                totalBugsClosed,
                totalBugsOpen,
                totalMembers } = data;

            this.setState({
                totalBugs,
                totalBugsClosed,
                totalBugsOpen,
                totalMembers
            }, this.updateChart)
        } catch (e) {
            console.log(e.response || e)
        }
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
                                    <Statistic title="Members" value={this.state.totalMembers} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Bugs Submited" value={this.state.totalBugs} />

                                </Col>
                                <Col span={12}>
                                    <Statistic title="Bugs Open" value={this.state.totalBugsOpen} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Bugs Closed" value={this.state.totalBugsClosed} />
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
