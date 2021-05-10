import React, { Component, Fragment } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ParcMenu extends Component {

    state={}
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='vehicules' active={this.props.active == "vehicles"} onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
            <Menu.Item color="blue" name='locations' active={this.props.active == "locations"} onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="truck"/> Locations</Menu.Item>
            <Menu.Item color="blue" name='licences' active={this.props.active == "licences"} onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
        </Menu>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(ParcMenu);