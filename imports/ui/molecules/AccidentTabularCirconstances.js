import React, { Component, Fragment } from 'react';
import { Segment } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import WorkInProgress from '../pages/WorkInProgress';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class AccidentTabularCirconstances extends Component {

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
      <Segment attached="bottom" style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr",gridTemplateRows:"1fr",placeSelf:"stretch",gridColumnEnd:"span 2"}}>
        <WorkInProgress/>
      </Segment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(AccidentTabularCirconstances);