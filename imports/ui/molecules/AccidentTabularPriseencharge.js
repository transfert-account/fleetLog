import React, { Component, Fragment } from 'react';
import { Button, Form, TextArea, Icon, Checkbox, Input, Segment, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import DocStateLabel from '../atoms/DocStateLabel';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express';
import _ from 'lodash';
import moment from 'moment';

export class AccidentTabularPriseencharge extends Component {

    state={
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
    editPECAccident = () => {
        this.props.closeEdit();
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
    getInfosPanel = () => {
        if(this.props.editing){
            return (
                <Form className="formBoard editing" style={{gridTemplateRows:"auto auto auto auto auto 1fr"}}>
                    <Form.Field>
                        <label>Responsabilité</label>
                        <Button.Group>
                          <Button color="orange" basic={this.state.newResponsabilite != 100} onClick={()=>{this.setResponsabilite(100)}}>100%</Button>
                          <Button.Or/>
                          <Button color="yellow" basic={this.state.newResponsabilite != 50} onClick={()=>{this.setResponsabilite(50)}}>50%</Button>
                          <Button.Or/>
                          <Button color="green" basic={this.state.newResponsabilite != 0} onClick={()=>{this.setResponsabilite(0)}}>0%</Button>
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
                    <Button style={{placeSelf:"center stretch",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.props.closeEdit}>Annuler<Icon name='cancel'/></Button>
                    <Button style={{placeSelf:"center stretch",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editPECAccident}>Sauvegarder<Icon name='check'/></Button>
                </Form>
            )
        }else{
            return(
                <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto 1fr"}}>
                    <div className="labelBoard">Responsabilité</div><div className="valueBoard">{this.props.accident.responsabilite} %</div>
                    <div className="labelBoard">Reglement Assureur</div><div className="valueBoard">{this.props.accident.reglementAssureur} €</div>
                    <div className="labelBoard">Charge Sinistre</div><div className="valueBoard">{this.props.accident.chargeSinistre} €</div>
                    <div className="labelBoard">Montant Interne</div><div className="valueBoard">{this.props.accident.montantInterne} €</div>
                    <div className="labelBoard">Status</div><div className="valueBoard">{this.getStatusLabel()}</div>
                </div>
            )
        }
    }
    getStatusLabel = () => {
        if(this.props.accident.status){
            return <Label color="blue">Ouvert</Label>
        }else{
            return <Label color="grey">Clos</Label>
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Fragment>
            <Segment attached="bottom" style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto 1fr",placeSelf:"stretch",gridColumnEnd:"span 2"}}>
                {this.getInfosPanel()}
            </Segment>
            <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
        </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(AccidentTabularPriseencharge);