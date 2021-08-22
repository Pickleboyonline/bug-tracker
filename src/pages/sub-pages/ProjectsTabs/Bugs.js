import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';
import Popup from './../../../components/Popup';
import CreateBug from './../../../components/CreateBug';


class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div
                onClick={this.props.onClick}
                style={{
                    backgroundColor: 'grey',
                    height: 50,
                    marginTop: 10,
                    width: '80%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 5,
                    paddingLeft: 10
                }}>
                {this.props.title}
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCreatePopup: true,
            toggleViewBugPopup: false
        };

    }

    componentDidMount() {

    }

    toggleFunc = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
    }

    render() {
        return (
            <div>
                <div
                    onClick={() => this.toggleFunc('toggleCreatePopup')}
                    style={{
                        border: '1px solid black',
                        width: 100,
                        textAlign: 'center',
                        paddingTop: 5,
                        borderRadius: 5,
                        height: 30,
                        marginBottom: 20
                    }}>
                    Create New
                </div>

                {
                    this.state.toggleCreatePopup ?
                        <Popup
                            title="Submit New Bug"
                            toggleFunc={() => this.toggleFunc('toggleCreatePopup')}>
                            <CreateBug />
                        </Popup> : null
                }
                {
                    this.state.toggleViewBugPopup ?
                        <Popup
                            title="Bug #1"
                            toggleFunc={() => this.toggleFunc('toggleViewBugPopup')}>
                            <h1>
                                BUG
                            </h1>
                        </Popup> : null
                }

                <div>
                    <div>
                        Sorting Stuff
                    </div>
                    <ListItem
                        onClick={() => this.toggleFunc('toggleViewBugPopup')}
                        title={`bug1`} />
                    {
                        [0, 0, 0].map((val, ind) => <ListItem title={`bug${ind}`} />)
                    }

                </div>
            </div>
        );
    }
}


export default App;
