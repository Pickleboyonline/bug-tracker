import React from 'react';
import Chart from 'chart.js/auto';
import { Card, Statistic, Row, Col, Space } from 'antd';
import axios from 'axios';
import MediaQuery from 'react-responsive'
import { logErrorMessage } from '../../../libraries/network-error-handling';
import { getDefaultHeader } from '../../config';


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
            let { data } = await axios.get('/project/stats/' + this.props.project.id, {
                headers: getDefaultHeader(),
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
            logErrorMessage(e)
        }
    }

    render() {
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <React.Fragment>

                        <div
                            style={{
                                display: isMobile ? 'flex' : 'inline-flex',
                                flexDirection: isMobile ? 'column' : 'unset',
                                marginRight: isMobile ? 10 : 64,
                                gap: 10
                            }}
                        >

                            <Card
                                title="Statistics"
                            >
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


                            <Card
                                title="Progress"
                                style={{
                                    //width: 450
                                }}>
                                <Space
                                    style={{
                                        width: '100%',
                                        // display: 'none'
                                    }}
                                    direction='vertical' align='center'>

                                    <canvas
                                        id="pieChart"
                                    //width="400"
                                    //height="400"
                                    ></canvas>

                                </Space>

                            </Card>



                        </div>




                    </React.Fragment>
                }
            </MediaQuery>
        );
    }
}


export default App;
