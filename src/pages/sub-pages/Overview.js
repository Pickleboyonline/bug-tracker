import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Chart from 'chart.js/auto';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false
        };

    }

    componentDidMount() {
        var ctx = document.getElementById('pieChart').getContext('2d');
        var pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <h1>
                    Overview Widgets & Stuff
                </h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderColor: 'rgba(0,0,0,.2)',
                    borderRadius: 10,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    padding: 20,
                    flexDirection: 'column',
                    width: 450
                }}>
                    <h3 style={{ textAlign: 'center' }}>Bugs Progress</h3>
                    <div style={{ width: 400, height: 400 }}>
                        <canvas id="pieChart" width="400" height="400"></canvas>
                    </div>

                </div>

            </React.Fragment>

        );
    }
}


export default App;
