import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';

import Vehicles from './Vehicles';
import BUVehicles from './BUVehicles';
import Vehicle from './Vehicle';

import Locations from './Locations';
import BULocations from './BULocations';
import Location from './Location';

import Entretiens from './Entretiens';
import BUEntretiens from './BUEntretiens';
import Entretien from './Entretien';

import Controls from './Controls';
import BUControls from './BUControls';

import Licences from './Licences';
import BULicences from './BULicences';

import Planning from './Planning';
import BUPlanning from './BUPlanning';

import Fournisseurs from './Fournisseurs';

import Accidents from './Accidents';
import BUAccidents from './BUAccidents';

import Batiments from './Batiments';
import BUBatiments from './BUBatiments';

import Compte from './Compte';
import Accounts from './Accounts';
import Content from './Content';
import Equipements from './Equipements';
import ExportXL from './ExportXL';
import Patchnotes from './Patchnotes';
import Documents from './Documents';

import WorkInProgress from './WorkInProgress';

import Pieces from './Pieces';
import { UserContext } from '../../contexts/UserContext';

class PageBody extends Component {

  getAvailableRoutes = () =>{
    if(this.props.user.isAdmin){//Si l'utilisateur est administrateur
      if(this.props.user.visibility == "noidthisisgroupvisibility"){//Si l'utilisateur a une visibilité groupe
        return(
          <Switch>
            <Route exact path='/' component={Home}/>
            
            <Route exact path='/parc/vehicles' component={Vehicles}/>
            <Route exact path='/parc/vehicle/:_id' component={Vehicle}/>
            <Route exact path='/parc/controls' component={Controls}/>
            <Route exact path='/parc/licences' component={Licences}/>
            <Route exact path='/parc/locations' component={Locations}/>
            <Route exact path='/parc/location/:_id' component={Location}/>

            <Route exact path='/entretiens' component={Entretiens}/>
            <Route exact path='/entretien/:_id' component={Entretien}/>

            <Route exact path='/planning/:y/:m' component={Planning}/>

            <Route exact path='/accidentologie' component={Accidents}/>
            <Route exact path='/batiments' component={Batiments}/>

            <Route exact path='/fournisseurs' component={Fournisseurs}/>

            <Route exact path='/compte' component={Compte}/>
            
            <Route exact path='/administration/accounts' component={Accounts}/>
            <Route exact path='/administration/content' component={Content}/>
            <Route exact path='/administration/equipements' component={Equipements}/>
            <Route exact path='/administration/pieces' component={Pieces}/>
            <Route exact path='/administration/exports' component={ExportXL}/>
            <Route exact path='/administration/patchnotes' component={Patchnotes}/>
            <Route exact path='/administration/documents' component={Documents}/>

            
            <Redirect from='*' to={'/'}/>
          </Switch>
        );
      }else{//Si l'utilisateur a une visibilité societé définie
        return(
          <Switch>
            <Route exact path='/' component={Home}/>
            
            <Route exact path='/parc/vehicles' component={BUVehicles}/>
            <Route exact path='/parc/vehicle/:_id' component={Vehicle}/>
            <Route exact path='/parc/controls' component={BUControls}/>
            <Route exact path='/parc/licences' component={BULicences}/>
            <Route exact path='/parc/locations' component={BULocations}/>
            <Route exact path='/parc/location/:_id' component={Location}/>

            <Route exact path='/entretiens' component={BUEntretiens}/>
            <Route exact path='/entretien/:_id' component={Entretien}/>

            <Route exact path='/planning/:y/:m' component={BUPlanning}/>

            <Route exact path='/accidentologie' component={BUAccidents}/>
            
            <Route exact path='/batiments' component={BUBatiments}/>

            <Route exact path='/fournisseurs' component={Fournisseurs}/>

            <Route exact path='/compte' component={Compte}/>
            
            <Route exact path='/administration/accounts' component={Accounts}/>
            <Route exact path='/administration/content' component={Content}/>
            <Route exact path='/administration/equipements' component={Equipements}/>
            <Route exact path='/administration/pieces' component={Pieces}/>
            <Route exact path='/administration/exports' component={ExportXL}/>
            <Route exact path='/administration/patchnotes' component={Patchnotes}/>
            <Route exact path='/administration/documents' component={Documents}/>


            <Redirect from='*' to={'/'}/>
          </Switch>
        );
      }
    }else{//Si l'utilisateur est user, et a donc une visibilité societé définie
      return(
        <Switch>
          <Route exact path='/' component={Home}/>

          <Route exact path='/parc/vehicles' component={BUVehicles}/>
          <Route exact path='/parc/vehicle/:_id' component={Vehicle}/>
          <Route exact path='/parc/controls' component={BUControls}/>
          <Route exact path='/parc/licences' component={BULicences}/>
          <Route exact path='/parc/locations' component={BULocations}/>
          <Route exact path='/parc/location/:_id' component={Location}/>

          <Route exact path='/entretiens' component={BUEntretiens}/>
          <Route exact path='/entretien/:_id' component={Entretien}/>

          <Route exact path='/planning/:y/:m' component={BUPlanning}/>

          <Route exact path='/accidentologie' component={BUAccidents}/>

          <Route exact path='/batiments' component={BUBatiments}/>

          <Route exact path='/fournisseurs' component={Fournisseurs}/>

          <Route exact path='/compte' component={Compte}/>
          <Redirect from='*' to={'/'}/>
        </Switch>
      );
    }
  }

  render() {
    return (
      <div style={{
        width:"calc(100vw - 80px)",
        margin:"0 0 0 80px",
        padding:"32px 64px 32px 64px",
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