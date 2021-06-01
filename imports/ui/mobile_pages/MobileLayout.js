import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';

export class MobileLayout extends Component {

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
        <div id="mobile" className="pagebody" style={{margin:"0",height:"100vh",width:"100vw",display:"grid",gridTemplateRows:"1fr auto"}}>
            <div style={{placeSelf:'stretch',margin:"0",padding:"2rem",overflowY:"auto"}}>
                {this.props.children}
            </div>
            <div style={{placeSelf:"stretch",display:"grid",padding:"2rem"}}>
                <div style={{placeSelf:"center",display:"flex",justifyContent:"space-evenly"}}>
                    <Button size='big'></Button>
                    <Button size='massive' icon onClick={()=>this.props.history.push("/home")}><Icon name="th"/></Button>
                    <Button size='big' icon><Icon name="add"/></Button>
                </div>
            </div>
        </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withRouter(withUserContext(MobileLayout));