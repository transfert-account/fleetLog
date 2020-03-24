import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

class PayementFormatPicker extends Component {

    state = {
        formats:[{
            triKey:"CPT",
            label:"Comptant"
        },{
            triKey:"CRC",
            label:"Crédit Classique"
        },{
            triKey:"CRB",
            label:"Crédit Bail"
        }]
    }

    render() {
        return (
            <Dropdown error={this.props.error} defaultValue={this.props.defaultValue} style={{marginLeft:"8px"}} onChange={(e,{value})=>{this.props.change(value)}} options={this.state.formats.map(f=>{return{key:f.triKey,text:f.label,value:f.triKey}})} selection/>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(PayementFormatPicker);