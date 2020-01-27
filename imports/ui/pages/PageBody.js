import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Vehicles from './Vehicles';
import Vehicle from './Vehicle';
import Controls from './Controls';
import Licences from './Licences';
import Locations from './Locations';
import Location from './Location';
import Compte from './Compte';
import Accounts from './Accounts';
import Content from './Content';
import Equipements from './Equipements';
import Fournisseurs from './Fournisseurs';
import Accidentologie from './Accidentologie';
import Planning from './Planning';
import Entretiens from './Entretiens';
import Entretien from './Entretien';
import Pieces from './Pieces';
import { UserContext } from '../../contexts/UserContext';

class PageBody extends Component {

  getMargin = () => {
    if(this.props.collapsed){
      return "0 0 0 80px";
    }else{
      return "0 0 0 200px";
    }
  }

  getWidth = () => {
    if(this.props.collapsed){
      return "calc(100vw - 80px)";
    }else{
      return "calc(100vw - 200px)";
    }
  }

  getAvailableRoutes = () =>{
    console.log(this.props.user)
    if(this.props.user.isAdmin){//Si l'utilisateur est administrateur
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

          <Route exact path='/accidentologie' component={Accidentologie}/>

          <Route exact path='/fournisseurs' component={Fournisseurs}/>

          <Route exact path='/compte' component={Compte}/>
          
          <Route exact path='/administration/accounts' component={Accounts}/>
          <Route exact path='/administration/content' component={Content}/>
          <Route exact path='/administration/equipements' component={Equipements}/>
          <Route exact path='/administration/pieces' component={Pieces}/>
          <Redirect from='*' to={'/'}/>
        </Switch>
      );
    }else{//Si l'utilisateur est user
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

          <Route exact path='/accidentologie' component={Accidentologie}/>

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
        width:this.getWidth(),
        margin:this.getMargin(),
        padding:"32px 64px 32px 64px",
        display:"inline-block",
        backgroundColor: "#b8c6db",
        backgroundImage: "linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)",
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