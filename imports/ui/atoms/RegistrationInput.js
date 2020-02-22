import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react';
import _ from "lodash";
class RegistrationInput extends Component {

    state = {
        input:(this.props.defaultValue == null ? "" : this.props.defaultValue ),
        formatEx: new RegExp(/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/im)
    }

    handleChange = e =>{
        let value = _.toUpper(e.target.value);
        let error = false;
        if(this.state.formatEx.test(value)){
            value = [value.slice(0, 2)," ", value.slice(2,5)," ", value.slice(5)].join('');
        }else{
            error = true
            value = value.split(" ").join("")
        }
        this.setState({
          input:value,
          error:error
        });
        this.props.onChange(value)
    }

    render() {
        return (
            <Form.Field style={this.props.style} error={this.state.error}>
                <label>Immatriculation</label>
                <input style={{textAlign:"center"}} value={this.state.input} onChange={this.handleChange} name="input"/>
            </Form.Field>
        )
    }
}

export default RegistrationInput;