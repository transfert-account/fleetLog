import React, { Component, Fragment } from 'react';
import { Table, Modal, Button, Popup, Form, Input, Checkbox, Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ControlRow extends Component {

    state={
        openDeleteControl:false,
        openUpdateControl:false,
        unitsRaw:[
            {type:"distance",unit:"km",label:"km"},
            {type:"time",unit:"d",label:"jours"},
            {type:"time",unit:"m",label:"mois"},
            {type:"time",unit:"y",label:"ans"}
        ],
        unitsOptions : isAlert => {
            if(!isAlert){
                return this.state.unitsRaw.map(u => {return({key:u.unit,text:u.label,value:u.unit})})
            }else{
                if(this.state.unitType == null){
                    return ([{key:"...",text:"...",value:"..."}])
                }else{
                    return this.state.unitsRaw.filter(u=>u.type == this.state.unitType).map(u => {return({key:u.unit,text:u.label,value:u.unit})})
                }
            }
        },
        unitType:[{type:"distance",unit:"km"},{type:"time",unit:"d"},{type:"time",unit:"m"},{type:"time",unit:"y"}].filter(x=>this.props.control.unit == x.unit)[0].type,
        newFirstIsDifferent:this.props.control.firstIsDifferent,
        newFirstFrequency:this.props.control.firstFrequency,
        newName:this.props.control.name,
        newFrequency:this.props.control.frequency,
        newUnit:this.props.control.unit,
        newAlert:this.props.control.alert,
        newAlertUnit:this.props.control.alertUnit,
        updateControlDefinitionQuery: gql`
            mutation updateControlDefinition($_id:String!,$name:String!,$firstIsDifferent:Boolean!,$firstFrequency:Int,$frequency:Int!,$unit:String!,$alert:Int!,$alertUnit:String!){
                updateControlDefinition(_id:$_id,name:$name,firstIsDifferent:$firstIsDifferent,firstFrequency:$firstFrequency,frequency:$frequency,unit:$unit,alert:$alert,alertUnit:$alertUnit){
                    status
                    message
                }
            }
        `,
        deleteControlQuery: gql`
            mutation deleteControl($_id:String!){
                deleteControl(,_id:$_id){
                    status
                    message
                }
            }
        `,
    }
    
    /*SHOW AND HIDE MODALS*/
    showDeleteControl = () => this.setState({openDeleteControl:true})
    closeDeleteControl = () => this.setState({openDeleteControl:false})
    showUpdateControl = () => this.setState({openUpdateControl:true})
    closeUpdateControl = () => this.setState({openUpdateControl:false})
    /*CHANGE HANDLERS*/
    handleChange = e => this.setState({[e.target.name]:e.target.value})
    setFirstIsDifferent = (e,{checked}) => this.setState({newFirstIsDifferent:checked})
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    updateControl = () => {
        if(
            this.state.newName.length == 0 ||
            this.state.newFrequency.length == 0 ||
            this.state.newUnit.length == 0 ||
            this.state.newAlert.length == 0 ||
            this.state.newAlertUnit.length == 0
        ){
            this.props.toast({message:"Des informations nécessaire à la modification du contrôle manquent",type:"error"});
        }else{
            if(
                this.state.newFirstIsDifferent && this.state.newFirstFrequency.length == 0){
                this.props.toast({message:"Des informations nécessaire à la modification du contrôle manquent",type:"error"});
            }else{
                this.props.client.mutate({
                    mutation:this.state.updateControlDefinitionQuery,
                    variables:{
                        _id:this.props.control._id,
                        name:this.state.newName,
                        firstIsDifferent:this.state.newFirstIsDifferent,
                        firstFrequency:parseInt(this.state.newFirstFrequency),
                        frequency:parseInt(this.state.newFrequency),
                        unit:this.state.newUnit,
                        alert:parseInt(this.state.newAlert),
                        alertUnit:this.state.newAlertUnit
                    }
                }).then(({data})=>{
                    data.updateControlDefinition.map(qrm=>{
                        if(qrm.status){
                            this.props.toast({message:qrm.message,type:"success"});
                            this.props.loadControls();
                            this.setState({openUpdateControl:false})
                        }else{
                            this.props.toast({message:qrm.message,type:"error"});
                        }
                    })
                })
            }
        }
    }
    deleteControl = () => {
        this.props.client.mutate({
            mutation:this.state.deleteControlQuery,
            variables:{
                _id:this.props.control._id
            }
        }).then(({data})=>{
            data.deleteControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadControls(this.props.ctrlType);
                    this.closeDeleteControl()
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                    this.closeDeleteControl()
                }
            })
        })

    }
    /*CONTENT GETTERS*/
    getUnitLabel = unit => {
        return this.state.unitsRaw.filter(u=>u.unit == unit)[0].label;
    }
    getFrequencyLabel = () => {
        if(this.props.control.firstIsDifferent){
            return (this.props.control.firstFrequency + " " + this.getUnitLabel(this.props.control.unit) + " puis tous les " + this.props.control.frequency + " " + this.getUnitLabel(this.props.control.unit))
        }else{
            return (this.props.control.frequency + " " + this.getUnitLabel(this.props.control.unit))
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Fragment>
            <Table.Row>
                <Table.Cell>{this.props.control.name}</Table.Cell>
                <Table.Cell collapsing textAlign="center">
                    {this.getFrequencyLabel()}
                </Table.Cell>
                <Table.Cell textAlign="center">{this.props.control.alert + " " + this.getUnitLabel(this.props.control.alertUnit)}</Table.Cell>
                <Table.Cell textAlign="center">
                    <div style={{display:"flex"}}>
                        <Popup trigger={
                            <Button color="blue" icon onClick={this.showUpdateControl} icon="edit"/>
                        }>
                            Modifier le contrôle
                        </Popup>
                        <Popup trigger={
                            <Button color="red" icon onClick={this.showDeleteControl} icon="trash"/>
                        }>
                            Supprimer le contrôle
                        </Popup>
                    </div>
                </Table.Cell>
            </Table.Row>
            <Modal size="mini" closeOnDimmerClick={false} open={this.state.openUpdateControl} onClose={this.closeUpdateControl} closeIcon>
                <Modal.Header>
                    Modification d'un contrôle
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Nom du contrôle</label><input defaultValue={this.state.newName} onChange={this.handleChange} name="newName"/></Form.Field>
                        <Checkbox label='Première occurence differente des suivantes' onChange={this.setFirstIsDifferent} checked={this.state.newFirstIsDifferent}/>
                        {(this.state.newFirstIsDifferent ?
                            <Form.Field style={{placeSelf:"stretch"}}><label>Première fréquence du contrôle</label>
                                <Input name="newFirstFrequency" defaultValue={this.state.newFirstFrequency} onChange={this.handleChange} labelPosition='right' label={
                                    <Dropdown value={this.state.newUnit} onChange={this.handleUnitChange} options={this.state.unitsOptions(false)}/>
                                }/>
                            </Form.Field>
                        :
                            ""
                        )}
                        <Form.Field style={{placeSelf:"stretch"}}><label>Fréquence du contrôle</label>
                            <Input name="newFrequency" defaultValue={this.state.newFrequency} onChange={this.handleChange} labelPosition='right' label={
                                <Dropdown value={this.state.newUnit} onChange={this.handleUnitChange} options={this.state.unitsOptions(false)}/>
                            }/>
                        </Form.Field>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Seuil d'alerte</label>
                            <Input name="newAlert" defaultValue={this.state.newAlert} onChange={this.handleChange} labelPosition='right' label={
                                <Dropdown value={this.state.newAlertUnit} onChange={this.handleAlertUnitChange} options={this.state.unitsOptions(true)}/>
                            }/>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={this.closeUpdateControl}>Annuler</Button>
                    <Button color="green" onClick={this.updateControl}>Valider</Button>
                </Modal.Actions>
            </Modal>
            <Modal size="mini" closeOnDimmerClick={false} open={this.state.openDeleteControl} onClose={this.closeDeleteControl} closeIcon>
                <Modal.Header>
                    Suppresion du contrôle : {this.props.control.name}
                </Modal.Header>
                <Modal.Actions>
                    <Button color="black" onClick={this.closeDeleteControl}>Annuler</Button>
                    <Button color="red" onClick={this.deleteControl}>Supprimer</Button>
                </Modal.Actions>
            </Modal>
        </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(ControlRow);