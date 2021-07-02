import React, { Component, Fragment } from 'react';
import { } from 'semantic-ui-react';
import WorkInProgress from './WorkInProgress';
import AdministrationMenu from '../molecules/AdministrationMenu';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class Scripts extends Component {

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
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr"}}>
        <div style={{display:"grid",marginBottom:"0",gridTemplateColumns:"auto 1fr", gridGap:"32px"}}>
          <AdministrationMenu active="scripts"/>
        </div>
        <WorkInProgress/>
      </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(Scripts);