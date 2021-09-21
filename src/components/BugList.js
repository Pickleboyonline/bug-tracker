import { List, Popconfirm, } from 'antd'
import moment from "moment"
import { withRouter } from 'react-router-dom'

function BugList(props) {
    const {
        page,
        totalBugCount,
        _handlePaginationChange,
        bugs,
        isMobile,
        viewBug,
        shareBug,
        deleteBug
    } = props;

    const actions = item => [
        <a
            style={{
                margin: 10
            }}
            key="list-loadmore-edit"
            onClick={(e) => viewBug(e, item)}>
            view
        </a>,
        <a
            style={{
                margin: 10
            }}
            key="list-loadmore-edit"
            onClick={(e) => shareBug(e, item)}>
            share
        </a>,
        <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteBug(item.id)}
        >
            <a

                key="list-loadmore-edit"
                style={{ color: 'red', marginLeft: 10 }}
                onClick={(e) => {

                    e.preventDefault()
                }}>
                delete
            </a>
        </Popconfirm>
    ]


    return (<>
        {isMobile && <style>{`
    #bugg-bugs-list .ant-list-item-action {
        justify-content: space-evenly;
    display: inline-flex;
    width: 100%;
    }
    `}</style>}
        <List
            // className="demo-loadmore-list"
            style={{
                maxWidth: 1000
            }}
            id="bugg-bugs-list"
            pagination={{
                // style={{ float: 'right', marginTop: 20 }}
                current: page,
                defaultCurrent: 1,
                total: totalBugCount,
                onChange: _handlePaginationChange
            }}
            // loading={initLoading}
            // itemLayout="horizontal"
            itemLayout={isMobile ? 'vertical' : 'horizontal'}
            // loadMore={loadMore}
            dataSource={bugs}
            renderItem={item => (
                <List.Item
                    key={item.id}
                    actions={actions(item)}

                >

                    <List.Item.Meta

                        title={<div style={{
                            display: 'inline'
                        }}>
                            <a href="#" onClick={(e) => viewBug(e, item)}>
                                {item.title}
                            </a>

                        </div>}

                        description={item.plainTextDescription}
                    />
                    <div>{'Last modified ' + moment(new Date(item.updatedAt)).fromNow()}</div>

                </List.Item>
            )}
        />
    </>
    )
}

export default withRouter(BugList)