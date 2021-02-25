import React, { Component, Fragment } from 'react';
import { Button, Form, TextArea, Icon, Checkbox, Input, Segment, Label, Header } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import DocStateLabel from '../atoms/DocStateLabel';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express';
import _ from 'lodash';
import moment from 'moment';

export class AccidentTabularDeclaration extends Component {

    state={
        //PARTIE DECLARATION
        datePickerTarget:"",
        newVehicle:this.props.accident.vehicle._id,
        newOccurenceDate:this.props.accident.occurenceDate,
        newConstatSent:this.props.accident.constatSent,
        newDateExpert:this.props.accident.dateExpert,
        newDateTravaux:this.props.accident.dateTravaux,
        newCost:this.props.accident.cost,
        newConstat:null,
        newRapportExp:null,
        newFacture:null,
        openDatePicker:false,
        newDescription:this.props.accident.description,
        editAccidentQuery : gql`
            mutation editAccident($_id:String!,$occurenceDate:String!,$dateExpert:String!,$dateTravaux:String!,$constatSent:Boolean!,$cost:Float!){
                editAccident(_id:$_id,occurenceDate:$occurenceDate,dateExpert:$dateExpert,dateTravaux:$dateTravaux,constatSent:$constatSent,cost:$cost){
                    status
                    message
                }
            }
        `,
        editDescAccidentQuery : gql`
            mutation editDescAccident($_id:String!,$description:String!){
                editDescAccident(_id:$_id,description:$description){
                    status
                    message
                }
            }
        `,
        //PARTIE PRISE EN CHARGE
        newResponsabilite:this.props.accident.responsabilite,
        newReglementAssureur:this.props.accident.reglementAssureur,
        newChargeSinistre:this.props.accident.chargeSinistre,
        newMontantInterne:this.props.accident.montantInterne,
        newStatus:this.props.accident.status,
        editPECAccidentQuery : gql`
            mutation editPECAccident($_id:String!,$responsabilite:Int!,$reglementAssureur:Float!,$chargeSinistre:Float!,$montantInterne:Float!,$status:Boolean!){
                editPECAccident(_id:$_id,responsabilite:$responsabilite,reglementAssureur:$reglementAssureur,chargeSinistre:$chargeSinistre,montantInterne:$montantInterne,status:$status){
                    status
                    message
                }
            }
        `
    }
    
    /*SHOW AND HIDE MODALS*/
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleEditDesc = (e,{value}) => {
        this.setState({
            newDescription:value
        });
        this.editDesc();
    }
    handleConstatSentChange = checked => {
        this.setState({
            newConstatSent:checked
        });
    }
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleStatusChange = checked => {
        this.setState({
            newStatus:checked
        });
    }
    setResponsabilite = v => {
      this.setState({newResponsabilite:v})
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescAccidentQuery,
            variables:{
                _id:this.props.accident._id,
                description:this.state.newDescription
            }
        }).then(({data})=>{
            data.editDescAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);
    editAccident = () => {
        this.props.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editAccidentQuery,
            variables:{
                _id:this.props.accident._id,
                occurenceDate:this.state.newOccurenceDate,
                dateExpert:this.state.newDateExpert,
                dateTravaux:this.state.newDateTravaux,
                constatSent:this.state.newConstatSent,
                cost:parseFloat(this.state.newCost),
            }
        }).then(({data})=>{
            data.editAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAccident();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescAccidentQuery,
            variables:{
                _id:this.props.accident._id,
                description:this.state.newDescription
            }
        }).then(({data})=>{
            data.editDescAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);
    editPECAccident = () => {
        this.props.closeEditPEC();
        this.props.client.mutate({
            mutation:this.state.editPECAccidentQuery,
            variables:{
              _id:this.props.accident._id,
              responsabilite:parseInt(this.state.newResponsabilite),
              reglementAssureur:parseFloat(this.state.newReglementAssureur),
              chargeSinistre:parseFloat(this.state.newChargeSinistre),
              montantInterne:parseFloat(this.state.newMontantInterne),
              status:this.state.newStatus
            }
        }).then(({data})=>{
            data.editPECAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAccident();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    /*CONTENT GETTERS*/
    getDeclarationPanel = () => {
        if(this.props.editing){
            return (
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment raised>
                        <Header as="h3">Déclaration</Header>
                    </Segment>
                    <Segment raised style={{placeSelf:"stretch"}}>
                        <Form className="formBoard editing" style={{gridTemplateRows:"auto auto auto 1fr auto",height:"100%"}}>
                            <Form.Field>
                                <label>Date de l'accident</label>
                                <Input value={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} name="newOccurenceDate"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Date du passage de l'expert</label>
                                <Input value={this.state.newDateExpert} onFocus={()=>{this.showDatePicker("newDateExpert")}} name="newDateExpert"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Date des travaux</label>
                                <Input value={this.state.newDateTravaux} onFocus={()=>{this.showDatePicker("newDateTravaux")}} name="newDateTravaux"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Cout total de l'accident</label>
                                <Input defaultValue={this.state.newCost} onChange={this.handleChange} name="newCost"/>
                            </Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2",placeSelf:"center"}}>
                                <label>Constat envoyé à l'assurance</label>
                                <Checkbox defaultChecked={this.state.newConstatSent} onChange={(e,{checked})=>{this.handleConstatSentChange(checked)}} toggle />
                            </Form.Field>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.props.closeEdit}>Annuler<Icon name='cancel'/></Button>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editAccident}>Sauvegarder<Icon name='check'/></Button>
                        </Form>
                    </Segment>
                </Segment.Group>
            )
        }else{
            return(
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment raised>
                        <Header as="h3">Déclaration</Header>
                    </Segment>
                    <Segment raised style={{placeSelf:"stretch",margin:"0"}}>
                        <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto auto 1fr",height:"100%"}}>
                            <div className="labelBoard">Societé :</div><div className="valueBoard">{this.props.accident.societe.name}</div>
                            <div className="labelBoard">Date de l'accident :</div><div className="valueBoard">{this.props.accident.occurenceDate}</div>
                            <div className="labelBoard">Date de passage de l'expert :</div><div className="valueBoard">{this.props.accident.dateExpert}</div>
                            <div className="labelBoard">Date des travaux :</div><div className="valueBoard">{this.props.accident.dateTravaux}</div>
                            <div className="labelBoard">Constat envoyé à l'assurance :</div><div className="valueBoard">{this.getConstatSentLabel()}</div>
                            <div className="labelBoard">Coût total de l'accident :</div><div className="valueBoard">{this.props.accident.cost} €</div>
                        </div>
                    </Segment>
                </Segment.Group>
            )
        }
    }
    getConstatSentLabel = () => {
        if(this.props.accident.constatSent){
            return <Label color="green">Constat envoyé</Label>
        }else{
            return <Label color="red">En attente</Label>
        }
    }
    getNullableValue = v => {
        if(v == -1){
            return "n/a"
        }else{
            return v + " €"
        }
    }

    getPECPanel = () => {
        if(this.props.editingPEC){
            return (
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment raised>
                        <Header as="h3">Prise en charge</Header>
                    </Segment>
                    <Segment raised style={{placeSelf:"stretch",margin:"0"}}>
                        <Form className="formBoard editing" style={{gridTemplateRows:"auto auto auto 1fr auto",height:"100%"}}>
                            <Form.Field>
                                <label>Responsabilité</label>
                                <Button.Group>
                                <Button color="orange" basic={this.state.newResponsabilite != 100} onClick={()=>{this.setResponsabilite(100)}}>100%</Button>
                                <Button.Or/>
                                <Button color="yellow" basic={this.state.newResponsabilite != 50} onClick={()=>{this.setResponsabilite(50)}}>50%</Button>
                                <Button.Or/>
                                <Button color="green" basic={this.state.newResponsabilite != 0} onClick={()=>{this.setResponsabilite(0)}}>0%</Button>
                                <Button.Or/>
                                <Button color="grey" basic={this.state.newResponsabilite != -1} onClick={()=>{this.setResponsabilite(-1)}}>n/a</Button>
                                </Button.Group>
                            </Form.Field>
                            <Form.Field>
                                <label>Montant du réglement assureur</label>
                                <Input defaultValue={this.state.newReglementAssureur} onChange={this.handleChange} name="newReglementAssureur"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Charge sinistre</label>
                                <Input defaultValue={this.state.newChargeSinistre} onChange={this.handleChange} name="newChargeSinistre"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Montant interne</label>
                                <Input defaultValue={this.state.newMontantInterne} onChange={this.handleChange} name="newMontantInterne"/>
                            </Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2",placeSelf:"center"}}>
                                <label>Statut</label>
                                <Checkbox defaultChecked={this.state.newStatus} onChange={(e,{checked})=>{this.handleStatusChange(checked)}} toggle />
                            </Form.Field>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.props.closeEditPEC}>Annuler<Icon name='cancel'/></Button>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editPECAccident}>Sauvegarder<Icon name='check'/></Button>
                        </Form>
                    </Segment>
                </Segment.Group>
            )
        }else{
            return(
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment raised>
                        <Header as="h3">Prise en charge</Header>
                    </Segment>
                    <Segment raised style={{placeSelf:"stretch",margin:"0"}}>
                        <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto 1fr",height:"100%"}}>
                            <div className="labelBoard">Responsabilité :</div><div className="valueBoard">{this.getPECLabel()}</div>
                            <div className="labelBoard">Reglement Assureur :</div><div className="valueBoard">{this.getNullableValue(this.props.accident.reglementAssureur)}</div>
                            <div className="labelBoard">Charge Sinistre :</div><div className="valueBoard">{this.getNullableValue(this.props.accident.chargeSinistre)}</div>
                            <div className="labelBoard">Montant Interne :</div><div className="valueBoard">{this.getNullableValue(this.props.accident.montantInterne)}</div>
                            <div className="labelBoard">Status :</div><div className="valueBoard">{this.getStatusLabel()}</div>
                        </div>
                    </Segment>
                </Segment.Group>  
            )
        }
    }
    getStatusLabel = () => {
        if(this.props.accident.status){
            return <Label color="orange">Ouvert</Label>
        }else{
            return <Label color="green">Clos</Label>
        }
    }
    getPECLabel = () => {
        if(this.props.accident.responsabilite == 100){
            return <Label color="orange">100 %</Label>
        }
        if(this.props.accident.responsabilite == 50){
            return <Label color="yellow">50 %</Label>
        }
        if(this.props.accident.responsabilite == 0){
            return <Label color="green">0 %</Label>
        }
        if(this.props.accident.responsabilite == -1){
            return <Label color="grey">A définir</Label>
        }
        return <Label color="red">err</Label>
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Fragment>
            <div style={{textAlign:"center",display:"grid",gridGap:"20px",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr auto auto",placeSelf:"stretch",gridColumnEnd:"span 2"}}>
                {this.getDeclarationPanel()}
                {this.getPECPanel()}
                <Segment.Group style={{gridColumnEnd:"span 2",margin:"0"}}>
                    <Segment raised>
                        <Header as="h3">Documents</Header>
                    </Segment>
                    <Segment raised style={{display:"flex",justifyContent:"center"}}>
                        <DocStateLabel opened color={this.props.accident.constat._id == "" ? "red" : "green"} title="Constat"/>
                        <DocStateLabel opened color={this.props.accident.rapportExp._id == "" ? "red" : "green"} title="Rapport de l'expert"/>
                        <DocStateLabel opened color={this.props.accident.facture._id == "" ? "red" : "green"} title="Facture"/>
                    </Segment>
                </Segment.Group>
                <Segment.Group style={{gridColumnEnd:"span 2",margin:"0"}}>
                    <Segment raised>
                        <Header as="h3">Note concernant l'accident</Header>
                    </Segment>
                    <Segment raised style={{display:"grid",gridTemplateRows:"1fr"}}>
                        <TextArea rows="5" className="textarea" name="newDescription" style={{border:"2px solid #d9d9d9",margin:"8px",placeSelf:"stretch"}} defaultValue={this.state.newDescription} onChange={this.handleEditDesc}/>
                    </Segment>
                </Segment.Group>
            </div>
            <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
        </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(AccidentTabularDeclaration);