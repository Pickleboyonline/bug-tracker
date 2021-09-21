import React from 'react';

import { List, Avatar } from 'antd';

import General from './SettingsComponents/General';
import Roles from './SettingsComponents/Roles';
import Notifications from './SettingsComponents/Notifications';
import Members from './SettingsComponents/Members'
import MediaQuery from 'react-responsive'

const data = [
    'General',
    'Roles',
    'Notifications',
    // 'Members',
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            selectedSetting: 'general',

        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>


                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        marginTop: 10,
                        marginRight: isMobile ? 10 : 64,
                        gap: 20
                        // width: '100%'
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
                        <div>
                            <List
                                // header={<div>Header</div>}
                                // footer={<div>Footer</div>}
                                bordered
                                dataSource={data}
                                style={{
                                    width: isMobile ? 'unset' : 220,
                                    // marginBottom: 
                                    //  height: 229 - (229 / 4)
                                }}
                                renderItem={item => {
                                    let str = item.toLowerCase().split(' ').join('-');
                                    return (
                                        <List.Item
                                            key={str}
                                            className="bugg-list-item-button"
                                            onClick={() => {
                                                this.setState({
                                                    selectedSetting: str
                                                })
                                            }}
                                            style={{
                                                color: (this.state.selectedSetting === str ? '#0094f7' : 'black')
                                            }}
                                        >
                                            <Avatar style={{
                                                marginRight: 10
                                            }}>{item.substring(0, 1).toLocaleUpperCase()}</Avatar> {item}
                                        </List.Item>
                                    )
                                }}
                            />
                        </div>

                        {
                            // Create components
                        }
                        <div style={{
                            flex: 1,

                        }}>
                            {
                                (() => {
                                    switch (this.state.selectedSetting) {
                                        case data[0].toLowerCase().split(' ').join('-'):
                                            return <General
                                                project={this.props.project}
                                                updateProject={this.props.updateProject}
                                                updateProjectOnNavigation={this.props.updateProjectOnNavigation}
                                            />
                                        case data[1].toLowerCase().split(' ').join('-'):
                                            return <Roles isMobile={isMobile} project={this.props.project} />
                                        case data[2].toLowerCase().split(' ').join('-'):
                                            return <Notifications isMobile={isMobile} project={this.props.project} />
                                        case data[3].toLowerCase().split(' ').join('-'):
                                            return <Members project={this.props.project} />
                                        default:
                                            return 'no tab selected'
                                    }

                                })()
                            }
                        </div>
                    </div>
                }
            </MediaQuery>
        );
    }
}


export default App;
