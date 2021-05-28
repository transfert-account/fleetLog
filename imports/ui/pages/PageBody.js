import React, { Component, Fragment } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { isBrowser } from "react-device-detect";

import Navbar from '../navbar/Navbar';

import Home from './Home';

import Vehicles from './Vehicles';
import Vehicle from './Vehicle';

import Locations from './Locations';
import Location from './Location';

import Entretiens from './Entretiens';
import Entretien from './Entretien';

import Controls from './Controls';
import Control from './Control';
import Curatif from './Curatif';

import Licences from './Licences';

import Planning from './Planning';

import ExportVehicles from './ExportVehicles';
import ExportEntretiens from './ExportEntretiens';
import ExportSinistres from './ExportSinistres';

import Accidents from './Accidents';
import Accident from './Accident';

import Fournisseurs from './Fournisseurs';

import BatimentControls from './BatimentControls';

import Compte from './Compte';
import Accounts from './Accounts';
import Content from './Content';
import Pieces from './Pieces';
import Patchnotes from './Patchnotes';
import Storage from './Storage';
import Logs from './Logs';

import Title from '../pages/Title';


class ProtectedRoutes extends Component {
  render() {
    const { component: Component, ...props } = this.props
    return (
      this.props.user && this.props.user.isAdmin ?
      <Fragment>
        <Route exact path='/administration/accounts' component={withNavbar(Accounts)}/>
        <Route exact path='/administration/content' component={withNavbar(Content)}/>
        <Route exact path='/administration/pieces' component={withNavbar(Pieces)}/>
        <Route exact path='/administration/patchnotes' component={withNavbar(Patchnotes)}/>
        <Route exact path='/administration/storage' component={withNavbar(Storage)}/>
        <Route exact path='/administration/logs' component={withNavbar(Logs)}/>
      </Fragment>
      :
      <Redirect from='*' to={'/home'}/>
    )
  }
}

class PageBody extends Component {

  render = () =>{
    if(isBrowser){
      if(this.props.user._id == null || this.props.user._id == undefined){
        return(
          <Switch>
            <Route exact path='/' component={Home}/>
            <Redirect from='*' to={'/'}/>
          </Switch>
        );
      }else{//DESKTOP
        return(
          <Switch>
            <Route exact path='/home' component={withNavbar(Title)}/>
            
            <Route exact path='/parc/vehicles' component={withNavbar(Vehicles)}/>
            <Route exact path='/parc/vehicle/:_id' component={withNavbar(Vehicle)}/>
            
            <Route exact path='/parc/locations' component={withNavbar(Locations)}/>
            <Route exact path='/parc/location/:_id' component={withNavbar(Location)}/>

            <Route exact path='/parc/licences' component={withNavbar(Licences)}/>

            <Route exact path='/entretien/controls/obli' component={withNavbar(()=><Controls ctrlType={"obli"}/>)}/>
            <Route exact path='/entretien/controls/prev' component={withNavbar(()=><Controls ctrlType={"prev"}/>)}/>
            <Route exact path='/entretien/controls/curatif' component={withNavbar(Curatif)}/>
            <Route exact path='/entretien/controls/:key' component={withNavbar(Control)}/>
            <Route exact path='/entretien/pieces' component={withNavbar(Pieces)}/>

            <Route exact path='/entretien/entretiens' component={withNavbar(Entretiens)}/>
            <Route exact path='/entretien/:_id' component={withNavbar(Entretien)}/>

            <Route exact path='/planning/:y/:m' component={withNavbar(Planning)}/>

            <Route exact path='/accidentologie' component={withNavbar(Accidents)}/>
            <Route exact path='/accident/:_id' component={withNavbar(Accident)}/>

            <Route exact path='/export/vehicles' component={withNavbar(ExportVehicles)}/>
            <Route exact path='/export/entretiens' component={withNavbar(ExportEntretiens)}/>
            <Route exact path='/export/sinistres' component={withNavbar(ExportSinistres)}/>

            <Route exact path='/batiment_controls' component={withNavbar(BatimentControls)}/>

            <Route exact path='/fournisseurs' component={withNavbar(Fournisseurs)}/>

            <Route exact path='/compte' component={withNavbar(Compte)}/>
            
            <ProtectedRoutes />  
            
            <Redirect from='*' to={'/home'}/>
          </Switch>
        );
      }
    }else{//MOBILE
      if(this.props.user._id == null || this.props.user._id == undefined){
        return(
          <Switch>
            <Route exact path='/' component={Home}/>
            <Redirect from='*' to={'/'}/>
          </Switch>
        )
      }else{
        return(
          <Switch>
            <Route exact path='/entretien/entretiens' component={withoutNavbar(Entretiens)}/>
            <Route exact path='/entretien/:_id' component={withoutNavbar(Entretien)}/>
  
            <Redirect from='*' to={'/entretien/entretiens'}/>
          </Switch>
        )  
      }
    }
  }
}

const withNavbar = Component => props => (
  <Fragment>
    <Navbar/>
    <div id="pagebody" style={{
      width:"calc(100vw - 6rem)",
      margin:"0 0 0 6rem",
      padding:"32px 48px",
      display:"inline-block",
      backgroundRepeat:"no-repeat",
      backgroundAttachment:"fixed",
      height:"100vh"
    }}>
      <Component {...props}/>
    </div>
  </Fragment>
)

const withoutNavbar = Component => props => (
  <Fragment>
    <div id="pagebody" style={{width:"100vw",margin:"0",padding:"2rem",display:"grid",backgroundRepeat:"no-repeat",backgroundAttachment:"fixed",minHeight:"100vh"}}>
      <Component {...props}/>
    </div>
  </Fragment>
)

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default withUserContext(PageBody);