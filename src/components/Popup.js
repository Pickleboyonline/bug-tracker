import React from 'react';



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


            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,.7)',
                zIndex: 100,
            }}>
                <div style={{
                    minWidth: 500,
                    minHeight: 500,
                    borderRadius: 5,
                    backgroundColor: 'white',
                    boxShadow: '0px 0px 10px 3px #00000033'
                }}>
                    <div style={{
                        borderWidth: 0,
                        borderColor: 'rgba(0,0,0,.2)',
                        borderBottomWidth: 1,
                        borderStyle: 'solid',
                        width: '100%',
                        height: 64,
                        display: 'inline-flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',

                    }}>
                        <h1
                            onClick={this.props.toggleFunc}
                            style={{ marginLeft: 20 }}>
                            X
                        </h1>
                        <p>
                            {this.props.title}
                        </p>
                    </div>
                    <div style={{
                        padding: 20
                    }}>
                        {
                            this.props.children
                        }
                    </div>

                </div>

            </div>


        );
    }
}


export default App;
