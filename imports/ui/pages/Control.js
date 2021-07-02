import React, { Component, Fragment } from 'react';
import { Message, Table, Popup, Button, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import EntretienMenu from '../molecules/EntretienMenu';
import BigIconButton from '../elements/BigIconButton';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class Control extends Component {

    state={
        vehiclesByControlQuery : gql`
            query vehiclesByControl($_id:String!){
                vehiclesByControl(_id:$_id){
                    control{
                        _id
                        name
                        firstIsDifferent
                        firstFrequency
                        unit
                        frequency
                        alert
                        alertUnit
                        ctrlType
                    }
                    vehiclesOccurrences{
                        nextOccurrence
                        label
                        color
                        timing
                        lastOccurrence
                        entretien
                        vehicle{
                            _id
                            societe{
                                _id
                                name
                            }
                            registration
                            firstRegistrationDate
                            km
                            brand{
                                _id
                                name
                            }
                            model{
                                _id
                                name
                            }
                            energy{
                                _id
                                name
                            }
                            archived
                            shared
                            sharedTo{
                                _id
                                name
                            }
                        }
                    }
                }
            }
        `,
        unitsRaw:[
            {type:"distance",unit:"km",label:"km"},
            {type:"time",unit:"d",label:"jours"},
            {type:"time",unit:"m",label:"mois"},
            {type:"time",unit:"y",label:"ans"}
        ],
        vehiclesOccurrences:[],
        createEntretienFromControlQuery: gql`
            mutation createEntretienFromControl($vehicle:String!,$control:String!){
                createEntretienFromControl(vehicle:$vehicle,control:$control){
                    status
                    message
                }
            }
        `,
        controlRaw:{name:"name",key:"key",unit:"unit",frequency:"999999"},
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    loadVehiclesAndControl = () => {
        this.props.client.query({
            query:this.state.vehiclesByControlQuery,
            variables:{
                _id:this.props.match.params._id
            },
            fetchPolicy:'network-only'
        }).then(({data})=>{
            this.setState({
                controlRaw:data.vehiclesByControl.control,
                vehiclesOccurrences:data.vehiclesByControl.vehiclesOccurrences
            })
        })
    }
    addEntretien = v => {
        this.props.client.mutate({
            mutation:this.state.createEntretienFromControlQuery,
            variables:{
                vehicle:v,
                control:this.props.match.params._id
            }
        }).then(({data})=>{
            data.createEntretienFromControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehiclesAndControl();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    /*CONTENT GETTERS*/
    getSocieteCell = v => {
        return (
            <Fragment>
                {v.societe.name}
                <Popup content={(v.shared ? (v.sharedTo ? "En prêt vers " + v.sharedTo.name : "Chargement ...") : "Le véhicule n'est pas en prêt")} trigger={
                    <Button style={{marginLeft:"16px"}} color={(v.shared ? "teal":"")} icon="handshake"/>
                }/>
            </Fragment>
        )
    }
    getUnitLabel = unit => {
        if(unit == "unit"){return "loading ..."}
        return this.state.unitsRaw.filter(u=>u.unit == unit)[0].label;
    }
    getEcheanceCell = v => {
        return (
            <Table.Cell textAlign="center">
                {v.nextOccurrence}
                <Label style={{marginLeft:"24px"}} size="large" color={v.color}>
                    {v.label}
                </Label>
            </Table.Cell>
        )
    }
    getTimeFromNow = (control,time) => {
        let days = moment(time, "DD/MM/YYYY").diff(moment(),'days')
        if(days > 0){
            if(days > moment.duration(parseInt(control.alert),(control.alertUnit == "m" ? "M" : control.alertUnit)).asDays()){
                return {sub:time,text: days + " jours restant",color:"green",value:days}
            }else{
                return {sub:time,text: days + " jours restant",color:"orange",value:days}
            }
        }else{
            return {sub:time,text: Math.abs(days) + " jours de retard",color:"red",value:days}
        }
    }
    getFrequencyLabel = () => {
        if(this.state.controlRaw.firstIsDifferent){
            return "à effectuer au bout de " + (this.state.controlRaw.firstFrequency + " " + this.getUnitLabel(this.state.controlRaw.unit) + " puis tous les " + this.state.controlRaw.frequency + " " + this.getUnitLabel(this.state.controlRaw.unit))
        }else{
            return "à effectuer tous les " + (this.state.controlRaw.frequency + " " + this.getUnitLabel(this.state.controlRaw.unit))
        }
    }

    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
        this.loadVehiclesAndControl();
    }

    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto auto 1fr"}}>
                <EntretienMenu active={this.props.match.params._id}/>
                <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/entretien/controls/"+(this.state.controlRaw.ctrlType))}} tooltip={"Retour aux contrôles" + this.props.match.params._id}/>
                <Message style={{margin:"0"}} icon='wrench' header={this.state.controlRaw.name} content={this.getFrequencyLabel()} />
                <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center">Societe</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Véhicule</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Echéance</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {(this.state.vehiclesOccurrences.length == 0 ?
                                <Table.Row>
                                    <Table.Cell colSpan="4" collapsing textAlign="right">
                                        <p>Aucun véhicule éligible au contrôle </p>
                                    </Table.Cell>
                                </Table.Row>
                                :
                                this.state.vehiclesOccurrences.sort((a,b)=>{if(this.state.controlRaw.unit == "km"){return b.echeance.value - a.echeance.value}else{return a.echeance.value - b.echeance.value}}).map(v=>{
                                    return(
                                        <Table.Row key={v.registration}>
                                            <Table.Cell collapsing textAlign="right">
                                                {this.getSocieteCell(v.vehicle)}
                                            </Table.Cell>
                                            <Table.Cell collapsing textAlign="center">
                                                <b>{v.vehicle.registration}</b>
                                                <br/>
                                                {v.vehicle.brand.name + " - " + v.vehicle.model.name + " (" + v.vehicle.energy.name + ")"}
                                            </Table.Cell>
                                            {this.getEcheanceCell(v)}
                                            <Table.Cell collapsing textAlign="center">
                                                <Popup trigger={<Button icon disabled={v.entretien != null && v.entretien != ""} onClick={()=>this.addEntretien(v.vehicle._id)} icon="calendar outline"/>}>Créer l'entretien</Popup>
                                                <Popup trigger={<Button color="blue" disabled={v.entretien == null || v.entretien == ""} icon onClick={()=>this.props.history.push("/entretien/"+v.entretien)} icon="wrench" style={{marginLeft:"32px"}}/>}>Voir l'entretien</Popup>
                                                <Popup trigger={<Button color="blue" icon onClick={()=>this.props.history.push("/parc/vehicle/"+v.vehicle._id)} icon="car"/>}>Voir le véhicule</Popup>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withRouter(withUserContext(Control));