import React, { Component, Fragment } from 'react';
import { Pagination,Icon,Menu,Input,Dimmer,Loader,Table,Button } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { VehiclesRow } from '../molecules/VehiclesRow';
import { gql } from 'apollo-server-express';

export class Vehicles extends Component {

  state={
    maxPage:1,
    currentPage:1,
    vehiclesFiler:"",
    vehiclesRaw:[{
        _id:"0123",
        company:"XXX",
        registration:"AP 295 QF",
        firstRegistrationDate:"02/04/2011",
        km:"151020",
        lastKmUpdate:"09/09/2019",
        brand:"Iveco",
        model:"Daily",
        volume:"26",
        payload:"2,4",
        color:"",
        cg:"",
        insurancePaid:"",
        cv:"",
        endDate:"12/04/2020",
        property:""
    },{
        _id:"4567",
        company:"XXX",
        registration:"JF 616 LD",
        firstRegistrationDate:"07/08/2015",
        km:"263450",
        lastKmUpdate:"12/09/2019",
        brand:"Iveco",
        model:"Daily",
        volume:"26",
        payload:"2,4",
        color:"",
        cg:"",
        insurancePaid:"",
        cv:"",
        endDate:"21/07/2020",
        property:""
    },{
        _id:"8910",
        company:"XXX",
        registration:"HF 959 PO",
        firstRegistrationDate:"26/07/2016",
        km:"320020",
        lastKmUpdate:"15/09/2019",
        brand:"Iveco",
        model:"Daily",
        volume:"26",
        payload:"2,4",
        color:"",
        cg:"",
        insurancePaid:"",
        cv:"",
        endDate:"19/06/2020",
        property:""
    }],
    vehicles : () => {
        if(this.state.vehiclesRaw.length==0){
            return(
                <Table.Row key={"none"}>
                    <Table.Cell width={16} colSpan='5' textAlign="center">
                        Le terme recherché n'apparait nul part dans les données.
                    </Table.Cell>
                </Table.Row>
            )
        }
        let displayed = Array.from(this.state.vehiclesRaw);
        console.log(displayed);
        if(this.state.vehiclesFiler.length>1){
            displayed = displayed.filter(i =>
                i.company.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                i.registration.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                i.brand.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                i.model.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase())
            );
            if(displayed.length == 0){
              return(
                <Table.Row key={"none"}>
                  <Table.Cell width={16} colSpan='5' textAlign="center">Aucun consommable répondant à ce filtre</Table.Cell>
                </Table.Row>
              )
            }
        }
        console.log(displayed);
        //displayed = displayed.slice((this.state.currentPage - 1) * this.state.rowByPage, this.state.currentPage * this.state.rowByPage);
        console.log(displayed);
        return displayed.map(i =>(
            <VehiclesRow key={i._id} vehicle={i}/>
        ))
    }
  }

  handlePaginationChange = () => {
      console.log("hello")
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  render() {
    return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 3fr 1fr 1fr"}}>
                <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                    <Menu.Item color="blue" name='vehicules' active onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                    <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                    <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                    <Menu.Item color="blue" name='rentals' onClick={()=>{this.props.history.push("/parc/rentals")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                </Menu>
                <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="vehiclesFiler" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un item ... (3 caractères minimum)' />
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAdd} icon labelPosition='right'>Ajouter un véhicule<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 4",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Company</Table.HeaderCell>
                                <Table.HeaderCell>Registration</Table.HeaderCell>
                                <Table.HeaderCell>FirstRegistrationDate</Table.HeaderCell>
                                <Table.HeaderCell>Km</Table.HeaderCell>
                                <Table.HeaderCell>LastKmUpdate</Table.HeaderCell>
                                <Table.HeaderCell>Brand</Table.HeaderCell>
                                <Table.HeaderCell>Model</Table.HeaderCell>
                                <Table.HeaderCell>Volume</Table.HeaderCell>
                                <Table.HeaderCell>Payload</Table.HeaderCell>
                                <Table.HeaderCell>Color</Table.HeaderCell>
                                <Table.HeaderCell>InsurancePaid</Table.HeaderCell>
                                <Table.HeaderCell>EndDate</Table.HeaderCell>
                                <Table.HeaderCell>Property</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.vehicles()}
                        </Table.Body>
                    </Table>
                    <Dimmer inverted active={this.state.loading}>
                        <Loader size='massive'>Chargement des vehicules ...</Loader>
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

export default wrappedInUserContext = withUserContext(Vehicles);