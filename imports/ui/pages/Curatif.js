
import React, { Component } from 'react';
import { Modal, Button, Form, Message } from 'semantic-ui-react';
import BigButtonIcon from '../elements/BigIconButton';
import EntretienMenu from '../molecules/EntretienMenu';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class Curatif extends Component {

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
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
        <div style={{display:"flex",flexDirection:"column",justifyContent:"start",placeSelf:"stretch"}}>
          <EntretienMenu active="curatif"/>
        </div>
      </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(Curatif);