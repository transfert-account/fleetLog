import React, { Component, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';

export class FAFree extends Component {

    state={}
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    render() {return (
        <i style={{size:this.props.size}} className={"fafree "+ this.props.color + " " + this.props.code}></i>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(FAFree);