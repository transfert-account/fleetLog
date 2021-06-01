import React, { Component, Fragment } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import TitleTile from '../atoms/TitleTile';

export class M_Menu extends Component {

    state={
        links:[
            {name:"Controls",url:"/entretien/controls/obli",icon:"fas fa-clipboard-list",color:"blue"},
            {name:"Controls",url:"/entretien/controls/prev",icon:"fas fa-clipboard-list",color:"blue"},
            {name:"Curatif",url:"/entretien/controls/curatif",icon:"fas fa-plus-square",color:"blue"},
            {name:"Pieces",url:"/entretien/pieces",icon:"fas fa-cogs",color:"blue"},
            {name:"Entretiens",url:"/entretien/entretiens",icon:"fas fa-tools",color:"blue"},
            {name:"Planning",url:"planning/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),icon:"far fa-calendar-alt",color:"blue"}
        ]
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {
        return (
            <div className="tiles" style={{width:"100%",display:"flex",placeSelf:"stretch",flexWrap:"wrap"}}>
                {this.state.links.map(l=>
                    <TitleTile key={l.url} tile={l}/>
                )}
            </div>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withRouter(withUserContext(M_Menu));