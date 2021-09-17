import { useState } from 'react';
import {
    Space,
    Badge,
    Avatar,
    Menu,
    Button,
    Dropdown
} from 'antd'

import {
    BellFilled,

} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive'


function NavWelcomeHeader(props) {
    const isMobile = useMediaQuery({ maxWidth: 800 });

    return (
        <div
            className="header"
            style={styles.header}>
            <h2 style={{
                ...(isMobile ? { fontSize: 18 } : {})
            }}>
                {'Welcome' + (props.name ? ', ' : '') + props.name}
            </h2>
            <Space
            // size={isMobile ? 'small' : 'large'}
            //size={(isMobile ? 'small' : 'large')}
            >
                <Badge
                    offset={[-4, 8]}
                    count={props.unreadNotifications}>
                    <Button
                        type='default'
                        shape='circle'
                        size='large'
                        style={{
                            transform: 'scale(1.2)',
                            color: 'rgba(0,0,0,.7)',

                        }}

                        onClick={props.toggleNotificationDrawer}
                        icon={<BellFilled
                            style={{
                                //fontSize: 64
                            }} />}
                    />
                </Badge>

                <style>
                    {`
            .bugg-profile-pic:hover {
                cursor: pointer;
            }
            `}
                </style>
                <Dropdown
                    //overlay={<AvatarSettings />}
                    overlay={menu({ logout: props.logout })}
                    trigger={['click']}
                >

                    <Avatar
                        className="bugg-profile-pic"
                        size={isMobile ? 50 : 50}
                        src={props.userIconUri}
                        //icon={<UserOutlined />} 

                        style={{
                            marginRight: 64,
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,.2)',
                            borderStyle: 'solid',
                            ...(isMobile ? { marginRight: 10 } : {})
                        }} />


                </Dropdown>

            </Space>

        </div>
    )
}

const menu = (props) => (
    <Menu style={{
        width: 150,
    }}>
        <Menu.Item
            onClick={props.logout}
            style={{
                color: 'red'
            }}
            key="0">
            Logout
        </Menu.Item>

    </Menu>
);

const styles = {
    header: {
        width: '100%',
        display: 'inline-flex',
        justifyContent: 'space-between',
        height: 110,
        alignItems: 'center'
    }
}

const mobileStyles = {

}

export default NavWelcomeHeader