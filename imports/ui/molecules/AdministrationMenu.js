import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import _ from 'lodash';

class AdministrationMenu extends Component {

    state={
        menuItems : [
            {color:"blue",name:'comptes',uri:"/administration/accounts",icon:"users",label:"Comptes"},
            {color:"blue",name:'contenu',uri:"/administration/content",icon:"copy outline",label:"Contenu"},
            {color:"blue",name:'equipement',uri:"/administration/equipements",icon:"wrench",label:"Contrôles"},
            {color:"blue",name:'pieces',uri:"/administration/pieces",icon:"cogs",label:"Pièces"},
            {color:"blue",name:'patchnotes',uri:"/administration/patchnotes",icon:"clipboard list",label:"Notes de version"},
            {color:"blue",name:'documents',uri:"/administration/documents",icon:"file outline",label:"Documents S3"},
            {color:"red",name:'storage',uri:"/administration/storage",icon:"file outline",label:"Storage Management"}
        ]
    }
    /*,{color:"blue",name:'logs',uri:"/administration/logs",icon:"terminal",label:"Logs Server"}*/

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
  
export default withRouter(AdministrationMenu);