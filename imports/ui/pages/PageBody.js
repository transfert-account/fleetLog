import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

import Home from './Home';

import Vehicles from './Vehicles';
import Vehicle from './Vehicle';

import Locations from './Locations';
import Location from './Location';

import Entretiens from './Entretiens';
import Entretien from './Entretien';

import Controls from './Controls';

import Licences from './Licences';

import Planning from './Planning';

import ExportVehicles from './ExportVehicles';
import ExportEntretiens from './ExportEntretiens';
import ExportSinistres from './ExportSinistres';
import ExportCausesSinistres from './ExportCausesSinistres';

import Accidents from './Accidents';
import Accident from './Accident';

import Fournisseurs from './Fournisseurs';

import Batiments from './Batiments';

import Compte from './Compte';
import Accounts from './Accounts';
import Content from './Content';
import Pieces from './Pieces';
import Equipements from './Equipements';
import Patchnotes from './Patchnotes';
import Storage from './Storage';
import Logs from './Logs';

import Title from '../pages/Title';

import Dashboards from '../pages/Dashboards';

class PageBody extends Component {

  getAvailableRoutes = () =>{
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
              <Route exact path='/home' component={()=><Title userLimited={false}/>}/>

              <Route exact path='/kpi' component={()=><Dashboards userLimited={false}/>}/>
              
              <Route exact path='/parc/vehicles' component={()=><Vehicles userLimited={false}/>}/>
              <Route exact path='/parc/vehicle/:_id' component={Vehicle}/>
              <Route exact path='/parc/controls' component={()=><Controls userLimited={false}/>}/>
              <Route exact path='/parc/licences' component={()=><Licences userLimited={false}/>}/>
              <Route exact path='/parc/locations' component={()=><Locations userLimited={false}/>}/>
              <Route exact path='/parc/location/:_id' component={Location}/>

              <Route exact path='/entretiens' component={()=><Entretiens userLimited={false}/>}/>
              <Route exact path='/entretien/:_id' component={Entretien}/>

              <Route exact path='/planning/:y/:m' component={()=><Planning userLimited={false}/>}/>

              <Route exact path='/accidentologie' component={()=><Accidents userLimited={false}/>}/>
              <Route exact path='/accident/:_id' component={Accident}/>

              <Route exact path='/export/vehicles' component={ExportVehicles}/>
              <Route exact path='/export/entretiens' component={ExportEntretiens}/>
              <Route exact path='/export/sinistres' component={ExportSinistres}/>
              <Route exact path='/export/causes-sinistres' component={ExportCausesSinistres}/>

              <Route exact path='/batiments' component={()=><Batiments userLimited={false}/>}/>

              <Route exact path='/fournisseurs' component={Fournisseurs}/>

              <Route exact path='/compte' component={Compte}/>
              
              <Route exact path='/administration/accounts' component={Accounts}/>
              <Route exact path='/administration/content' component={Content}/>
              <Route exact path='/administration/equipements' component={Equipements}/>
              <Route exact path='/administration/pieces' component={Pieces}/>
              <Route exact path='/administration/patchnotes' component={Patchnotes}/>
              <Route exact path='/administration/storage' component={Storage}/>
              <Route exact path='/administration/logs' component={Logs}/>
              
              <Redirect from='*' to={'/home'}/>
            </Switch>
          );
        }else{//Si l'utilisateur a une visibilité societé définie
          return(
            <Switch>
              <Route exact path='/home' component={()=><Title userLimited={true}/>}/>

              <Route exact path='/kpi' component={()=><Dashboards userLimited={true}/>}/>
              
              <Route exact path='/parc/vehicles' component={()=><Vehicles userLimited={true}/>}/>
              <Route exact path='/parc/vehicle/:_id' component={Vehicle}/>
              <Route exact path='/parc/controls' component={()=><Controls userLimited={true}/>}/>
              <Route exact path='/parc/licences' component={()=><Licences userLimited={true}/>}/>
              <Route exact path='/parc/locations' component={()=><Locations userLimited={true}/>}/>
              <Route exact path='/parc/location/:_id' component={Location}/>

              <Route exact path='/entretiens' component={()=><Entretiens userLimited={true}/>}/>
              <Route exact path='/entretien/:_id' component={Entretien}/>

              <Route exact path='/planning/:y/:m' component={()=><Planning userLimited={true}/>}/>

              <Route exact path='/accidentologie' component={()=><Accidents userLimited={true}/>}/>
              <Route exact path='/accident/:_id' component={Accident}/>

              <Route exact path='/export/vehicles' component={ExportVehicles}/>
              <Route exact path='/export/entretiens' component={ExportEntretiens}/>
              <Route exact path='/export/sinistres' component={ExportSinistres}/>
              <Route exact path='/export/causes-sinistres' component={ExportCausesSinistres}/>

              <Route exact path='/batiments' component={()=><Batiments userLimited={true}/>}/>

              <Route exact path='/fournisseurs' component={Fournisseurs}/>

              <Route exact path='/compte' component={Compte}/>
              
              <Route exact path='/administration/accounts' component={Accounts}/>
              <Route exact path='/administration/content' component={Content}/>
              <Route exact path='/administration/equipements' component={Equipements}/>
              <Route exact path='/administration/pieces' component={Pieces}/>
              <Route exact path='/administration/patchnotes' component={Patchnotes}/>
              <Route exact path='/administration/logs' component={Logs}/>

              <Redirect from='*' to={'/home'}/>
            </Switch>
          );
        }
      }else{//Si l'utilisateur est user, et a donc une visibilité societé définie
        return(
          <Switch>
            <Route exact path='/home' component={()=><Title userLimited={true}/>}/>

            <Route exact path='/kpi' component={()=><Dashboards userLimited={true}/>}/>

            <Route exact path='/parc/vehicles' component={()=><Vehicles userLimited={true}/>}/>
            <Route exact path='/parc/vehicle/:_id' component={Vehicle}/>
            <Route exact path='/parc/controls' component={()=><Controls userLimited={true}/>}/>
            <Route exact path='/parc/licences' component={()=><Licences userLimited={true}/>}/>
            <Route exact path='/parc/locations' component={()=><Locations userLimited={true}/>}/>
            <Route exact path='/parc/location/:_id' component={Location}/>

            <Route exact path='/entretiens' component={()=><Entretiens userLimited={true}/>}/>
            <Route exact path='/entretien/:_id' component={Entretien}/>

            <Route exact path='/planning/:y/:m' component={()=><Planning userLimited={true}/>}/>

            <Route exact path='/accidentologie' component={()=><Accidents userLimited={true}/>}/>
            <Route exact path='/accident/:_id' component={Accident}/>

            <Route exact path='/export/vehicles' component={ExportVehicles}/>
            <Route exact path='/export/entretiens' component={ExportEntretiens}/>
            <Route exact path='/export/sinistres' component={ExportSinistres}/>
            <Route exact path='/export/causes-sinistres' component={ExportCausesSinistres}/>

            <Route exact path='/batiments' component={()=><Batiments userLimited={true}/>}/>

            <Route exact path='/fournisseurs' component={Fournisseurs}/>

            <Route exact path='/compte' component={Compte}/>
            <Redirect from='*' to={'/home'}/>
          </Switch>
        );
      }
    }
  }

  render() {
    return (
      <div style={{
        width:"calc(100vw - 6rem)",
        margin:"0 0 0 6rem",
        padding:"32px 48px",
        display:"inline-block",
        backgroundRepeat:"no-repeat",
        backgroundAttachment:"fixed",
        height:"100vh"
      }}>
        {this.getAvailableRoutes()}
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default withUserContext(PageBody);