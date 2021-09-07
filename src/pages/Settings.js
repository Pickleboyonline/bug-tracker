import React from 'react'
import {
    Card, Button, Statistic
    , Col, Row, Divider, Space, Timeline,
    List,
    Avatar
} from 'antd'

const data = [
    'Notifications',
    'Pages',
];
class Home extends React.Component {
    state = {

    }
    render() {
        return (
            <div style={{ width: 1100 }}>
                <div style={{ width: 800 }}>


                    <h1>
                        Settings
                    </h1>
                    <Divider

                    />
                </div>

                <div style={{
                    display: 'inline-flex'

                }}>
                    <style>{`
.bugg-list-item-button:hover {
    background-color: rgb(0 0 0 / 5%);
    cursor: pointer;
}
.bugg-list-item-button {
    background-color: white;
}
`}</style>
                    <List
                        // header={<div>Header</div>}
                        // footer={<div>Footer</div>}
                        bordered
                        dataSource={data}
                        style={{
                            width: 300
                        }}
                        renderItem={item => (
                            <List.Item className="bugg-list-item-button">
                                <Avatar>S</Avatar> {item}
                            </List.Item>
                        )}
                    />
                    <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>
                        {
                            (() => {
                                switch (this.state.activeSetting) {
                                    case 2:
                                        return "@"
                                    default:
                                        return 'no tab selected'
                                }

                            })()
                        }
                    </div>
                    {/* <div style={{
                        flex: 1,
                        marginLeft: 20
                    }}>

                        <h1>
                            Go Ahead, Change Some Stuff
                        </h1>
                        <p style={{ maxWidth: 700 }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>


                    </div> */}
                </div>
            </div>
        )

    }
}

export default Home;