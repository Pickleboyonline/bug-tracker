import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { Calendar } from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false
        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <div style={{
                    width: 800
                }}>
                    <Calendar />
                </div>

            </div>
        );
    }
}


export default App;
