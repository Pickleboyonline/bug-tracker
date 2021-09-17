import React from 'react';

import {
    Calendar,
    Button,

    Space,
    Modal,
    Drawer
} from 'antd';
import moment from 'moment';
import axios from 'axios';
import ViewBug from './../ProjectsTabs/ViewBug';
import { logErrorMessage } from '../../../libraries/network-error-handling';
import { getDefaultHeader } from '../../config';
import MediaQuery from 'react-responsive';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createNewEvent: false,
            toggleDrawer: false,
            bugs: [],
            selectedBug: {},
            selectedDate: moment()
        };

    }




    componentDidMount() {
        this.fetchBugs()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.project.id !== this.props.project.id) {
            this.fetchBugs()
        }
    }

    // retrives bugs assoiated with this project and sends them to this.state.bugs
    fetchBugs = async () => {
        if (!this.props.project.id) return;
        try {
            let { data } = await axios.get('/bug/all', {
                headers: getDefaultHeader(),
                params: {
                    projectId: this.props.project.id
                }
            })
            //console.log(data)
            this.setState({
                bugs: data.bugs.map((item => {
                    let date;
                    if (item.dueDate) {
                        date = moment(new Date(item.dueDate))
                    }
                    return {
                        ...item,
                        date
                    }
                }))
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.project.id !== this.props.project.id) {
            this.fetchBugs()
        }
    }

    // Opens drawer and sets "selectedBug" in state
    _onDateSelected = (date) => {
        console.log(date)

        this._toggleDrawerState()
    }

    _toggleDrawerState = () => {
        this.setState({
            toggleDrawer: !this.state.toggleDrawer
        })
    }

    // toggle drawer state and refresh bug data
    _onDrawerClose = () => {
        this._toggleDrawerState()
        this.fetchBugs()
    }

    _onBugSelect = () => {
        const { selectedBug } = this.state;
        this._toggleDrawerState();
    }

    getBugsDue = (value) => {
        let year = value.year();
        let day = value.dayOfYear()
        let bugsDue = [];
        let { bugs } = this.state

        for (let i = 0; i < bugs.length; i++) {
            let compareValue = bugs[i].date
            if (!compareValue) continue;

            if (year === compareValue.year() && day === compareValue.dayOfYear()) {
                bugsDue.push(bugs[i])
            }

        }

        return bugsDue
    }

    dateCellRender = (value) => {
        const listData = this.getBugsDue(value);
        return (
            <ul

                className="events">
                {listData.map(item => (
                    <li
                        onClick={() => this.setState({ selectedBug: item }, this._onBugSelect)}
                        key={item.id}
                        style={{
                            backgroundColor: (() => {
                                let { type } = item;
                                if (type === 'error') {
                                    return '#f5222d'
                                }
                                else if (type === 'warning') {
                                    return '#d4b106'
                                } else if (type === 'success') {
                                    return '#52c41a'
                                } else {
                                    return '#13c2c2'
                                }
                            })(),
                            marginBottom: 5,
                            borderRadius: 5,
                            paddingLeft: 5,
                            color: 'white'
                        }}
                    >

                        {item.title}
                        {/* <Badge status={item.type} text={item.content} /> */}


                    </li>
                ))}
            </ul>
        );
    }

    render() {
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <div>
                        <div style={{
                            marginRight: isMobile ? 10 : 64
                        }}>
                            <style>{`
                    .events {
                        margin: 0;
                        padding: 0;
                        list-style: none;
                      }
                      .events .ant-badge-status {
                        width: 100%;
                        overflow: hidden;
                        font-size: 12px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      }
                      .notes-month {
                        font-size: 28px;
                        text-align: center;
                      }
                      .notes-month section {
                        font-size: 28px;
                      }
                    `}</style>
                            <Space>
                                {/* <Button
                            
                            onClick={() => this.setState({ createNewEvent: !this.state.createNewEvent })}>
                            Add Event
                        </Button> */}
                                <Button
                                    type='primary'
                                    onClick={() => this.setState({ selectedDate: moment() })}
                                >
                                    Today
                                </Button>
                            </Space>
                            <Calendar
                                value={this.state.selectedDate}
                                onSelect={(date) => this.setState({ selectedDate: date })}
                                dateCellRender={this.dateCellRender}
                            />
                            <Modal
                                visible={this.state.createNewEvent}
                                onOk={() => this.setState({ createNewEvent: !this.state.createNewEvent })}
                                onCancel={() => this.setState({ createNewEvent: !this.state.createNewEvent })}
                                title="Create New Event"
                            >

                            </Modal>
                            <Drawer
                                width={800}
                                title="View Date"
                                placement="right"
                                closable={true}
                                onClose={() => this.setState({ toggleDrawer: false })}
                                visible={this.state.toggleDrawer}
                            >
                                hey
                            </Drawer>

                            <Drawer
                                width={isMobile ? '100%' : 800}
                                title={this.state.selectedBug.title}
                                placement="right"
                                closable={true}
                                onClose={this._onDrawerClose}
                                visible={this.state.toggleDrawer}
                                destroyOnClose
                            >
                                <ViewBug bug={this.state.selectedBug} />
                            </Drawer>
                        </div>

                    </div>
                }
            </MediaQuery>
        );
    }
}


export default App;
