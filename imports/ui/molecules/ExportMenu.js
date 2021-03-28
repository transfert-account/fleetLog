import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import _ from 'lodash';

class ExportMenu extends Component {

    state={
        menuItems : [
            {color:"blue",name:'vehicles',uri:"/export/vehicles",icon:"truck",label:"Export Véhicules"},
            {color:"blue",name:'entretiens',uri:"/export/entretiens",icon:"wrench",label:"Export Entretiens"},
            {color:"blue",name:'sinistres',uri:"/export/sinistres",icon:"fire",label:"Export Sinistres"},
        ]
    }

    render() {
        return (
            <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                {this.state.menuItems.map(i=>{
                    return(
                        <Menu.Item key={i.uri} color={i.color} name={i.name} active={this.props.active == i.name} onClick={()=>{this.props.history.push(i.uri)}}>
                            <Icon name={i.icon}/>
                            {i.label}
                        </Menu.Item>
                    )
                })}
            </Menu>
        )
    }
}
  
export default withRouter(ExportMenu);