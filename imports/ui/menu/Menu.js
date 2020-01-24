import React, { Component } from 'react'
import MenuItemList from './MenuItemList';
import { Link,withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Icon, Dropdown } from 'semantic-ui-react';

class Menu extends Component {

  state={
    width:"200px",
    collapseIcon:"angle double left",
    collapsed:false,
    menuItems:[
      {
        name:"parc/vehicles",
        active:"parc",
        label:"Parc",
        display:true,
        icon:"truck"
      },
      {
        name:"entretiens",
        active:"entretiens",
        label:"Entretiens",
        display:true,
        icon:"clipboard check"
      },
      {
        name:"planning/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),
        active:"planning",
        label:"Planning",
        display:true,
        icon:"calendar"
      },
      {
        name:"batiment",
        active:"batiment",
        label:"Batiment",
        display:true,
        icon:"warehouse"
      },
      {
        name:"fournisseurs",
        active:"fournisseurs",
        label:"Fournisseurs",
        display:true,
        icon:"sitemap"
      },
      {
        name:"accidentologie",
        active:"accidentologie",
        label:"Accidentologie",
        display:true,
        icon:"fire"
      }
    ],
    menuItemsAdmin:[
      {
        name:"parc/vehicles",
        active:"parc",
        label:"Parc",
        display:true,
        icon:"truck"
      },
      {
        name:"entretiens",
        active:"entretiens",
        label:"Entretiens",
        display:true,
        icon:"clipboard check"
      },
      {
        name:"planning/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),
        active:"planning",
        label:"Planning",
        display:true,
        icon:"calendar"
      },
      {
        name:"batiment",
        active:"batiment",
        label:"Batiment",
        display:true,
        icon:"warehouse"
      },
      {
        name:"fournisseurs",
        active:"fournisseurs",
        label:"Fournisseurs",
        display:true,
        icon:"sitemap"
      },
      {
        name:"accidentologie",
        active:"accidentologie",
        label:"Accidentologie",
        display:true,
        icon:"fire"
      },
      {
        name:"compte",
        active:"compte",
        label:"Compte",
        display:true,
        icon:"user"
      },
      {
        name:"administration/accounts",
        active:"administration",
        label:"Administration",
        display:true,
        icon:"key"
      }
    ]
  }

  getMenuItemsList = () =>{
    if(this.props.user.isAdmin){
        return (this.state.menuItemsAdmin);
    }else{
        return (this.state.menuItems);
      }
  }

  render() {
    if(this.props.collapsed){
      return (
        <div style={{
          width:"80px",
          height:"100vh",
          position:"fixed",
          display:"inline-block",
          backgroundImage:"linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
          boxShadow:"1px 0 5px black"
        }}>
          <ul style={{marginTop:"16px",padding:"0",listStyle:"none",textAlign:"center"}}>
            <Icon link size="big" style={{cursor:"pointer",marginBottom:"16px"}} name="angle double right" onClick={this.props.setMenuCollapse}/>
            <Link to={"/"} style={{ textDecoration: 'none' }}>
              <li style={{cursor:"pointer"}} name="avatarWrapper">
                <img alt="homeLogo" style={{width:"48px"}} src='/res/topMenu.png'/>
              </li>
            </Link>
            <hr style={{width:"80%",margin:"16px auto"}}/>
            <MenuItemList collapsed={this.props.collapsed} menuItems={this.getMenuItemsList()}/>
            <li onClick={()=>{Meteor.logout();this.props.client.resetStore();this.props.history.push("/")}} style={{cursor:"pointer"}}>
              <Icon link size="large" style={{cursor:"pointer",margin:"0"}} name="power off" color="red"/>
            </li>
          </ul>
        </div>
      )
    }else{
      return(
        <div style={{
          width:"200px",
          height:"100vh",
          position:"fixed",
          display:"inline-block",
          backgroundImage:"linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)",
          boxShadow:"1px 0 5px black"
        }}>
          <ul style={{marginTop:"16px",padding:"0",listStyle:"none",textAlign:"center"}}>
            <Icon link size="big" style={{cursor:"pointer",marginBottom:"16px"}} name="angle double left" onClick={this.props.setMenuCollapse}/>
            <Link to={"/"} style={{ textDecoration: 'none' }}>
              <li style={{cursor:"pointer"}} name="avatarWrapper">
                <img alt="homeLogo" style={{width:"128px"}} src='/res/topMenu.png'/>
              </li>
            </Link>
            <hr style={{width:"80%",margin:"16px auto"}}/>
            <MenuItemList menuItems={this.getMenuItemsList()}/>
            <li onClick={()=>{Meteor.logout();this.props.client.resetStore();this.props.history.push("/")}} className={"menuItemRed"} style={{cursor:"pointer"}}>
              <p style={{textAlign:"right",padding:"8px 16px 8px 0",fontSize:"1.1em",fontWeight:"800",fontFamily: "'Open Sans', sans-serif"}}>
                DECONNEXION
              </p>
            </li>
          </ul>
        </div>
      )
    }
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Menu));