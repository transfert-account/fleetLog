import React, { Fragment,Component } from 'react'
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

class MenuItemList extends Component {
  state={
    active:""
  }

  render() {
    const { menuItems } = this.props;
    const list = [];
    if(this.props.collapsed){
      menuItems.forEach(item => {
        if(item.display){
          list.push(
            <Link key={item.name} to={'/'+ item.name} onClick={()=>{this.setState({active:item.active})}} style={{textDecoration: 'none' }}>
              <li style={{cursor:"pointer",margin:"20px 0"}} name={item.name}>
                <Icon link size="large" style={{cursor:"pointer",margin:"0"}} name={item.icon} color={(this.state.active == item.active ? "blue" : "black")}/>
              </li>
            </Link>
          )
        }
      });
    }else{
      menuItems.forEach(item => {
        if(item.display){
          list.push(
            <Link key={item.name} to={'/'+ item.name} onClick={()=>{this.setState({active:item.active})}} style={{textDecoration: 'none' }}>
              <li className={"menuItem " + (this.state.active == item.active ? "menuItemActive" : "")} style={{cursor:"pointer"}} name={item.name}>
                <p style={{
                    textAlign:"right",
                    padding:"8px 16px 8px 0",
                    fontSize:"1.1em",
                    fontWeight:"800",
                    fontFamily: "'Open Sans', sans-serif"
                  }}>{item.label.toUpperCase()}</p>
              </li>
            </Link>
          )
        }
      });
    }
    return (
      list
    );
  }
}

export default MenuItemList
