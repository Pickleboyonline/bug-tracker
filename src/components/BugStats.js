import React from 'react';
// import moment from 'moment';
import {
    Statistic,
    Row,
    Col,
    Tag,
    Button,
    Input,
    Switch,
    DatePicker,
    Upload,
    Select,
    message,
    notification
} from 'antd';
import { ConsoleSqlOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { getErrorMessage } from '../libraries/network-error-handling';

const { Dragger } = Upload;
const { Option } = Select;


class BugStats extends React.Component {
    state = {
        editTags: false,
        editDueDate: false,
        editReproducibility: false,
        editSeverity: false,
        editCatagory: false,
        editStatus: false,
        values: { tags: [' '], dueDate: null }
    };

    toggleValue = (val) => this.setState({ [val]: !this.state[val] })

    _updateValueOnServer = async (field, value) => {
        const token = window.localStorage.getItem('token');

        try {
            let res = await axios.put('http://localhost:1337/bug/' + this.props.bugId, {
                [field]: value
            }, {
                headers: {
                    'x-auth-token': token
                }

            })
            message.success(`"${field}" was updated to "${value}"`)
        } catch (e) {
            message.error("Error: " + getErrorMessage(e))
        }

    }

    componentDidMount() {
        let { bug } = this.props;

        this.setState({
            values: {
                status: bug.status,
                tags: (bug.tags !== '' ? bug.tags.split(',') : []),
                dueDate: (bug.dueDate ? moment(new Date(bug.dueDate)) : null),
                catagory: (bug.catagory ? bug.catagory : undefined),
                severity: (bug.severity ? bug.severity : undefined),
                reproducibility: (bug.reproducibility ? bug.reproducibility : undefined),

            }
        })
    }

    _forceUpdateBug() {

    }

    render() {

        return (
            <>
                <Row //gutter={16}
                >
                    <Col span={8}>

                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}

                            formatter={(val) => {
                                if (this.state.editStatus) {
                                    return (<Switch
                                        checkedChildren="OPEN"
                                        unCheckedChildren="CLOSED"

                                        onChange={(checked) => {
                                            if (checked) {
                                                //open
                                                this.setState({
                                                    values: { ...this.state.values, status: 'open' }
                                                })
                                            } else {
                                                //closed
                                                this.setState({
                                                    values: { ...this.state.values, status: 'closed' }
                                                })
                                            }
                                        }}
                                        defaultChecked={(this.state.values.status === 'open' ? true : false)} />
                                    )
                                } else {
                                    return <Tag color={(this.state.values.status === 'open' ? "#f50" : "#389e0d")} //"#f50"
                                    >{
                                            new String(this.state.values.status).toUpperCase()
                                        }</Tag>
                                }
                            }}
                            title={<>
                                Status
                                <Button
                                    onClick={() => {
                                        if (this.state.editStatus) {
                                            this._updateValueOnServer('status', this.state.values.status)
                                        }
                                        this.toggleValue('editStatus')
                                    }}
                                    type="text"
                                    icon={<EditOutlined />}
                                />
                            </>

                            }

                            value={'OPEN'} />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}

                            title={<>
                                Tags
                                <Button
                                    onClick={() => {
                                        if (this.state.editTags) {
                                            this._updateValueOnServer('tags', this.state.values.tags.join())
                                        }
                                        this.toggleValue('editTags')
                                    }}
                                    type="text"
                                    icon={<EditOutlined />}
                                />
                            </>

                            }
                            formatter={(val) => {
                                if (this.state.editTags) {
                                    return (<Select mode="tags"
                                        onChange={
                                            (e) => {
                                                this.setState({
                                                    values: { ...this.state.values, tags: e }
                                                })
                                            }
                                        }
                                        // value={(() => {
                                        //     if (this.state.values.tags) {
                                        //         return []
                                        //     } else {
                                        //         return this.state.values.tags.split(',')
                                        //     }
                                        // })()}
                                        value={this.state.values.tags}
                                        style={{ width: 200 }} placeholder="Tags Mode">
                                        <Option key={"Poggers"}>Poggers</Option>)
                                    </Select>)
                                } else {

                                    return this.state.values.tags.map((item) => {
                                        return <Tag color="cyan">{item}</Tag>
                                    })

                                }
                            }}
                            value={"URGENT"} />

                    </Col>
                    <Col

                        span={8}>
                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}
                            title={<>
                                Due Date
                                <Button
                                    onClick={() => {
                                        if (this.state.editDueDate && this.state.values.dueDate) {

                                            this._updateValueOnServer('dueDate', this.state.values.dueDate.toDate().getTime())
                                        }
                                        this.toggleValue('editDueDate')
                                    }}
                                    type="text"
                                    icon={<EditOutlined />}
                                />
                            </>

                            }
                            formatter={(val) => {
                                if (this.state.editDueDate) {
                                    return (<DatePicker
                                        style={{
                                            width: 200
                                        }}
                                        value={this.state.values.dueDate}
                                        onChange={(mom) => {
                                            this.setState({
                                                values: {
                                                    ...this.state.values,
                                                    dueDate: mom
                                                }
                                            })
                                        }} />)
                                } else {
                                    if (this.state.values.dueDate) {
                                        return this.state.values.dueDate.format('MMM Do YY')
                                    }
                                    return "N/A"
                                }
                            }}
                            value={"Oct 24, 2022"} />
                    </Col>

                </Row>
                <Row style={{
                    marginTop: 20
                }}>
                    <Col

                        span={8}>
                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}

                            title={<>
                                Reproducibility
                                <Button type="text"

                                    onClick={() => {
                                        if (this.state.editReproducibility) {
                                            this._updateValueOnServer('reproducibility', this.state.values.reproducibility)
                                        }
                                        this.toggleValue('editReproducibility')
                                    }}
                                    icon={<EditOutlined />}
                                />
                            </>

                            }
                            formatter={(val) => {
                                if (this.state.editReproducibility) {
                                    return (<Select
                                        showSearch
                                        onChange={(e) => {
                                            this.setState({
                                                values: {
                                                    ...this.state.values,
                                                    reproducibility: e
                                                }
                                            })
                                        }}
                                        value={this.state.values.reproducibility}
                                        style={{ width: 200 }}
                                        placeholder="Search to Select"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        }
                                    >
                                        <Option value="Always">Always</Option>
                                        <Option value="Sometimes">Sometimes</Option>
                                        <Option value="Rarely">Rarely</Option>
                                        <Option value="Unable">Unable</Option>
                                        <Option value="Never tried">Never tried</Option>
                                        <Option value="N/A">N/A</Option>
                                    </Select>)
                                } else {
                                    return this.state.values.reproducibility
                                }
                            }}
                            value={'Always'} />

                    </Col>
                    <Col

                        span={8}>
                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}

                            title={<>
                                Severity
                                <Button type="text"
                                    onClick={() => {
                                        if (this.state.editSeverity) {
                                            this._updateValueOnServer('severity', this.state.values.severity)
                                        }
                                        this.toggleValue('editSeverity')
                                    }}
                                    icon={<EditOutlined />}
                                />
                            </>

                            }

                            formatter={(val) => {
                                if (this.state.editSeverity) {
                                    return (
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Search to Select"
                                            optionFilterProp="children"
                                            value={this.state.values.severity}
                                            onChange={(e) => {
                                                this.setState({
                                                    values: {
                                                        ...this.state.values,
                                                        severity: e
                                                    }
                                                })
                                            }}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="None">None</Option>
                                            <Option value="Critical">Critical</Option>
                                            <Option value="Major">Major</Option>
                                            <Option value="Minor">Minor</Option>
                                        </Select>)
                                } else {
                                    return this.state.values.severity
                                }
                            }}
                            value={'Major'} />

                    </Col>
                    <Col

                        span={8}>
                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}

                            title={<>
                                Catagory
                                <Button type="text"
                                    onClick={() => {
                                        if (this.state.editCatagory) {
                                            this._updateValueOnServer('catagory', this.state.values.catagory)
                                        }
                                        this.toggleValue('editCatagory')
                                    }}
                                    icon={<EditOutlined />}
                                />
                            </>
                            }

                            formatter={(val) => {
                                if (this.state.editCatagory) {
                                    return (
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Search to Select"
                                            optionFilterProp="children"
                                            onChange={(e) => {
                                                this.setState({
                                                    values: {
                                                        ...this.state.values,
                                                        catagory: e
                                                    }
                                                })
                                            }}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            value={this.state.values.catagory}
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="Security">Security</Option>
                                            <Option value="Data Loss">Data Loss</Option>
                                            <Option value="Performance">Performance</Option>
                                            <Option value="Crash/Hang">Crash/Hang</Option>
                                            <Option value="Other Bug">Other Bug</Option>
                                            <Option value="UI">UI</Option>
                                            <Option value="New Feature">New Feature</Option>
                                            <Option value="Enhancement">Enhancement</Option>
                                        </Select>)
                                } else {
                                    return this.state.values.catagory
                                }
                            }}
                            value={'Crashes/Hang'} />

                    </Col>
                </Row>
                <Row style={{ marginTop: 20, marginBottom: 20 }}>
                    <Col

                        span={8}>

                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}
                            title={<span style={{
                                marginTop: 10
                            }}>
                                Owner

                            </span>

                            }
                            value={this.props.bug.submitter.name} />
                    </Col>

                    <Col

                        span={8}>

                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}
                            title='Date Submited'
                            value={moment(new Date(this.props.bug.createdAt)).format('MMM Do YY')} />
                    </Col>
                </Row>
                <br />

            </>


        );
    }
}


export default BugStats;
