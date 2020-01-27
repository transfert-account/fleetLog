import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Button, Modal, Form, Label, Icon, Segment, Header } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker'
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

class ControlRow extends Component {

    state={
        detailed:false,
        vehicle:this.props.vehicle._id,
        openAttachEquipement:false,
        newEquipement:null,
        dissociatingTarget:null,
        updateControlTarget:null,
        openDissociateEquipement:false,
        openUpdateControl:false,
        hideLastControlDate:"hide",
        hideLastControlKm:"hide",
        datePickerTarget:"",
        newAttachementDate:"",
        newLastControlDate:"",
        updateControlType:"",
        newUpdatedControlDate:"",
        newUpdatedControlKm:"",
        newLastControlKm:"",
        editing:false,
        controlPeriodUnits:[
            {
                type:{text:"Temps",key:"t",value:"t"},
                units:[
                    {text:"Mois",key:"m",value:"m"},
                    {text:"Ans",key:"y",value:"y"}
                ]
            },
            {
                type:{text:"Distance",key:"d",value:"d"},
                units:[
                    {text:"Kilomètres",key:"km",value:"km"},
                ]
            },
            {
                type:{text:"Temps de route",key:"r",value:"r"},
                units:[
                    {text:"Heures",key:"h",value:"h"},
                ]
            }
        ],
        equipementDescriptions : () => {
            return this.props.equipementDescriptionsRaw.map(e => {return{text:e.name,key:e._id,value:e._id}})
        },
        attachEquipementToVehicleQuery : gql`
            mutation attachEquipementToVehicle($vehicle:String!,$equipementDescription:String!,$attachementDate:String!,$lastControl:String!){
                attachEquipementToVehicle(vehicle:$vehicle,equipementDescription:$equipementDescription,attachementDate:$attachementDate,lastControl:$lastControl)
            }
        `,
        dissociateEquipementQuery : gql`
            mutation dissociateEquipement($id:String!){
                dissociateEquipement(id:$id)
            }
        `,
        updateControlEquipementQuery: gql`
        mutation updateControlEquipement($id:String!,$updatedControlValue:String!){
            updateControlEquipement(id:$id,updatedControlValue:$updatedControlValue)
        }
    `,
    }

    showAttachEquipement = () => {
        this.setState({openAttachEquipement:true})
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    showDissociateEquipement = id => {
        this.setState({dissociatingTarget:id,openDissociateEquipement:true})
    }
    showUpdateControlDate = id => {
        if(this.props.vehicle.equipements.filter(x=>x._id == id)[0].equipementDescription.controlPeriodUnit=="km"){
            this.setState({updateControlTarget:id,openUpdateControl:true,updateControlType:this.props.vehicle.equipements.filter(x=>x._id == id)[0].equipementDescription.controlPeriodUnit,hideLastControlKm:"",hideLastControlDate:"hide"})
        }else{
            this.setState({updateControlTarget:id,openUpdateControl:true,updateControlType:this.props.vehicle.equipements.filter(x=>x._id == id)[0].equipementDescription.controlPeriodUnit,hideLastControlDate:"",hideLastControlKm:"hide"})
        }
    }
    closeAttachEquipement = () => {
        this.setState({openAttachEquipement:false})
    }
    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    closeDissociateEquipement = () => {
        this.setState({openDissociateEquipement:false})
    }
    closeUpdateControl = () => {
        this.setState({openUpdateControl:false})
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleChangeEquipement = (e, { value }) => {
        if(this.props.equipementDescriptionsRaw.filter(x=>x._id == value)[0].controlPeriodUnit=="km"){
            this.setState({ newEquipement:value, hideLastControlKm:"",hideLastControlDate:"hide"})
        }else{
            this.setState({ newEquipement:value, hideLastControlDate:"",hideLastControlKm:"hide"})
        }
    }
    attachEquipement = () => {
        let newLastControl = "";
        if(this.props.equipementDescriptionsRaw.filter(x=>x._id == this.state.newEquipement)[0].controlPeriodUnit=="km"){
            newLastControl = this.state.newLastControlKm;
        }else{
            newLastControl = this.state.newLastControlDate;
        }
        this.closeAttachEquipement();
        this.props.client.mutate({
            mutation:this.state.attachEquipementToVehicleQuery,
            variables:{
                vehicle:this.state.vehicle,
                equipementDescription:this.state.newEquipement,
                lastControl:newLastControl,
                attachementDate:this.state.newAttachementDate
            }
        }).then(({data})=>{
            this.props.loadVehicles();
        })
    }
    dissociateEquipement = () => {
        this.closeDissociateEquipement();
        this.props.client.mutate({
            mutation:this.state.dissociateEquipementQuery,
            variables:{
                id:this.state.dissociatingTarget,
            }
        }).then(({data})=>{
            this.props.loadVehicles();
        })
    }
    updateControlEquipement = () => {
        let newUpdatedControlValue;
        if(this.props.vehicle.equipements.filter(x=>x._id == this.state.updateControlTarget)[0].equipementDescription.controlPeriodUnit=="km"){
            newUpdatedControlValue = this.state.newUpdatedControlKm
        }else{
            newUpdatedControlValue = this.state.newUpdatedControlDate
        }
        this.closeUpdateControl();
        this.props.client.mutate({
            mutation:this.state.updateControlEquipementQuery,
            variables:{
                id:this.state.updateControlTarget,
                updatedControlValue:newUpdatedControlValue
            }
        }).then(({data})=>{
            this.props.loadVehicles();
        })
    }
    getTimeBetween = (time) => {
        if(moment(time, "DD/MM/YYYY").diff(moment())){
            return moment(time, "DD/MM/YYYY").fromNow();
        }else{
            return moment(time, "DD/MM/YYYY").toNow();
        }
    }
    getLastControlCell = e => {
        if(e.equipementDescription.controlPeriodUnit == "y" || e.equipementDescription.controlPeriodUnit == "m"){
            return(
                <div>
                    {e.lastControl}
                    <Label style={{marginLeft:"16px"}} size="small" horizontal>
                        {this.getTimeBetween(e.lastControl)}
                    </Label>
                </div>
            )
        }else{
            return (
                <div>
                    {e.lastControl} km
                    <Label style={{marginLeft:"16px"}} size="small" horizontal>
                        il y a {this.props.vehicle.km - e.lastControl} km
                    </Label>
                </div>
            )
        }
    }
    getNextControlCell = e => {
        if(e.equipementDescription.controlPeriodUnit == "y" || e.equipementDescription.controlPeriodUnit == "m"){
            e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,e.equipementDescription.controlPeriodUnit.toUpperCase()).format("DD/MM/YYYY")
            return (
                <div>
                    {e.nextControl}
                    <Label color={e.color} style={{marginLeft:"16px"}} size="small" horizontal>
                        {this.getTimeBetween(e.nextControl)}
                    </Label>
                </div>
            )
        }else{
            if(e.nextControl > 0){
                return (
                    <div>
                        {parseInt(e.lastControl) + parseInt(e.equipementDescription.controlPeriodValue)} km
                        <Label color={e.color} style={{marginLeft:"16px"}} size="small" horizontal>
                            dans {e.nextControl} km
                        </Label>
                    </div>
                )
            }else{
                return (
                    <div>
                        {parseInt(e.lastControl) + parseInt(e.equipementDescription.controlPeriodValue)} km
                        <Label color={e.color} style={{marginLeft:"16px"}} size="small" horizontal>
                            dépassé de {Math.abs(e.nextControl)} km
                        </Label>
                    </div>
                )
            }
        }
    }
    getDetailShowAndHideButton = () => {
        if(this.state.detailed){
            return <Button size="tiny" style={{gridColumnStart:"5"}} icon color="teal" onClick={()=>{this.setState({detailed:false})}} labelPosition='right'> Equipements <Icon name='angle double up' /></Button>
        }else{
            return <Button size="tiny" style={{gridColumnStart:"5"}} icon color="teal" onClick={()=>{this.setState({detailed:true})}} labelPosition='right'> Equipements <Icon name='angle double down' /></Button>
        }
    }
    getRed = () => {
        if(this.props.vehicle.red > 0){
            return (
                <Label circular color='red' horizontal>
                    {this.props.vehicle.red}
                </Label>
            )
        }
    }
    getOrange = () => {
        if(this.props.vehicle.orange > 0){
            return (
                <Label circular color='orange' horizontal>
                    {this.props.vehicle.orange}
                </Label>
            )
        }
    }
    getGreen = () => {
        if(this.props.vehicle.red + this.props.vehicle.orange == 0){
            return (
                <Label circular color='green' horizontal>
                    {this.props.vehicle.green}
                </Label>
            )
        }else{
            if(this.props.vehicle.green > 0){
                return (
                    <Label circular color='green' horizontal>
                        {this.props.vehicle.green}
                    </Label>
                )
            }
        }
    }
    getAlertLabel = () => {
        return (
            <div style={{display:"inline"}}>
                {this.getRed()}
                {this.getOrange()}
                {this.getGreen()}
            </div>
        )
    }
    getEquipementRows = () => {
        if(this.state.detailed){
            return (
                <Table style={{marginBottom:"40px"}} celled selectable compact='very'>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell width={2}>Nom</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Attaché le</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Dernier contrôle</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Prochain contrôle</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.vehicle.equipements.map(e=>{
                            return(
                                <Table.Row key={e._id}>
                                    <Table.Cell>{e.equipementDescription.name}</Table.Cell>
                                    <Table.Cell>
                                        {e.attachementDate}
                                        <Label style={{marginLeft:"16px"}} size="small" horizontal>
                                            {this.getTimeBetween(e.attachementDate)}
                                        </Label>
                                    </Table.Cell>
                                    <Table.Cell>{this.getLastControlCell(e)}</Table.Cell>
                                    <Table.Cell>{this.getNextControlCell(e)}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Button circular color="green" inverted icon onClick={()=>{this.showUpdateControlDate(e._id)}} icon="wrench" />
                                        <Button circular color="red" inverted icon onClick={()=>{this.showDissociateEquipement(e._id)}} icon="cancel" />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <Segment style={{display:'grid',gridTemplateColumns:"auto 1fr 8fr auto auto"}}>
                    <div style={{display:"inline",marginBottom:"0"}}>
                        <Label size="large" color='black' horizontal>
                            {this.props.vehicle.registration}
                        </Label>
                    </div>
                    {this.getAlertLabel()}
                    <div style={{placeSelf:"center"}}>{"["+this.props.vehicle.societe.name + "] "}    <Header style={{margin:"auto 32px",display:"inline"}} size='medium'>{this.props.vehicle.brand + " - " +this.props.vehicle.model}</Header>{" (" + this.props.vehicle.km + " km)"}</div>
                    <Button size="tiny" style={{gridColumnStart:"4"}} icon color="blue" onClick={this.showAttachEquipement} labelPosition='right'> Attacher un equipement <Icon name='plus' /></Button>
                    {this.getDetailShowAndHideButton()}
                </Segment>
                {this.getEquipementRows()}
                <Modal closeOnDimmerClick={false} open={this.state.openAttachEquipement} onClose={this.closeAttachEquipement} closeIcon>
                    <Modal.Header>
                        Attacher un equipement à ce véhicule :
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",margin:"auto 25%",gridTemplateRows:"1fr 1fr 1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field><label>Equipement</label><Dropdown placeholder='Choisir un equipement' search selection onChange={this.handleChangeEquipement} options={this.state.equipementDescriptions()}/></Form.Field>
                            <Form.Field><label>Attaché le </label><input onChange={this.handleChange} value={this.state.newAttachementDate} onFocus={()=>{this.showDatePicker("newAttachementDate")}} placeholder="Date de rattachement"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlDate}><label>Dernier controle (date)</label><input onChange={this.handleChange} value={this.state.newLastControlDate} onFocus={()=>{this.showDatePicker("newLastControlDate")}} placeholder="Date du dernier contrôle"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlKm}><label>Kilométrage au dernier controle</label><input onChange={this.handleChange} value={this.state.newLastControlKm} name="newLastControlKm" placeholder="Kilométrage au dernier contrôle"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAttachEquipement}>Annuler</Button>
                        <Button color="blue" onClick={this.attachEquipement}>Attacher</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDissociateEquipement} onClose={this.closeDissociateEquipement} closeIcon>
                    <Modal.Header>
                        Dissocier cet equipement du véhicule :
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDissociateEquipement}>Annuler</Button>
                        <Button color="red" onClick={this.dissociateEquipement}>Dissocier</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openUpdateControl} onClose={this.closeUpdateControl} closeIcon>
                    <Modal.Header>
                        Mise à jour du contrôle de l'equipement :
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",margin:"auto 25%",gridTemplateRows:"1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field className={this.state.hideLastControlDate}><label>Date de contrôle</label><input onChange={this.handleChange} name="newUpdatedControlDate" value={this.state.newUpdatedControlDate} onFocus={()=>{this.showDatePicker("newUpdatedControlDate")}} placeholder="Date du contrôle"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlKm}><label>Kilomètre au contrôle</label><input onChange={this.handleChange} name="newUpdatedControlKm" value={this.state.newUpdatedControlKm} placeholder="Kilomètre au contrôle"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeUpdateControl}>Annuler</Button>
                        <Button color="green" onClick={this.updateControlEquipement}>Mettre à jour</Button>
                    </Modal.Actions>
                </Modal>
                <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                <ModalDatePicker onSelectDatePicker={this.onSelectUpdateControlDatePicker} closeDatePicker={this.closeUpdateControlDatePicker} open={this.state.openUpdateControlDatePicker}/>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(ControlRow);