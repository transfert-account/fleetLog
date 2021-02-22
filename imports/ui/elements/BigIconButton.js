import React, { Component } from 'react'
import { Popup, Button } from 'semantic-ui-react';
import _ from 'lodash';

class BigIconButton extends Component {    

    onClick = () => {
        this.props.onClick()
    }

    render(){
        return(
            <Popup content={this.props.tooltip} position='bottom center' trigger={<Button style={{margin:"2px 8px",marginRight:(this.props.spacedFromNext ? "28px" : ""),marginLeft:(this.props.spacedFromPrevious ? "24px" : ""),padding:"14px",minHeight:"60px"}} size="huge" onClick={this.onClick} color={this.props.color} icon={this.props.icon}/>} />
        )
    }
}

export default BigIconButton;