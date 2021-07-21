import React, { Component, Fragment } from 'react';
import { Message, Table, Popup, Button, Label, Segment, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import EntretienMenu from '../molecules/EntretienMenu';
import BigIconButton from '../elements/BigIconButton';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import { saveAs } from 'file-saver';

export class Control extends Component {

    state={
        vehiclesByControlQuery : gql`
            query vehiclesByControl($_id:String!,$societe:String!){
                vehiclesByControl(_id:$_id,societe:$societe){
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
                        echeance
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
        openExcelExport:false,
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
        filters:[
            {color:"blue",value:"all",icon:"filter",text:"Tous"},
            {color:"green",value:"inTime",icon:"filter",text:"Dans les temps"},
            {color:"orange",value:"soon",icon:"filter",text:"En alerte"},
            {color:"red",value:"late",icon:"filter",text:"En retard"},
            {color:"grey",value:"inactive",icon:"filter",text:"Non éligible"}
        ],
        getTableBody : () => {
            let displayed = JSON.parse(JSON.stringify(this.state.vehiclesOccurrences));
            if(this.props.match.params.filter == "inTime" || this.props.match.params.filter == "soon" || this.props.match.params.filter == "late"){
                displayed = displayed.filter(v=>v.timing == this.props.match.params.filter)
            }else{
                if(this.props.match.params.filter == "inactive"){
                    displayed = displayed.filter(v=>v.timing == null)
                }
            }
            if(displayed.length == 0){
                return (
                    <Table.Row>
                        <Table.Cell colSpan="4" collapsing textAlign="center">
                            <p>Aucun véhicule ne correspond au filte actuel</p>
                        </Table.Cell>
                    </Table.Row>
                )
            }else{
                return(
                    displayed.sort((a,b)=>{
                        if(a.timing == null){
                            return 1
                        }else{
                            return a.echeance - b.echeance
                        }
                    }).map(v=>{
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
                                {this.getActionCell(v)}
                            </Table.Row>
                        )
                    })
                )
            }
        }
    }
    
    /*SHOW AND HIDE MODALS*/
    showExcelExport = () => {this.setState({openExcelExport:true})}
    closeExcelExport = () => {this.setState({openExcelExport:false})}
    /*CHANGE HANDLERS*/
    navigateToFilter = filter => {
        this.props.history.push("/entretien/control/" + this.props.match.params._id + "/" + filter);
    }
    export = () => {
        let exp = [];
        let displayed = JSON.parse(JSON.stringify(this.state.vehiclesOccurrences));
        if(this.props.match.params.filter == "inTime" || this.props.match.params.filter == "soon" || this.props.match.params.filter == "late"){
            displayed = displayed.filter(v=>v.timing == this.props.match.params.filter)
        }else{
            if(this.props.match.params.filter == "unaffected"){
                displayed = displayed.filter(v=>v.timing == null)
            }
        }
        displayed.sort((a,b)=>{
            if(a.timing == null){
                return 1
            }else{
                return a.echeance - b.echeance
            }
        }).map(v=>{
            exp.push({
                "Opéré par":v.vehicle.shared ? v.vehicle.sharedTo.name : v.vehicle.societe.name,
                "Vehicule":v.vehicle.brand.name + " - " + v.vehicle.model.name + " (" + v.vehicle.energy.name + ")",
                "Immatriculation":v.vehicle.registration,
                "Contrôle":this.state.controlRaw.name,
                "Frequence":(this.state.controlRaw.firstIsDifferent ? this.state.controlRaw.firstFrequency + " " + this.getUnitLabel(this.state.controlRaw.unit) + " => " + this.state.controlRaw.frequency + " " + this.getUnitLabel(this.state.controlRaw.unit) : this.state.controlRaw.frequency + " " + this.getUnitLabel(this.state.controlRaw.unit)),
                "Alerte":this.state.controlRaw.alert + " " + this.getUnitLabel(this.state.controlRaw.alertUnit),
                "Dernier contrôle":v.lastOccurrence,
                "Echéance":v.label
            })
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "controls "+(new Date().getDate()) +"_"+ (new Date().getMonth() + 1).toString().padStart(2,'0') +"_"+ new Date().getFullYear());
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+displayed.length+"v_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    loadVehiclesAndControl = () => {
        this.props.client.query({
            query:this.state.vehiclesByControlQuery,
            variables:{
                _id:this.props.match.params._id,
                societe:this.props.societeFilter
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
    getActionCell = v => {
        if(v.echeance == "-1"){
            return (
                <Table.Cell collapsing textAlign="center">
                    <Popup trigger={<Button color="blue" icon onClick={()=>this.props.history.push("/parc/vehicle/"+v.vehicle._id)} icon="car"/>}>Voir le véhicule</Popup>
                </Table.Cell>
            )
        }else{
            return (
                <Table.Cell collapsing textAlign="center">
                    <Popup trigger={<Button icon disabled={v.entretien != null && v.entretien != ""} onClick={()=>this.addEntretien(v.vehicle._id)} icon="calendar outline"/>}>Créer l'entretien</Popup>
                    <Popup trigger={<Button color="blue" disabled={v.entretien == null || v.entretien == ""} icon onClick={()=>this.props.history.push("/entretien/"+v.entretien)} icon="wrench" style={{marginLeft:"32px"}}/>}>Voir l'entretien</Popup>
                    <Popup trigger={<Button color="blue" icon onClick={()=>this.props.history.push("/parc/vehicle/"+v.vehicle._id)} icon="car"/>}>Voir le véhicule</Popup>
                </Table.Cell>
            )
        }
    }

    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
        this.loadVehiclesAndControl();
    }

    render() {
        return (
            <Fragment>
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto auto 1fr auto"}}>
                    <EntretienMenu active={this.props.match.params._id}/>
                    <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/entretien/controls/"+(this.state.controlRaw.ctrlType))}} tooltip={"Retour aux contrôles" + this.props.match.params._id}/>
                    <Message style={{margin:"0"}} icon='wrench' header={this.state.controlRaw.name} content={this.getFrequencyLabel()} />
                    <BigIconButton icon="file excel outline" color="green" onClick={this.showExcelExport} tooltip={"Export excel"}/>
                    <Segment style={{gridRowStart:"2",gridColumnEnd:"span 4",display:"grid",gridTemplateColumns:"1fr auto auto",margin:"0"}}>
                        <div style={{display:"flex",justifyContent:"start",placeSelf:"stretch"}}>
                            {this.state.filters.map(f=><Button color={(this.props.match.params.filter == f.value ? f.color : "")} onClick={()=>this.navigateToFilter(f.value)} size="big" content={f.text}/>)}
                        </div>
                    </Segment>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 4",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
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
                                {this.state.getTableBody()}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <Modal open={this.state.openExcelExport} onClose={this.closeExcelExport} closeIcon>
                    <Modal.Header>
                        Export excel
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        Le contenu du tableau, tenant compte de la valeur actuelle des filtres appliqués, sera exporté dans un fichier excel.
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeExcelExport}>Annuler</Button>
                        <Button color="green" onClick={this.export}>Exporter</Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withRouter(withUserContext(Control));