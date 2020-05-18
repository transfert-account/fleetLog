import React, { Fragment,Component } from 'react'
import { Link,withRouter } from 'react-router-dom';

import { DuoIcon } from '../elements/DuoIcon';

class NavbarItemList extends Component {
  state={
    active:""
  }

  render() {
    const { menuItems } = this.props;
    const list = [];
    menuItems.forEach(item => {
      if(item.display){
        list.push(
          <li className="nav-item" name={item.name} key={item.name}>
            <a href="#" className="nav-link" key={item.name} onClick={()=>{this.props.history.push('/'+ item.name)}} style={{textDecoration: 'none'}}>
              <DuoIcon name={item.icon} color={item.color}/>
              <span className="link-text">{item.label.toUpperCase()}</span>
            </a>
          </li>
        )
      }
    });
    return (
      list
    );
  }
}

export default withRouter(NavbarItemList)
