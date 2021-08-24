import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import {
    List, Typography,
    Divider,
    Input,
    Avatar, Button, Space, Modal, Select
} from 'antd';

const { Search } = Input;
const { Option } = Select;

const data = [
    'Imran Shitta-Bey (ias45@getmixtape.app)',
    'Pages',
];


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleAddMember: false
        };

    }

    componentDidMount() {


    }

    toggleAddMember = () => this.setState({ toggleAddMember: !this.state.toggleAddMember })

    render() {
        return (
            <div>
                <Space style={{
                    marginBottom: 20
                }}>
                    <Search placeholder="search"

                        onSearch={() => alert('hey')} style={{ width: 200 }} />
                    <Button
                        onClick={this.toggleAddMember}
                        type='primary'>
                        Add New Member
                    </Button>
                </Space>

                <Modal title="Add More Members..."
                    visible={this.state.toggleAddMember}
                    onOk={this.toggleAddMember}
                    onCancel={this.toggleAddMember}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Start typing..."
                    // defaultValue={['a10', 'c12']}
                    //onChange={handleChange}
                    >
                        <Option>
                            Imran S. (ias45@getmixtape.app)
                        </Option>
                    </Select>
                </Modal>



                <List
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={data}
                    style={{
                        width: 800
                    }}
                    renderItem={item => (
                        <List.Item className="bugg-list-item-button">
                            <Avatar style={{ marginRight: 10 }}>I</Avatar> {item}
                            <Button
                                style={{
                                    float: 'right'
                                }}
                                type='link'>options</Button>
                        </List.Item>
                    )}
                />

            </div>
        );
    }
}


export default App;
