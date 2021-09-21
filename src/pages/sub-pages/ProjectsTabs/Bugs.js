import React from 'react';
import {
    withRouter,

} from "react-router-dom";

import CreateBug from './../../../components/CreateBug';
import { Button, message, Modal, notification } from 'antd';
import {
    List, Skeleton,
    Menu, Dropdown, Switch as AntSwitch, Space, Drawer,
    Input, Pagination,
    Popconfirm
} from 'antd';
import {
    CalendarOutlined,
    DownOutlined,
    FontSizeOutlined,
    FileSyncOutlined,

} from '@ant-design/icons';
import ViewBug from './ViewBug';
import axios from 'axios';
import MediaQuery from 'react-responsive'
import BugList from './../../../components/BugList';
import bugg from '../../../libraries/bugg';
import { getErrorMessage, logErrorMessage } from '../../../libraries/network-error-handling';
import { getDefaultHeader, staticServerUrl } from '../../config';

const { Search } = Input;



const selectedColor = '#1890ff';



const menu = (props) => (
    <Menu

        onClick={props.handleChange}>
        <Menu.Item key="1"

            icon={<CalendarOutlined style={{
                color: props.selectedSort === '1' ? selectedColor : 'unset'
            }}
            />}
        >
            <span style={{
                color: props.selectedSort === '1' ? selectedColor : 'unset'
            }}>
                Upload Date
            </span>
        </Menu.Item>
        <Menu.Item key="2" icon={<FontSizeOutlined style={{
            color: props.selectedSort === '2' ? selectedColor : 'unset'
        }} />}>
            <span style={{
                color: props.selectedSort === '2' ? selectedColor : 'unset'
            }}>
                Title
            </span>

        </Menu.Item>
        <Menu.Item key="3" icon={<FileSyncOutlined style={{
            color: props.selectedSort === '3' ? selectedColor : 'unset'
        }} />}>
            <span style={{
                color: props.selectedSort === '3' ? selectedColor : 'unset'
            }}>
                Last Modified
            </span>

        </Menu.Item>
    </Menu>
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCreatePopup: false,
            toggleViewBugPopup: false,
            toggleDrawer: false,
            totalBugCount: 0,
            pageSize: 10,
            searchQuery: '',
            sortBy: '',
            page: 1,
            bugs: [],
            selectedSort: '0',
            checked: true,
            selectedBug: null,
            selectedBugTitle: '',
            search: ''
        };

    }

    componentDidMount() {
        this.fetchBugs()
        this.handleActionUri()

    }

    _handlePaginationChange = (page, pageSize) => {
        if (page === this.state.page && pageSize === this.state.pageSize) return;
        this.setState({
            page,
            pageSize
        }, this.fetchBugs)

    }

    deleteBug = async (bugId) => {
        try {
            await bugg.Bug.deleteBug(bugId);
            this.fetchBugs()
            message.success("Bug was deleted")
        } catch (e) {
            message.error('Bug could not be deleted: ' + getErrorMessage(e))
        }
    }

    fetchBugs = async () => {
        let id = this.props.location.pathname.split('/');
        id = id[id.length - 1];
        let { pageSize, page, search } = this.state;

        if (search) {
            page = 1
        } else {
            search = undefined
        }

        let order;
        let sortBy;
        let { selectedSort, checked } = this.state;
        if (selectedSort === '1') {
            sortBy = 'upload-date'
        } else if (selectedSort === '2') {
            sortBy = 'title'
        } else if (selectedSort === '3') {
            sortBy = 'last-modified'
        }
        if (selectedSort !== '0') {
            if (checked) {
                order = 'ASC'
            } else {
                order = 'DESC'
            }
        }

        try {
            let { data } = await axios.get('/bug/all', {
                headers: getDefaultHeader(),
                params: {
                    projectId: id,
                    limit: pageSize,
                    skip: pageSize * (page - 1),
                    search,
                    sortBy,
                    order
                }
            });
            //console.log(data)
            this.setState({
                bugs: data.bugs,
                totalBugCount: data.total,
                page
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }

    /**
     * Opens bug based on bug Id (fetches from server)
     * @param {string} bugId 
     */
    openBug = async (bugId) => {
        try {
            let bug = await bugg.Bug.getBug(bugId);
            if (!bug) throw new Error('Bug not found')
            this.props.history.push(this.props.location.pathname)
            this.setState({
                selectedBug: bug,
                toggleDrawer: true,
                selectedBugTitle: bug.title
            })
        } catch (e) {
            notification.error({
                message: getErrorMessage(e)
            })
        }
    }

    handleActionUri = () => {
        const { location } = this.props;
        let query = new URLSearchParams(location.search)
        if (query.get('action') === 'OPEN_BUG' && query.get('bugId') !== null) {
            this.openBug(query.get('bugId'))
        }
    }

    toggleFunc = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }

    _handleSortChange = (obj) => {
        //console.log(obj)
        if (obj.key === this.state.selectedSort) {
            this.setState({
                selectedSort: '0',
                page: 1
            }, this.fetchBugs)
        } else {
            this.setState({
                selectedSort: obj.key,
                page: 1
            }, this.fetchBugs)
        }
    }

    componentDidUpdate(prevProps) {
        const locationChanged = this.props.location !== prevProps.location;
        if (locationChanged) {
            let id = this.props.location.pathname.split('/');
            id = id[id.length - 1];
            this.setState({
                search: '',
                page: 1
            }, this.fetchBugs)

            // parse action from url
            this.handleActionUri()
        }
    }

    render() {

        var listData = [];

        for (let i = 0; i < 10; i++) {
            listData.push({ bugId: 'y938cbu9', title: 'Videos will not play', state: 'priority', loading: false })
        }
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <div>
                        <div style={{
                            marginBottom: 20,
                            gap: 6,
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            <Button

                                type="primary" onClick={() => this.toggleFunc('toggleCreatePopup')}>Submit New</Button>
                            <Button
                                onClick={this.fetchBugs}
                            >
                                Refresh
                            </Button>

                            <Search
                                value={this.state.search}
                                placeholder="Search"
                                onChange={(e) => {
                                    this.setState({
                                        search: e.target.value
                                    }, this.fetchBugs)
                                }}
                                onSearch={(e) => {
                                    this.fetchBugs()
                                }} style={{ width: 200 }} />

                            <Dropdown overlay={menu({
                                selectedSort: this.state.selectedSort,
                                handleChange: this._handleSortChange
                            })}>
                                <Button>
                                    Sort By <DownOutlined />
                                </Button>
                            </Dropdown>
                            {
                                this.state.selectedSort !== '0' ?
                                    <AntSwitch
                                        checkedChildren="ASC"
                                        unCheckedChildren="DESC"
                                        defaultChecked
                                        onChange={(checked) => {

                                            this.setState({
                                                page: 1,
                                                checked
                                            }, this.fetchBugs)

                                        }}
                                    />
                                    : null
                            }

                        </div>

                        <Modal
                            destroyOnClose
                            title="Submit New Bug"
                            visible={this.state.toggleCreatePopup}
                            // onOk={() => this.toggleFunc('toggleCreatePopup')}
                            width={900}
                            footer={null}
                            onCancel={() => this.toggleFunc('toggleCreatePopup')}>
                            <CreateBug
                                _handleListUpdate={this.fetchBugs}
                                toggleFunc={() => this.toggleFunc('toggleCreatePopup')}
                            />
                        </Modal>

                        {
                            // Bug list
                        }
                        <div style={{
                            marginRight: isMobile ? 10 : 64
                        }}>


                            <BugList
                                page={this.state.page}
                                totalBugCount={this.state.totalBugCount}
                                _handlePaginationChange={this._handlePaginationChange}
                                bugs={this.state.bugs}
                                isMobile={isMobile}
                                viewBug={(e, item) => {
                                    this.setState({
                                        toggleDrawer: true,
                                        selectedBugTitle: item.title,
                                        selectedBug: item
                                    })
                                    e.preventDefault()
                                }}
                                shareBug={async (e, item) => {
                                    e.preventDefault()
                                    let textToCopy = staticServerUrl + '/dashboard/projects/' + item.project + '?action=OPEN_BUG&bugId=' + item.id;
                                    if (navigator.clipboard) {
                                        await navigator.clipboard.writeText(textToCopy);
                                        message.success('Link copied to clipboard!')
                                    } else {
                                        window.Clipboard.copy(textToCopy)
                                        message.success('Link copied to clipboard!')
                                    }

                                }}
                                deleteBug={this.deleteBug}

                            />

                        </div>
                        <Drawer
                            width={isMobile ? '100%' : 800}
                            title={this.state.selectedBugTitle}
                            placement="right"
                            closable={true}
                            onClose={() => {
                                this.fetchBugs();
                                this.setState({ toggleDrawer: false })
                            }}
                            visible={this.state.toggleDrawer}
                            destroyOnClose
                        >
                            <ViewBug bug={this.state.selectedBug} />
                        </Drawer>


                    </div>
                }
            </MediaQuery>
        );
    }
}

// Safari copy to clipboard fix
window.Clipboard = (function (window, document, navigator) {
    var textArea,
        copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function (text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);


export default withRouter(App);
