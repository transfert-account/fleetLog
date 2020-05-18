/*BASICS*/
import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom';
/*CONTEXT*/
import { UserContext } from '../../contexts/UserContext';
/*ELEMENTS*/
import { DuoIcon } from '../elements/DuoIcon';
/*COMPONENTS*/
import NavbarItemList from './NavbarItemList';
import NavbarSocietePicker from '../atoms/NavbarSocietePicker';
import { Icon, Label } from 'semantic-ui-react';

class Menu extends Component {

  state={
    selectingSociete:false,
    menuItems:[
      {
        name:"",
        active:"home",
        label:"Accueil",
        display:true,
        icon:"home",
        color:"blue"
      },
      {
        name:"parc/vehicles",
        active:"parc",
        label:"Parc",
        display:true,
        icon:"truck",
        color:"blue"
      },
      {
        name:"entretiens",
        active:"entretiens",
        label:"Entretiens",
        display:true,
        icon:"garage",
        color:"blue"
      },
      {
        name:"planning/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),
        active:"planning",
        label:"Planning",
        display:true,
        icon:"calendar",
        color:"blue"
      },
      {
        name:"fournisseurs",
        active:"fournisseurs",
        label:"Fournisseurs",
        display:true,
        icon:"phone",
        color:"blue"
      },
      {
        name:"batiments",
        active:"batiments",
        label:"Batiments",
        display:true,
        icon:"warehouse",
        color:"blue"
      },
      {
        name:"accidentologie",
        active:"accidentologie",
        label:"Accidentologie",
        display:true,
        icon:"car-crash",
        color:"blue"
      },
      {
        name:"compte",
        active:"compte",
        label:"Compte",
        display:true,
        icon:"idcard",
        color:"blue"
      }
    ],
    menuItemsAdmin:[
      {
        name:"",
        active:"home",
        label:"Accueil",
        display:true,
        icon:"home",
        color:"blue"
      },
      {
        name:"parc/vehicles",
        active:"parc",
        label:"Parc",
        display:true,
        icon:"truck",
        color:"blue"
      },
      {
        name:"entretiens",
        active:"entretiens",
        label:"Entretiens",
        display:true,
        icon:"garage",
        color:"blue"
      },
      {
        name:"planning/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),
        active:"planning",
        label:"Planning",
        display:true,
        icon:"calendar",
        color:"blue"
      },
      {
        name:"fournisseurs",
        active:"fournisseurs",
        label:"Fournisseurs",
        display:true,
        icon:"phone",
        color:"blue"
      },
      {
        name:"batiments",
        active:"batiments",
        label:"Batiments",
        display:true,
        icon:"warehouse",
        color:"blue"
      },
      {
        name:"accidentologie",
        active:"accidentologie",
        label:"Accidentologie",
        display:true,
        icon:"car-crash",
        color:"blue"
      },
      {
        name:"compte",
        active:"compte",
        label:"Compte",
        display:true,
        icon:"idcard",
        color:"blue"
      },
      {
        name:"administration/accounts",
        active:"administration",
        label:"Administration",
        display:true,
        icon:"shieldcheck",
        color:"gold"
      }
    ]
  }

  handleSocieteFilterChange = (e, { value }) => this.props.setSocieteFilter(value)

  logout = () => {
    Meteor.logout();
    this.props.client.resetStore();
    this.props.history.push("/")
  }

  getMenuItemsList = () =>{
    if(this.props.user.isAdmin){
        return (this.state.menuItemsAdmin);
    }else{
        return (this.state.menuItems);
      }
  }

  showFilter = () => {
    this.setState({
      selectingSociete:true
    })
  }
  
  closeFilter = () => {
    this.setState({
      selectingSociete:false
    })
  }

  getFilterNavbarRow = () => {
    if(this.props.user.isOwner){
      return(
        <li className="nav-item" name="filter">
          <a href="#" className="nav-link" onClick={this.showFilter}>
            <DuoIcon name="filter" color="gold"/>
            <span className="link-text">{this.props.getSocieteName(this.props.societeFilter).toUpperCase()}</span>
          </a>
        </li>
      )
    }else{
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility"){
        return(
          <li className="nav-item" name="filter">
            <a href="#" className="nav-link" onClick={this.showFilter}>
              <DuoIcon name="filter" color="blue"/>
              <span className="link-text">{this.props.getSocieteName(this.props.societeFilter).toUpperCase()}</span>
            </a>
          </li>
        )
      }else{
        return(
          <li className="nav-item" name="filter">
            <a href="#" className="nav-link" onClick={this.showFilter}>
              <DuoIcon name="filter" color="blue"/>
              <span className="link-text">{this.props.getSocieteName(this.props.societeFilter).toUpperCase()}</span>
            </a>
          </li>
        )
      }
    }
  }

  render() {
    return (
      <Fragment>
        <div className="navbar">
          <ul className="navbar-nav">
            <li className="logo" >
              <a className="nav-link nav-link-logo" key={"logout"}>
                <span className="link-text">WG Logistique</span>
                <DuoIcon name="double-chevron-right" color="blue"/>
              </a>
            </li>
            {this.getFilterNavbarRow()}
            <NavbarItemList menuItems={this.getMenuItemsList()}/>
            <li className="nav-item" name={"logout"}>
              <a href="#" className="nav-link" key={"logout"} onClick={this.logout}>
                <DuoIcon name="poweroff" color="red"/>
                <span className="link-text">LOG OUT</span>
              </a>
            </li>
          </ul>
        </div>
        <NavbarSocietePicker opened={this.state.selectingSociete} close={this.closeFilter} onChange={this.handleSocieteFilterChange} groupAppears={true} value={this.props.societeFilter}/>
      </Fragment>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Menu));