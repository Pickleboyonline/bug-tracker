import React from 'react';
import {
    Button,
    Space,
    Menu,

    Divider,
    Empty,
    Avatar,
    List,
    Tag,
    Input,
    Modal,

    Spin,
    notification,
    Drawer
} from 'antd';
import {
    withRouter,

} from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import CreateAnnouncement from '../../../components/CreateAnnouncement';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import bugg from '../../../libraries/bugg';
import { getErrorMessage, logErrorMessage } from '../../../libraries/network-error-handling';
import { getDefaultHeader } from '../../config';



const { Search } = Input;

function Message(props) {
    if (props.announcement === null) return null;
    return (<><div style={{
        display: 'inline-flex',
        alignItems: 'center'
    }}>
        <Avatar size={64}
            style={{
                marginRight: 20
            }}
            icon={<UserOutlined />} />
        <span>
            <p style={{
                margin: 0,
                fontSize: 18
            }}>
                <b>{props.announcement.submitter.name}</b>
            </p>
            <p style={{
                margin: 0
            }}>
                Director
            </p>
        </span>
        <span>
            <Button type="text" style={{
                color: '#1890ff',
                marginLeft: 20
            }}>Reply</Button>
        </span>
    </div>
        <Divider />
        <h1>
            {props.announcement.title}
        </h1>
        <p
            dangerouslySetInnerHTML={{ __html: props.announcement.body }}
            style={{ maxWidth: 700 }}>

        </p></>
    )
}

class App extends React.Component<any, any, unknown> {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            createAnnouncement: false,
            selectedAnnouncement: null,
            announcements: [],
            total: 0,
            loading: false,
            search: '',
            sortBy: '',
            hasMore: true,
            firstLoad: true
        };

    }

    // Fetch initial annoncements and data
    async componentDidMount() {
        // await (new Promise((res) => this.setState({ loading: true }, res)))
        // await this.fetchAndSetAnnouncements();
        // this.setState({ loading: false })
        this.handleOpenAnnouncement()
    }

    componentDidUpdate(prevProps) {
        const locationChanged = this.props.location !== prevProps.location;
        if (locationChanged) {
            this.fetchAndSetAnnouncements(true)
            //this.setState({selectedAnnouncement: null}, )
            this.handleOpenAnnouncement()

        }
        let uriProjectId = this.props.location.pathname.split('/');
        uriProjectId = uriProjectId[uriProjectId.length - 1]
        if (this.state.selectedAnnouncement && uriProjectId !== this.state.selectedAnnouncement.project) {
            this.setState({ selectedAnnouncement: null })
        }
    }

    formatName = (name) => {
        var nameSegments = name.split(' ');
        let shortHandName = nameSegments[0];

        if (nameSegments[1]) {
            shortHandName += ' ' + nameSegments[1].substring(0, 1).toUpperCase() + '.'
        }

        return shortHandName
    }

    handleOpenAnnouncement = async () => {
        const { location } = this.props;
        let query = new URLSearchParams(location.search)
        if (query.get('action') === 'OPEN_ANNOUNCEMENT' && query.has('announcementId')) {
            try {

                let announcement = await bugg.Announcement.getAnnouncement(query.get('announcementId'));

                if (!announcement) throw new Error('Announcement not found')

                this.props.history.push(location.pathname);

                this.setState({
                    selectedAnnouncement: announcement
                })
                this.fetchAndSetAnnouncements()
            } catch (e) {
                notification.error({
                    message: getErrorMessage(e)
                })
            }
        } else {

        }

    }

    // fetch announcemnents, set data, and total that match the query
    // will append new announcemnts
    // DOES NOT CHANGE LOADING STATE
    // Will query for 20 at a time
    fetchAndSetAnnouncements = async (resetList?: boolean) => {
        // await (new Promise((res) => setTimeout(res, 2000)))
        const { announcements, search, sortBy } = this.state
        let skip = announcements.length;
        if (resetList) {
            skip = 0;
            // await (new Promise((res) => this.setState({ hasMore: true }, res)))
        }
        const limit = 5;

        try {
            let uriProjectId = this.props.location.pathname.split('/');
            uriProjectId = uriProjectId[uriProjectId.length - 1]
            let { data } = await axios.get('/announcement/', {
                headers: getDefaultHeader(),
                params: {
                    projectId: uriProjectId,
                    limit,
                    skip,
                    search,
                    sortBy
                }
            });
            console.log(data);
            let newAnnouncements;

            if (resetList) {
                newAnnouncements = data.announcements
            } else {
                newAnnouncements = [...announcements, ...data.announcements]
            }
            this.setState({
                total: data.total,
                announcements: newAnnouncements,
                hasMore: true
            })
        } catch (e) {
            logErrorMessage(e)
        }
    }

    onSearch = async (search) => {
        let resetList = false;
        if (search !== this.state.search) resetList = true;

        this.setState({
            search,
        }, () => this.fetchAndSetAnnouncements(resetList))
    }

    handleInfiniteLoad = async () => {
        // console.log('EXEC')
        let { announcements, total, firstLoad } = this.state;

        this.setState({ loading: true })
        console.log('State: ')
        console.log(this.state)
        if (announcements.length === total && firstLoad === false) {
            // message.warning('All announcements are loaded')
            this.setState({
                hasMore: false,
                loading: false
            })
            return
        }
        console.log('EXEC')
        await this.fetchAndSetAnnouncements();
        this.setState({
            loading: false,
            firstLoad: false
        })
    }

    toggleState = (name) => this.setState({ [name]: !this.state[name] })

    render() {
        return (
            <MediaQuery maxWidth={800}>
                {(isMobile) =>
                    <div>

                        <Modal
                            title="Create New Announcement"
                            visible={this.state.createAnnouncement}
                            destroyOnClose
                            footer={null}
                            style={{
                                width: isMobile ? '90%' : 800
                            }}
                            //width={800}
                            onCancel={() => this.toggleState('createAnnouncement')}
                            onOk={() => this.toggleState('createAnnouncement')}>
                            <CreateAnnouncement
                                project={this.props.project}
                                closeModal={() => this.toggleState('createAnnouncement')}
                                updateList={() => this.fetchAndSetAnnouncements(true)}
                            />
                        </Modal>
                        <div style={{
                            marginBottom: 20,
                            gap: 6,
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}>
                            <Button
                                onClick={() => this.toggleState('createAnnouncement')}
                                type='primary'>
                                New Announcement
                            </Button>
                            <Button
                                onClick={() => this.fetchAndSetAnnouncements(true)}
                            >
                                Refresh
                            </Button>
                            <Search placeholder="search"
                                onChange={(e) => this.onSearch(e.target.value)}
                                onSearch={(search) => this.onSearch(search)} style={{ width: 200 }} />
                        </div>

                        <style>{`
.bugg-list-item-button-321312312:hover {
    background-color: rgb(0 0 0 / 5%);
    cursor: pointer;
}
.bugg-list-item-button-321312312 {
    background-color: white;
}
`}</style>
                        <div style={{
                            display: isMobile ? 'flex' : 'inline-flex',
                            flexDirection: isMobile ? 'column' : 'unset',
                            marginRight: isMobile ? 10 : 'unset'
                        }}>
                            <div
                                style={{
                                    borderColor: 'rgba(0,0,0,.2)',
                                    // backgroundColor: 'rgba(0,0,0,.1)',
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    width: isMobile ? 'unset' : 360,
                                    height: 600,
                                    overflowY: 'auto',
                                    overflowClipBox: 'content-box'
                                }}
                            >


                                <InfiniteScroll
                                    initialLoad={true}

                                    // threshold={10}
                                    pageStart={0}
                                    loadMore={this.handleInfiniteLoad}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={this.state.announcements}
                                        renderItem={(item: any) => (

                                            <List.Item
                                                key={item.id}
                                                className="bugg-list-item-button-321312312"
                                                onClick={() => {
                                                    this.setState({
                                                        selectedAnnouncement: item
                                                    })
                                                }}
                                            >
                                                <List.Item.Meta

                                                    avatar={<Avatar
                                                        style={{
                                                            marginLeft: 20,
                                                            marginTop: 9
                                                        }}
                                                    >{item.submitter.name.substring(0, 1).toUpperCase()}</Avatar>}
                                                    title={<>
                                                        <a
                                                            style={{
                                                                marginRight: 10
                                                            }}
                                                            onClick={e => e.preventDefault()}
                                                            href="#">

                                                            {this.formatName(item.submitter.name)}
                                                        </a>
                                                        <Tag color='#f50'>OWNER</Tag>
                                                        <span
                                                            style={{
                                                                float: 'right',
                                                                marginRight: 20,
                                                                opacity: .8
                                                            }}>
                                                            {moment(new Date(item.createdAt)).format('LT')}
                                                        </span>
                                                    </>}

                                                    description={item.plainTextBody}
                                                />
                                            </List.Item>


                                        )}
                                    />
                                    {this.state.loading && this.state.hasMore && (
                                        <div className="demo-loading-container">
                                            <Spin />
                                        </div>
                                    )}
                                </InfiniteScroll>
                            </div>
                            <style>{`
                    .demo-loading-container {
                        position: relative;
                        bottom: 0px;
                        background-color: white;
                        width: 100%;
                        text-align: center;
                      }
                    `}</style>
                            {!isMobile &&
                                <div style={{
                                    flex: 1,
                                    marginLeft: 20,
                                    width: 600,
                                    minHeight: 600
                                }}>
                                    {this.state.selectedAnnouncement === null ?
                                        <Empty style={{
                                            marginTop: 100
                                        }}
                                            description="Select an announcement to view"
                                        /> :
                                        <Message announcement={this.state.selectedAnnouncement} />
                                    }
                                </div>}
                            {isMobile &&
                                <Drawer
                                    visible={this.state.selectedAnnouncement !== null}
                                    onClose={() => this.setState({ selectedAnnouncement: null })}
                                    destroyOnClose
                                    width="90%"
                                    title="View Announcement"
                                //drawerStyle={{ width: '100%' }}
                                >
                                    <Message announcement={this.state.selectedAnnouncement} />
                                </Drawer>}
                        </div>
                    </div>
                }
            </MediaQuery>
        );
    }
}


export default withRouter(App);
