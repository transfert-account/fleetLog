import React, { Component, Fragment } from 'react';
import { Icon, Menu, Input, Dimmer, Loader, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ControlRow from '../molecules/ControlRow';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import 'moment/locale/fr';

export class BUControls extends Component {

  state={
    buVehiclesQuery : gql`
        query buVehicles{
            buVehicles{
                _id
                societe{
                    _id
                    trikey
                    name
                }
                registration
                firstRegistrationDate
                km
                lastKmUpdate
                brand{
                    _id
                    name
                }
                model{
                    _id
                    name
                }
                volume{
                    _id
                    meterCube
                }
                payload
                color{
                    _id
                    name
                    hex
                }
                cg
                insurancePaid
                cv
                property
                equipements{
                    _id
                    equipementDescription{
                        _id
                        name
                        controlPeriodValue
                        controlPeriodUnit
                        alertStepValue
                        alertStepUnit
                        unitType
                    }
                    attachementDate
                    lastControl
                }
            }
        }
    `,
    equipementDescriptionsQuery : gql`
        query equipementDescriptions{
            equipementDescriptions{
                _id
                name
                controlPeriodValue
                controlPeriodUnit
                alertStepValue
                alertStepUnit
                unitType
            }
        }
    `,
    vehiclesRaw:[],
    equipementDescriptionsRaw:[],
    vehicles : () => {
        if(this.state.vehiclesRaw.length==0){
            return(
                <Table.Row>
                    <Table.Cell>
                        Aucun vehicule ...
                    </Table.Cell>
                </Table.Row>
            )
        }
        let displayed = Array.from(this.state.vehiclesRaw);
        return displayed.map(i =>(
            <ControlRow hideSociete={true} loadVehicles={this.loadVehicles} equipementDescriptionsRaw={this.state.equipementDescriptionsRaw} key={i._id} vehicle={i}/>
        ))
    }
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  loadVehicles = () => {
    this.props.client.query({
        query:this.state.buVehiclesQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        data.buVehicles.map(v=>{
            v.red = 0;
            v.orange = 0;
            v.green = 0;
            v.equipements.map(e=>{
                e.nextControl = 0;
                e.alertStep = 0;
                e.color = "green";
                if(e.equipementDescription.unitType == "t"){
                    if(e.equipementDescription.controlPeriodUnit == "y"){
                        e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,"Y");
                    }
                    if(e.equipementDescription.controlPeriodUnit == "m"){
                        e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,'M');
                    }
                    if(e.equipementDescription.alertStepUnit == "y"){
                        e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,"Y");
                    }
                    if(e.equipementDescription.alertStepUnit == "m"){
                        e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,'M');
                    }
                    if(moment(e.alertStep, "DD/MM/YYYY").diff(moment())<0){
                        e.color = "orange"
                    }
                    if(moment(e.nextControl, "DD/MM/YYYY").diff(moment())<0){
                        e.color = "red"
                    }
                }
                if(e.equipementDescription.unitType == "d"){
                    e.nextControl = (parseInt(e.lastControl) + parseInt(e.equipementDescription.controlPeriodValue)) - parseInt(v.km)
                    if(e.nextControl<e.equipementDescription.alertStepValue){
                        e.color = "orange";
                    }
                    if(e.nextControl<0){
                        e.color = "red";
                    }
                }
                if(e.color == "red"){
                    v.red ++;
                }
                if(e.color == "orange"){
                    v.orange ++;
                }
                if(e.color == "green"){
                    v.green ++;
                }
            })
        })
        this.setState({
            vehiclesRaw:data.buVehicles
        })
    })
  }

  loadEquipementDescriptions = () => {
    this.props.client.query({
        query:this.state.equipementDescriptionsQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
            equipementDescriptionsRaw:data.equipementDescriptions
        })
    })
  }

  componentDidMount = () => {
    this.loadVehicles();
    this.loadEquipementDescriptions();
  }

  componentWillMount = () => {
    moment.locale('fr');
  }

  render() {
    return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 3fr 1fr 1fr"}}>
                <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                    <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                    <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                    <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                    <Menu.Item color="blue" name='locations' onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                </Menu>
                <Input style={{justifySelf:"stretch"}} name="storeFilter" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un vehicule ... (3 caractères minimum)' />
                <div style={{gridRowStart:"2",gridColumnEnd:"span 4",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign='center' width={2}>Immatriculation</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={9}>Véhicule</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={1}>OK</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={1}>Urgent</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={1}>En retard</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center' width={2}>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.vehicles()}
                        </Table.Body>
                    </Table>
                    <Dimmer inverted active={this.state.loading}>
                        <Loader size='massive'>Chargement des vehicules et de leurs equipements ...</Loader>
                    </Dimmer>
                </div>
            </div>
        </Fragment>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(BUControls);