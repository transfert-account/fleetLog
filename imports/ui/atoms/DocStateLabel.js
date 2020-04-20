import React, { Component } from 'react';
import { Label, Icon } from 'semantic-ui-react';

class DocStateLabel extends Component {

    state = {
        details:false
    }

    toggleDisplayDoc = () => {
        this.setState({
            details:!this.state.details
        })
    }
    
    render() {
        return (
            <Label style={{cursor:"pointer"}} onClick={this.toggleDisplayDoc} color={this.props.color} image={this.state.details}>
                <Icon style={{margin:"0"}} name='folder' />
                {(this.state.details ?
                    <Label.Detail>{this.props.title}</Label.Detail>
                    :
                    ""
                )}
            </Label>
        )
    }
}

export default DocStateLabel