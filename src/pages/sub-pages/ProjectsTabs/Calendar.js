import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import {
    Calendar,
    Button,
    Badge,
    Space,
    Modal,
    Drawer
} from 'antd';
import moment from 'moment';
function getListData(value) {
    let listData;
    switch (value.date()) {
        case 8:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
            ];
            break;
        case 10:
            listData = [
                { type: 'warning', content: 'This is warning event.' },
                { type: 'success', content: 'This is usual event.' },
                { type: 'error', content: 'This is error event.' },
            ];
            break;
        case 15:
            listData = [
                { type: 'warning', content: 'This is warning event' },
                { type: 'success', content: 'This is very long usual event。。....' },
                { type: 'error', content: 'This is error event 1.' },
                { type: 'error', content: 'This is error event 2.' },
                { type: 'error', content: 'This is error event 3.' },
                { type: 'error', content: 'This is error event 4.' },
            ];
            break;
        default:
    }
    return listData || [];
}

function dateCellRender(value) {
    const listData = getListData(value);
    return (
        <ul

            className="events">
            {listData.map(item => (
                <li key={item.content}
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
                    {item.content}
                    {/* <Badge status={item.type} text={item.content} /> */}


                </li>
            ))}
        </ul>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createNewEvent: false,
            toggleDrawer: false
        };

    }

    componentDidMount() {

    }


    render() {
        return (
            <div>
                <div style={{
                    width: 1000
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
                        <Button
                            type='primary'
                            onClick={() => this.setState({ createNewEvent: !this.state.createNewEvent })}>
                            Add Event
                        </Button>
                        <Button

                        >
                            Today
                        </Button>
                    </Space>
                    <Calendar
                        onSelect={() => this.setState({ toggleDrawer: true })}
                        dateCellRender={dateCellRender}
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
                </div>

            </div>
        );
    }
}


export default App;
