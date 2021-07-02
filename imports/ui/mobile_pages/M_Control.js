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
            query vehiclesByControl($key:String!){
                vehiclesByControl(key:$key){
                    control{
                        key
                        name
                        unit
                        frequency
                    }
                    vehiclesOccurrences{
                        lastOccurrence
                        entretien
                        vehicle{
                            _id
                            societe{
                                _id
                                name
                            }
                            registration
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
        vehiclesRaw:[],
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
                key:this.props.match.params.key
            },
            fetchPolicy:'network-only'
        }).then(({data})=>{
            this.setState({
                controlRaw:data.vehiclesByControl.control,
                vehiclesRaw:this.setEcheanceValues(data.vehiclesByControl.control,data.vehiclesByControl.vehiclesOccurrences)
            })
        })
    }
    addEntretien = v => {
        this.props.client.mutate({
            mutation:this.state.createEntretienFromControlQuery,
            variables:{
                vehicle:v,
                control:this.props.match.params.key
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
    formatUnit = u => {
        if(u=="m")return"mois"
        if(u=="y")return"ans"
        if(u=="km")return"km"
        return "unité inconnue"
    }
    getEcheanceCell = v => {
        return (
            <Fragment>
                {v.echeance.sub ? v.echeance.sub : ""}
                <Label style={{marginLeft:"32px"}} size="large" color={v.echeance.color}>
                    {v.echeance.text}
                </Label>
            </Fragment>
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
    setEcheanceValues = (control,vs) => {
        vs.forEach(v=>{
            let color = "";
            let text = "";
            if(v.lastOccurrence == "none"){
                v.echeance = {value:"0",text:"Aucun contrôle précedent",color:"grey"}
            }else{
                if(control.unit == "km"){
                    if(parseInt(v.lastOccurrence) > parseInt(v.vehicle.km)){
                        v.echeance = {value:"1",text:"Kilométrage du contrôle supérieur à celui du véhicule",color:"red"}
                    }else{
                        let left = parseInt(v.vehicle.km - (parseInt(v.lastOccurrence) + parseInt(control.frequency)));
                        if(left>=0){
                            color = "red"
                            text = " de retard"
                        }else{
                            text = " restant"
                            if(left>-2000){
                                color = "orange"
                            }else{
                                if(left<=-2000){
                                    color = "green"
                                }else{
                                    color = "grey"
                                }
                            }
                        }
                        v.echeance = {value:left,text:Math.abs(left).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + this.formatUnit("km") + text,color:color}
                    }
                }else{
                    let res = this.getTimeFromNow(control,moment(v.lastOccurrence,"DD/MM/YYYY").add(control.frequency,(control.unit == "m" ? "M" : control.unit)).format("DD/MM/YYYY"))
                    v.echeance = {value:res.value,text:res.text,color:res.color,sub:res.sub}
                }
            }
        })
        return vs;
    }

    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
        this.loadVehiclesAndControl();
    }

    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto auto 1fr"}}>
                <EntretienMenu active={(this.props.match.params.key[0] == "o" ? "obli" : "prev")}/>
                <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/entretien/controls/"+(this.props.match.params.key[0] == "o" ? "obli" : "prev"));}} tooltip={"Retour aux contrôles" + (this.props.match.params.key[0] == "o" ? " obligatoires" : " préventifs")}/>
                <Message style={{margin:"0"}} icon='wrench' header={this.state.controlRaw.name} content={"à effectuer tous les " + this.state.controlRaw.frequency + " " + this.formatUnit(this.state.controlRaw.unit)} />
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
                            {this.state.vehiclesRaw.sort((a,b)=>{if(this.state.controlRaw.unit == "km"){return b.echeance.value - a.echeance.value}else{return a.echeance.value - b.echeance.value}}).map(v=>{
                                console.log(v.entretien)
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
                                        <Table.Cell textAlign="center">{this.getEcheanceCell(v)}</Table.Cell>
                                        <Table.Cell collapsing textAlign="center">
                                            <Popup trigger={<Button icon disabled={v.entretien != null && v.entretien != ""} onClick={()=>this.addEntretien(v.vehicle._id)} icon="calendar outline"/>}>Créer l'entretien</Popup>
                                            <Popup trigger={<Button color="blue" disabled={v.entretien == null || v.entretien == ""} icon onClick={()=>this.props.history.push("/entretien/"+v.entretien)} icon="wrench" style={{marginLeft:"32px"}}/>}>Voir l'entretien</Popup>
                                            <Popup trigger={<Button color="blue" icon onClick={()=>this.props.history.push("/parc/vehicle/"+v.vehicle._id)} icon="car"/>}>Voir le véhicule</Popup>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
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