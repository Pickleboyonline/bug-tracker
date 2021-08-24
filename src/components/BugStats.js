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
    Select
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Option } = Select;


class BugStats extends React.Component {
    state = {
        editTags: false,
        editDueDate: false,
        editReproducibility: false,
        editSeverity: false,
        editCatagory: false,
        editStatus: false
    };

    toggleValue = (val) => this.setState({ [val]: !this.state[val] })


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
                                    return (<Switch checkedChildren="OPEN" unCheckedChildren="CLOSED" defaultChecked />
                                    )
                                } else {
                                    return <Tag color="#f50">OPEN</Tag>
                                }
                            }}
                            title={<>
                                Status
                                <Button
                                    onClick={() => this.toggleValue('editStatus')}
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
                                    onClick={() => this.toggleValue('editTags')}
                                    type="text"
                                    icon={<EditOutlined />}
                                />
                            </>

                            }
                            formatter={(val) => {
                                if (this.state.editTags) {
                                    return (<Select mode="tags" style={{ width: 200 }} placeholder="Tags Mode">
                                        <Option key={69}>Poggers</Option>)
                                    </Select>)
                                } else {
                                    return <Tag color="magenta">{val}</Tag>
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
                                    onClick={() => this.toggleValue('editDueDate')}
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
                                        onChange={() => alert('val')} />)
                                } else {
                                    return "Oct 24, 2022"
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

                                    onClick={() => this.toggleValue('editReproducibility')}
                                    icon={<EditOutlined />}
                                />
                            </>

                            }
                            formatter={(val) => {
                                if (this.state.editReproducibility) {
                                    return (<Select
                                        showSearch
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
                                        <Option value="1">Always</Option>
                                        <Option value="2">Sometimes</Option>
                                        <Option value="3">Rarely</Option>
                                        <Option value="4">Unable</Option>
                                        <Option value="5">Never tried</Option>
                                        <Option value="6">N/A</Option>
                                    </Select>)
                                } else {
                                    return val
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
                                    onClick={() => this.toggleValue('editSeverity')}
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
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">None</Option>
                                            <Option value="2">Critical</Option>
                                            <Option value="3">Major</Option>
                                            <Option value="4">Minor</Option>
                                        </Select>)
                                } else {
                                    return val
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
                                    onClick={() => this.toggleValue('editCatagory')}
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
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            }
                                        >
                                            <Option value="1">Security</Option>
                                            <Option value="2">Data Loss</Option>
                                            <Option value="3">Performance</Option>
                                            <Option value="4">Crash/Hang</Option>
                                            <Option value="5">Other Bug</Option>
                                            <Option value="6">UI</Option>
                                            <Option value="7">New Feature</Option>
                                            <Option value="8">Enhancement</Option>
                                        </Select>)
                                } else {
                                    return val
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
                            value={"Imran Shitta-Bey"} />
                    </Col>

                    <Col

                        span={8}>

                        <Statistic
                            valueStyle={{
                                fontSize: 16
                            }}
                            title='Date Submited'
                            value={"Oct 21, 2021"} />
                    </Col>
                </Row>
                <br />

            </>


        );
    }
}


export default BugStats;
