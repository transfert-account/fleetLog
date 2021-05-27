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

import Batiments from './Batiments';

import Compte from './Compte';
import Accounts from './Accounts';
import Content from './Content';
import Pieces from './Pieces';
import Patchnotes from './Patchnotes';
import Storage from './Storage';
import Logs from './Logs';

import Title from '../pages/Title';

class PageBody extends Component {

  render = () =>{
    if(isBrowser){
      console.log("We're on desktop")
      if(this.props.user._id == null || this.props.user._id == undefined){
        return(
          <Switch>
            <Route exact path='/' component={Home}/>
            <Redirect from='*' to={'/'}/>
          </Switch>
        );
      }else{
        if(this.props.user.isAdmin){//Si l'utilisateur est administrateur
          if(this.props.user.visibility == "noidthisisgroupvisibility"){//Si l'utilisateur a une visibilité groupe
            return(
              <Switch>
                <Route exact path='/home' component={withNavbar(()=><Title userLimited={false}/>)}/>
                
                <Route exact path='/parc/vehicles' component={withNavbar(()=><Vehicles userLimited={false}/>)}/>
                <Route exact path='/parc/vehicle/:_id' component={withNavbar(Vehicle)}/>
                
                <Route exact path='/parc/licences' component={withNavbar(()=><Licences userLimited={false}/>)}/>
                <Route exact path='/parc/locations' component={withNavbar(()=><Locations userLimited={false}/>)}/>
                <Route exact path='/parc/location/:_id' component={withNavbar(Location)}/>

                <Route exact path='/entretien/controls/obli' component={withNavbar(()=><Controls ctrlType={"obli"} userLimited={false}/>)}/>
                <Route exact path='/entretien/controls/prev' component={withNavbar(()=><Controls ctrlType={"prev"} userLimited={false}/>)}/>
                <Route exact path='/entretien/controls/curatif' component={withNavbar(()=><Curatif userLimited={false}/>)}/>
                <Route exact path='/entretien/controls/:key' component={withNavbar(()=><Control userLimited={false}/>)}/>
                <Route exact path='/entretien/pieces' component={withNavbar(()=><Pieces/>)}/>

                <Route exact path='/entretien/entretiens' component={withNavbar(()=><Entretiens userLimited={false}/>)}/>
                <Route exact path='/entretien/:_id' component={withNavbar(Entretien)}/>

                <Route exact path='/planning/:y/:m' component={withNavbar(()=><Planning userLimited={false}/>)}/>

                <Route exact path='/accidentologie' component={withNavbar(()=><Accidents userLimited={false}/>)}/>
                <Route exact path='/accident/:_id' component={withNavbar(Accident)}/>

                <Route exact path='/export/vehicles' component={withNavbar(ExportVehicles)}/>
                <Route exact path='/export/entretiens' component={withNavbar(ExportEntretiens)}/>
                <Route exact path='/export/sinistres' component={withNavbar(ExportSinistres)}/>

                <Route exact path='/batiments' component={withNavbar(()=><Batiments userLimited={false}/>)}/>

                <Route exact path='/fournisseurs' component={withNavbar(Fournisseurs)}/>

                <Route exact path='/compte' component={withNavbar(Compte)}/>
                
                <Route exact path='/administration/accounts' component={withNavbar(Accounts)}/>
                <Route exact path='/administration/content' component={withNavbar(Content)}/>
                <Route exact path='/administration/pieces' component={withNavbar(Pieces)}/>
                <Route exact path='/administration/patchnotes' component={withNavbar(Patchnotes)}/>
                <Route exact path='/administration/storage' component={withNavbar(Storage)}/>
                <Route exact path='/administration/logs' component={withNavbar(Logs)}/>
                
                <Redirect from='*' to={'/home'}/>
              </Switch>
            );
          }else{//Si l'utilisateur est admin avec une visibilité societé définie
            return(
              <Switch>
                <Route exact path='/home' component={withNavbar(()=><Title userLimited={true}/>)}/>

                <Route exact path='/parc/vehicles' component={withNavbar(()=><Vehicles userLimited={true}/>)}/>
                <Route exact path='/parc/vehicle/:_id' component={withNavbar(Vehicle)}/>

                <Route exact path='/parc/licences' component={withNavbar(()=><Licences userLimited={true}/>)}/>
                <Route exact path='/parc/locations' component={withNavbar(()=><Locations userLimited={true}/>)}/>
                <Route exact path='/parc/location/:_id' component={withNavbar(Location)}/>

                <Route exact path='/entretien/controls/obli' component={withNavbar(()=><Controls ctrlType={"obli"} userLimited={true}/>)}/>
                <Route exact path='/entretien/controls/prev' component={withNavbar(()=><Controls ctrlType={"prev"} userLimited={true}/>)}/>
                <Route exact path='/entretien/controls/curatif' component={withNavbar(()=><Curatif userLimited={true}/>)}/>
                <Route exact path='/entretien/controls/:key' component={withNavbar(()=><Control userLimited={true}/>)}/>
                <Route exact path='/entretien/pieces' component={withNavbar(()=><Pieces/>)}/>

                <Route exact path='/entretien/entretiens' component={withNavbar(()=><Entretiens userLimited={true}/>)}/>
                <Route exact path='/entretien/:_id' component={withNavbar(Entretien)}/>

                <Route exact path='/planning/:y/:m' component={withNavbar(()=><Planning userLimited={true}/>)}/>

                <Route exact path='/accidentologie' component={withNavbar(()=><Accidents userLimited={true}/>)}/>
                <Route exact path='/accident/:_id' component={withNavbar(Accident)}/>

                <Route exact path='/export/vehicles' component={withNavbar(ExportVehicles)}/>
                <Route exact path='/export/entretiens' component={withNavbar(ExportEntretiens)}/>
                <Route exact path='/export/sinistres' component={withNavbar(ExportSinistres)}/>

                <Route exact path='/batiments' component={withNavbar(()=><Batiments userLimited={true}/>)}/>

                <Route exact path='/fournisseurs' component={withNavbar(Fournisseurs)}/>

                <Route exact path='/compte' component={withNavbar(Compte)}/>

                <Route exact path='/administration/accounts' component={withNavbar(Accounts)}/>
                <Route exact path='/administration/content' component={withNavbar(Content)}/>
                <Route exact path='/administration/pieces' component={withNavbar(Pieces)}/>
                <Route exact path='/administration/patchnotes' component={withNavbar(Patchnotes)}/>
                <Route exact path='/administration/storage' component={withNavbar(Storage)}/>
                <Route exact path='/administration/logs' component={withNavbar(Logs)}/>

                <Redirect from='*' to={'/home'}/>
              </Switch>
            );
          }
        }else{//Si l'utilisateur est user, et a donc une visibilité societé définie
          return(
            <Switch>
              <Route exact path='/home' component={withNavbar(()=><Title userLimited={true}/>)}/>

              <Route exact path='/parc/vehicles' component={withNavbar(()=><Vehicles userLimited={true}/>)}/>
              <Route exact path='/parc/vehicle/:_id' component={withNavbar(Vehicle)}/>

              <Route exact path='/parc/licences' component={withNavbar(()=><Licences userLimited={true}/>)}/>
              <Route exact path='/parc/locations' component={withNavbar(()=><Locations userLimited={true}/>)}/>
              <Route exact path='/parc/location/:_id' component={withNavbar(Location)}/>

              <Route exact path='/entretien/controls/obli' component={withNavbar(()=><Controls ctrlType={"obli"} userLimited={true}/>)}/>
              <Route exact path='/entretien/controls/prev' component={withNavbar(()=><Controls ctrlType={"prev"} userLimited={true}/>)}/>
              <Route exact path='/entretien/controls/curatif' component={withNavbar(()=><Curatif userLimited={true}/>)}/>
              <Route exact path='/entretien/controls/:key' component={withNavbar(()=><Control userLimited={true}/>)}/>
              <Route exact path='/entretien/pieces' component={withNavbar(()=><Pieces/>)}/>

              <Route exact path='/entretien/entretiens' component={withNavbar(()=><Entretiens userLimited={true}/>)}/>
              <Route exact path='/entretien/:_id' component={withNavbar(Entretien)}/>

              <Route exact path='/planning/:y/:m' component={withNavbar(()=><Planning userLimited={true}/>)}/>

              <Route exact path='/accidentologie' component={withNavbar(()=><Accidents userLimited={true}/>)}/>
              <Route exact path='/accident/:_id' component={withNavbar(Accident)}/>

              <Route exact path='/export/vehicles' component={withNavbar(ExportVehicles)}/>
              <Route exact path='/export/entretiens' component={withNavbar(ExportEntretiens)}/>
              <Route exact path='/export/sinistres' component={withNavbar(ExportSinistres)}/>

              <Route exact path='/batiments' component={withNavbar(()=><Batiments userLimited={true}/>)}/>

              <Route exact path='/fournisseurs' component={withNavbar(Fournisseurs)}/>

              <Route exact path='/compte' component={withNavbar(Compte)}/>

              <Redirect from='*' to={'/home'}/>
            </Switch>
          );
        }
      }
    }else{
      console.log("We're on mobile")
      if(this.props.user._id == null || this.props.user._id == undefined){
        return(
          <Switch>
            <Route exact path='/' component={Home}/>
            <Redirect from='*' to={'/'}/>
          </Switch>
        )
      }else{
        if(this.props.user.isAdmin){//Si l'utilisateur est administrateur
          if(this.props.user.visibility == "noidthisisgroupvisibility"){//Si l'utilisateur a une visibilité groupe
            return(
              <Switch>
                <Route exact path='/entretien/entretiens' component={withoutNavbar(()=><Entretiens userLimited={false}/>)}/>
                <Route exact path='/entretien/:_id' component={withoutNavbar(Entretien)}/>
      
                <Redirect from='*' to={'/entretien/entretiens'}/>
              </Switch>
            )
          }else{//Si l'utilisateur est admin avec une visibilité societé définie
            return(
              <Switch>
                <Route exact path='/entretien/entretiens' component={withoutNavbar(()=><Entretiens userLimited={true}/>)}/>
                <Route exact path='/entretien/:_id' component={withoutNavbar(Entretien)}/>
      
                <Redirect from='*' to={'/entretien/entretiens'}/>
              </Switch>
            )
          }
        }else{
          return(
            <Switch>
              <Route exact path='/entretien/entretiens' component={withoutNavbar(()=><Entretiens userLimited={true}/>)}/>
              <Route exact path='/entretien/:_id' component={withoutNavbar(Entretien)}/>
    
              <Redirect from='*' to={'/entretien/entretiens'}/>
            </Switch>
          )
        }
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