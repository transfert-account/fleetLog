import React, { Component, Fragment } from 'react';
import { } from 'semantic-ui-react';
import ExportMenu from '../molecules/ExportMenu';
import WorkInProgress from './WorkInProgress'
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ExportCausesSinistres extends Component {

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
      <div style={{display:"grid",gridTemplateRows:'auto 1fr',gridTemplateColumns:"1fr",gridGap:"32px 64px",height:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <ExportMenu active="causes-sinistres"/>
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
export default wrappedInUserContext = withUserContext(ExportCausesSinistres);