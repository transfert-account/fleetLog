import React, { Component } from 'react'
import { Form } from 'semantic-ui-react';
import _ from "lodash";
class HexColorCodeInput extends Component {

    state = {
        formatEx: new RegExp(/^((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/im)
    }
    
    render() {
        return (
            <Form.Field style={this.props.style} error={this.state.error}>
                <label>Code Héxadécimal de la couleur</label>
                <input onFocus={this.props.onFocus} style={{textAlign:"center"}} value={this.props.color} onChange={this.handleChange} name="input"/>
            </Form.Field>
        )
    }
}

export default HexColorCodeInput;