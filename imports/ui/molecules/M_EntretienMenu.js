import React, { Component, Fragment } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class M_EntretienMenu extends Component {

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
        <div style={Object.assign({display:"grid",gridTemplateColumns:"auto auto auto",gridGap:"32px"},this.props.style)}>
            <Menu fluid style={{cursor:"pointer",margin:"0"}} icon='labeled'>
                <Menu.Item color="blue" name='entretiens' active={this.props.active == "entretiens"} onClick={()=>{this.props.history.push("/entretien/entretiens")}}><Icon name='calendar alternate outline'/>Entretiens</Menu.Item>
                <Menu.Item color="blue" name='curatif' active={this.props.active == "curatif"} onClick={()=>{this.props.history.push("/entretien/controls/curatif")}}><Icon name='plus'/>Entretien curatif</Menu.Item>
                <Menu.Item color="blue" name='pieces' active={this.props.active == "pieces"} onClick={()=>{this.props.history.push("/entretien/pieces")}}><Icon name='cogs'/>Catalogue de pièces</Menu.Item>
            </Menu>
        </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(M_EntretienMenu);