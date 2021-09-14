import react from "react";
import { Input, message, Modal, Select } from "antd";
import axios from "axios";
import { getErrorMessage } from "../libraries/network-error-handling";
import { getDefaultHeader } from "../pages/config";

const { Option } = Select;
export default class CreateConversation extends react.Component {
    state = {
        members: [],
        selectedMember: '',
        query: '',
        body: ''
    }
    TOKEN = window.localStorage.getItem('token')

    searchUsers = async () => {
        let results;
        const { query } = this.state;
        try {
            results = await axios.get('http://localhost:1337/user/search', {
                params: {
                    query: query
                },
                headers: getDefaultHeader()
            })
        } catch (e) {
            console.error(getErrorMessage(e))

            return
        }

        //console.log(results.data)
        let newMembers = [];
        let users = results.data.results;
        for (let i = 0; i < users.length; i++) {
            newMembers.push({
                key: users[i].id,
                name: users[i].name,
                email: users[i].email,
                id: users[i].id
            })
        }
        this.setState({
            members: newMembers
        })
    }

    selectUser = (value) => {
        this.setState({
            selectedMember: value
        })
    }

    sendMessage = async () => {
        if (this.state.body.replace(/ /g, "") === '') {
            message.error("Please enter message")
            return
        };

        if (!this.state.selectedMember) {
            message.error("Please select a recipient")
            return
        }

        try {
            let { data } = await axios.post('http://localhost:1337/message/' + this.state.selectedMember, {
                body: this.state.body
            }, {
                headers: getDefaultHeader()
            })
            // let { messages } = this.state;
            // messages.push(data.message);
            this.setState({

                body: ''
            })
            console.log(data.message.conversation)
            await this.props.fetchConversations()
            this.props.selectConversation(data.message.conversation)
            this.props.closeModal()
        } catch (e) {
            console.error(getErrorMessage(e))
        }
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                title='Send New Message'
                onCancel={this.props.closeModal}
                onOk={this.sendMessage}
                destroyOnClose
            >
                <p>Send To:</p>
                <Select
                    showSearch
                    placeholder={"search..."}
                    style={{ width: '100%' }}
                    filterOption={false}
                    onSearch={(e) => {
                        this.setState({
                            query: e
                        }, this.searchUsers)
                    }}
                    onChange={this.selectUser}

                >
                    {this.state.members.map(doc => <Option key={doc.id}>{`${doc.name} (${doc.email})`}</Option>)}
                </Select>
                <br />
                <p style={{ marginTop: 20 }}>Message:</p>
                <Input
                    onChange={(e) => this.setState({ body: e.target.value })}
                    value={this.state.body}
                    onPressEnter={this.sendMessage}
                    placeholder='Start typing...'
                />
            </Modal>
        )
    }
}