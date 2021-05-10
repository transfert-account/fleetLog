import React, { Component } from 'react';
import { } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import FAFree from '../elements/FAFree';

export class TitleTile extends Component {

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
        <div onClick={()=>{this.props.history.push(this.props.tile.url)}} className={"tile " + this.props.tile.color}>
            <div className="outter">
                <div className="inner">
                    <FAFree code={this.props.tile.icon} color={this.props.tile.color}/>
                </div>
            </div>
            <h2>{this.props.tile.name}</h2>
        </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(TitleTile);