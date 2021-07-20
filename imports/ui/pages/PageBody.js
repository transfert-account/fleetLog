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

import Pieces from './Pieces';

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
import ControlsAdmin from './ControlsAdmin';
import Scripts from './Scripts';
import Storage from './Storage';
import Logs from './Logs';

import Title from '../pages/Title';

/* MOBILE */

import MobileLayout from '../mobile_pages/MobileLayout';

import M_Entretiens from '../mobile_pages/M_Entretiens';
import M_Entretien from '../mobile_pages/M_Entretien';

import M_Curatif from '../mobile_pages/M_Curatif';

import M_Pieces from '../mobile_pages/M_Pieces';

import M_Planning from '../mobile_pages/M_Planning';
import M_Menu from '../mobile_pages/M_Menu';

class PageBody extends Component {

  render = () =>{
    if(isBrowser){
      if(!(Meteor.userId() && this.props.user._id != null && this.props.user._id != undefined)){
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
            <Route exact path='/entretien/control/:_id/:filter' component={withNavbar(Control)}/>
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
            
            
            {(this.props.user && this.props.user.isAdmin ? <Route exact path='/administration/accounts' component={withNavbar(Accounts)}/>:"")}
            {(this.props.user && this.props.user.isAdmin ? <Route exact path='/administration/content' component={withNavbar(Content)}/>:"")}
            {(this.props.user && this.props.user.isAdmin ? <Route exact path='/administration/controls' component={withNavbar(ControlsAdmin)}/>:"")}
            {(this.props.user && this.props.user.isAdmin ? <Route exact path='/administration/scripts' component={withNavbar(Scripts)}/>:"")}
            {(this.props.user && this.props.user.isAdmin ? <Route exact path='/administration/storage' component={withNavbar(Storage)}/>:"")}
            {(this.props.user && this.props.user.isAdmin ? <Route exact path='/administration/logs' component={withNavbar(Logs)}/>:"")}
            
            <Redirect from='*' to={'/home'}/>
          </Switch>
        );
      }
    }else{//MOBILE
      if(this.props.user._id == null || this.props.user._id == undefined){
        return(
          <Switch>
            <Route exact path='/home' component={Home}/>
            <Redirect from='*' to={'/home'}/>
          </Switch>
        )
      }else{
        return(
          <Switch>
            <Route exact path='/home' component={withoutNavbar(M_Menu)}/>

            <Route exact path='/parc/vehicles' component={withNavbar(Vehicles)}/>
            <Route exact path='/parc/vehicle/:_id' component={withNavbar(Vehicle)}/>

            <Route exact path='/entretien/controls/curatif' component={withoutNavbar(M_Curatif)}/>
            <Route exact path='/entretien/pieces' component={withoutNavbar(M_Pieces)}/>

            <Route exact path='/entretien/entretiens' component={withoutNavbar(M_Entretiens)}/>
            <Route exact path='/entretien/:_id' component={withoutNavbar(M_Entretien)}/>

            <Route exact path='/planning/:y/:m' component={withoutNavbar(M_Planning)}/>
  
            <Redirect from='*' to={'/home'}/>
          </Switch>
        )  
      }
    }
  }
}

const withNavbar = Component => props => (
  <Fragment>
    <Navbar/>
    <div id="desktop" className="pagebody" style={{
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
    <MobileLayout>
      <Component {...props}/>
    </MobileLayout>
  </Fragment>
)

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default withUserContext(PageBody);