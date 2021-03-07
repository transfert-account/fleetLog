import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

export class BooleanDropdown extends Component {

    state={
        options : [
            { key: 'Oui', text: 'Oui', value: "Oui", label: { color: 'green', empty: true, circular: true }},
            { key: 'Non', text: 'Non', value: "Non", label: { color: 'red', empty: true, circular: true }}
        ]
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    handleChange = (e, { value }) => {
        this.props.onChange(value)
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Dropdown onChange={this.handleChange} defaultValue={this.props.defaultValue} disabled={this.props.disabled} style={this.props.style} button clearable options={this.state.options} selection />
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(BooleanDropdown);