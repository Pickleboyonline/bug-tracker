import React from 'react';
// import moment from 'moment';
import {
    Space,
    Input, Avatar, Select,
    Button, Divider, Typography, List, Pagination, Modal
} from 'antd';
import { EditOutlined } from '@ant-design/icons';


const { Paragraph, Title } = Typography;
const { Option } = Select;


class BugStats extends React.Component {
    state = {
        editAssigned: false
    };


    render() {

        return (
            <div>
                <Space align='center'>
                    <Title
                        style={{
                            margin: 0,
                            marginRight: 10
                        }}
                        level={5}>Assigned To</Title>

                </Space>

                <Divider />
                <List
                    size="small"
                    header={<Space><Input.Search placeholder="search" style={{ width: 200 }} />
                        <Button onClick={() => this.setState({ editAssigned: true })} type='primary'>
                            Add More Members...
                        </Button>
                    </Space>}
                    footer={<div
                        style={{
                            width: '100%',
                            display: 'inline-flex',
                            justifyContent: 'flex-end'
                        }}
                    ><Pagination size="small" total={50} showSizeChanger showQuickJumper /></div>}
                    bordered
                    dataSource={['Barack Obama (boa72@getmixtape.app)']}
                    renderItem={item => <List.Item><Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginRight: 15 }}>U</Avatar>{item}</List.Item>}
                />

                <Modal title="Add More Members..." visible={this.state.editAssigned} onOk={() => this.setState({ editAssigned: false })} onCancel={() => this.setState({ editAssigned: false })}>
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
            </div>


        );
    }
}


export default BugStats;
