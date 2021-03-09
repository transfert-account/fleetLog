import React, { Component } from 'react';
import { } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import TitleTile from '../atoms/TitleTile';

export class Title extends Component {

    state={
      tiles:[
        {
          name:"Indicateurs",
          icon:"fas fa-chart-line",
          color:"blue",
          url:"/kpi"
        },
        {
          name:"Parc",
          icon:"fas fa-truck",
          color:"blue",
          url:"/parc/vehicles"
        },
        {
          name:"Contrôles",
          icon:"fas fa-clipboard-check",
          color:"blue",
          url:"/parc/controls"
        },
        {
          name:"Entretiens",
          icon:"fas fa-tools",
          color:"blue",
          url:"/entretiens"
        },
        {
          name:"Accidentologie",
          icon:"fas fa-car-crash",
          color:"blue",
          url:"/accidentologie"
        },
        {
          name:"Exports",
          icon:"far fa-file-excel",
          color:"blue",
          url:"export/vehicles"
        }
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

    render() {return (
      <div className="title">
        <p className="text">WG PARC MANAGER</p>
        <div className="tiles">
          {this.state.tiles.map(t=><TitleTile tile={t}/>)}
        </div>
      </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(Title);