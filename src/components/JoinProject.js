import React, { useState } from 'react'
import {
    Button, Input
    , Space, notification
} from 'antd'
import axios from 'axios';
import { getDefaultHeader } from './../pages/config';
import { getErrorMessage } from '../libraries/network-error-handling';

const JoinProject = (props) => {
    const [projectId, setProjectId] = useState('');

    const handleSubmit = async () => {

        let res;

        try {
            res = await axios.post('/project/join', {
                projectId
            }, {
                headers: getDefaultHeader()
            })
        } catch (e) {

            console.error(getErrorMessage(e))
            notification.error({
                message: getErrorMessage(e)
            })
            return
        }

        notification.success({
            message: 'You have joined project ' + res.data.project.title + '!'
        })
        props.updateProjects()
        setProjectId('');
        props.closeFunc();

    }

    return (
        <div>
            <Input
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Type project ID here..." />
            <Space style={{
                width: '100%',
                marginTop: 20,
                display: 'inline-flex',
                justifyContent: 'flex-end'
            }}>
                <Button onClick={() => {
                    setProjectId('');
                    props.closeFunc();

                }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    type='primary'>
                    Join
                </Button>
            </Space>
        </div>

    )
}

export default JoinProject