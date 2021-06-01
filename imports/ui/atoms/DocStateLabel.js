import React, { Component } from 'react';
import { Label, Icon, Popup } from 'semantic-ui-react';

class DocStateLabel extends Component {

    render() {
        return (
            <Popup trigger={
                <Label style={{cursor:"pointer",placeSelf:"center",alignSelf:"center"}} color={this.props.color}>
                    <Icon style={{margin:"0"}} name='folder' />
                </Label>
            }>
                {this.props.title}
            </Popup>
        )
    }
}

export default DocStateLabel
