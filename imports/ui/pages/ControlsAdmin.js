import React, { Component, Fragment } from 'react';
import { Form, Input, Dropdown, Checkbox, Modal, Button, Menu, Label, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import AdministrationMenu from '../molecules/AdministrationMenu';
import ControlRow from '../molecules/ControlRow.js';
import BigIconButton from '../elements/BigIconButton';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ControlsAdmin extends Component {

    state={
        activePanel:"obli",
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
        unitsRaw:[
            {type:"distance",unit:"km",label:"km"},
            {type:"time",unit:"d",label:"jours"},
            {type:"time",unit:"m",label:"mois"},
            {type:"time",unit:"y",label:"ans"}
        ],
        obliRaw:[],
        prevRaw:[],
        openAddControl:false,
        unitType:null,
        newIsObli:true,
        newIsPrev:false,
        newFirstIsDifferent:false,
        newFirstFrequency:"",
        newName:"",
        newFrequency:"",
        newUnit:"",
        newAlert:"",
        newAlertUnit:"",
        newCtrlType:"obli",
        addControlQuery: gql`
            mutation addControl($name:String!,$firstIsDifferent:Boolean!,$firstFrequency:Int!,$frequency:Int!,$unit:String!,$alert:Int!,$alertUnit:String!,$ctrlType:String!){
                addControl(name:$name,firstIsDifferent:$firstIsDifferent,firstFrequency:$firstFrequency,frequency:$frequency,unit:$unit,alert:$alert,alertUnit:$alertUnit,ctrlType:$ctrlType){
                    status
                    message
                }
            }
        `,
        controlsQuery: gql`
            query controls($ctrlType:String!){
                controls(ctrlType:$ctrlType){
                        _id
                        name
                        firstIsDifferent
                        firstFrequency
                        frequency
                        unit
                        alert
                        alertUnit
                    }
            }
        `,
    }
    
    /*SHOW AND HIDE MODALS*/
    showAddControl = () => this.setState({openAddControl:true})
    closeAddControl = () => this.setState({openAddControl:false})
    /*CHANGE HANDLERS*/
    handleChange = e => this.setState({[e.target.name]:e.target.value})
    handleUnitChange = (e,{value}) => this.setState({newUnit:value,unitType:this.state.unitsRaw.filter(u=>u.unit == value)[0].type})
    handleAlertUnitChange = (e,{value}) => this.setState({newAlertUnit:value})
    setControlObli = () => this.setState({newIsObli:true,newIsPrev:false,newCtrlType:"obli"})
    setControlPrev = () => this.setState({newIsObli:false,newIsPrev:true,newCtrlType:"prev"})
    setFirstIsDifferent = (e,{checked}) => this.setState({newFirstIsDifferent:checked})
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    addControl = () => {
        if(
            this.state.newName.length == 0 ||
            this.state.newFrequency.length == 0 ||
            this.state.newUnit.length == 0 ||
            this.state.newAlert.length == 0 ||
            this.state.newAlertUnit.length == 0 ||
            this.state.newCtrlType.length == 0
        ){
            this.props.toast({message:"Des informations nécessaire à la création du contrôle manquent.",type:"error"});
        }else{
            if(
                this.state.newFirstIsDifferent == 0 &&
                this.state.newFirstFrequency.length == 0
            ){
                this.props.toast({message:"Des informations nécessaire à la création du contrôle manquent.",type:"error"});
            }else{
                this.props.client.mutate({
                    mutation:this.state.addControlQuery,
                    variables:{
                        name:this.state.newName,
                        firstIsDifferent:this.state.newFirstIsDifferent,
                        firstFrequency:parseInt(this.state.newFirstFrequency),
                        frequency:parseInt(this.state.newFrequency),
                        unit:this.state.newUnit,
                        alert:parseInt(this.state.newAlert),
                        alertUnit:this.state.newAlertUnit,
                        ctrlType:this.state.newCtrlType,
                    }
                }).then(({data})=>{
                    data.addControl.map(qrm=>{
                        if(qrm.status){
                            this.props.toast({message:qrm.message,type:"success"});
                            this.loadControls(this.state.newCtrlType);
                            this.setState({openAddControl:false})
                        }else{
                            this.props.toast({message:qrm.message,type:"error"});
                        }
                    })
                })
            }
        }
    }
    loadControls = ctrlType => {
        this.props.client.query({
            query:this.state.controlsQuery,
            fetchPolicy:"network-only",
            variables:{
                ctrlType:ctrlType
            }
        }).then(({data})=>{
            this.setState({
                [ctrlType+"Raw"]:data.controls
            })
        })
    }
    /*CONTENT GETTERS*/
    getActivePanel = () => {
        if(this.state.activePanel == "obli"){
            return this.getObliPanel()
        }
        if(this.state.activePanel == "prev"){
            return this.getPrevPanel()
        }
    }
    getObliPanel = () => this.state.obliRaw.map(c=> <ControlRow ctrlType="obli" loadControls={this.loadControls} control={c}/> )
    getPrevPanel = () => this.state.prevRaw.map(c=> <ControlRow ctrlType="prev" loadControls={this.loadControls} control={c}/> )
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
        this.loadControls("obli");
        this.loadControls("prev");
    }

    render() {return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto"}}>
                <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                    <AdministrationMenu active="controls"/>
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <BigIconButton icon="plus" color="blue" onClick={this.showAddControl} tooltip="Ajouter un contrôle"/>
                    </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto 1fr",gridGap:"32px",overflowY:"scroll"}}>
                    <Menu size='big' pointing vertical style={{gridColumnStart:"1"}}>
                        <Menu.Item color="blue" active={this.state.activePanel == 'obli'} onClick={()=>{this.setState({activePanel:"obli"})}}>
                            <Label color="grey">x</Label>
                            Contrôles obligatoires
                        </Menu.Item>
                        <Menu.Item color="blue" active={this.state.activePanel == 'prev'} onClick={()=>{this.setState({activePanel:"prev"})}}>
                            <Label color="grey">x</Label>
                            Contrôles préventifs
                        </Menu.Item>
                    </Menu>
                    <div style={{gridRowEnd:"span 2",marginRight:"32px"}}>
                        <Table compact celled striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center">Nom</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Fréquence</Table.HeaderCell>
                                    <Table.HeaderCell collapsing textAlign="center">Seuil d'alerte</Table.HeaderCell>
                                    <Table.HeaderCell collapsing textAlign="center">Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.getActivePanel()}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
            <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddControl} onClose={this.closeAddControl} closeIcon>
                <Modal.Header>
                    Ajout d'un contrôle
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Nom du contrôle</label><input onChange={this.handleChange} name="newName"/></Form.Field>
                        <Checkbox label='Première occurence differente des suivantes' onChange={this.setFirstIsDifferent} checked={this.state.newFirstIsDifferent}/>
                        {(this.state.newFirstIsDifferent ?
                            <Form.Field style={{placeSelf:"stretch"}}><label>Première fréquence du contrôle</label>
                                <Input name="newFirstFrequency" onChange={this.handleChange} labelPosition='right' label={
                                    <Dropdown value={this.state.newUnit} onChange={this.handleUnitChange} options={this.state.unitsOptions(false)}/>
                                }/>
                            </Form.Field>
                        :
                            ""
                        )}
                        <Form.Field style={{placeSelf:"stretch"}}><label>Fréquence du contrôle</label>
                            <Input name="newFrequency" onChange={this.handleChange} labelPosition='right' label={
                                <Dropdown value={this.state.newUnit} onChange={this.handleUnitChange} options={this.state.unitsOptions(false)}/>
                            }/>
                        </Form.Field>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Seuil d'alerte</label>
                            <Input name="newAlert" onChange={this.handleChange} labelPosition='right' label={
                                <Dropdown onChange={this.handleAlertUnitChange} options={this.state.unitsOptions(true)}/>
                            }/>
                        </Form.Field>
                        <Checkbox label='Ce contrôle est un contrôle obligatoire' onChange={this.setControlObli} checked={this.state.newIsObli}/>
                        <Checkbox label='Ce contrôle est un contrôle préventif' onChange={this.setControlPrev} checked={this.state.newIsPrev}/>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={this.closeAddControl}>Annuler</Button>
                    <Button color="green" onClick={this.addControl}>Créer</Button>
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
export default wrappedInUserContext = withUserContext(ControlsAdmin);