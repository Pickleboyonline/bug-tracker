import React from 'react';
import BugDissussion from '../../../components/BugDiscussion';
import BugStats from '../../../components/BugStats';
import BugAssignedTo from '../../../components/BugAssignedTo';
import BugDescription from '../../../components/BugDescription';
import BugFiles from './../../../components/BugFiles';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }



    render() {

        return (
            <div>

                <BugStats bugId={this.props.bug.id} bug={this.props.bug} />


                <BugDescription bug={this.props.bug} description={this.props.bug.description} />

                <BugFiles bug={this.props.bug} />

                <BugAssignedTo bug={this.props.bug} />

                <BugDissussion bug={this.props.bug} />

            </div>
        );
    }
}


export default App;
