
import React, { Component, Fragment } from 'react';
import { Dropdown, Modal, Button, Icon, Form, Table, Input, Message } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import { UserContext } from '../../contexts/UserContext';
import EquipementDescriptionRow from '../molecules/EquipementDescriptionRow';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class Equipements extends Component {

    state = {
        needToCheckFormValidity:false,
        newName:"",
        newUnitType:"t",
        newControlPeriodValue:"",
        newControlPeriodUnit:"",
        newAlertStepValue:"",
        newAlertStepUnit:"",
        openMessage:false,
        validControl:false,
        messageColor:"blue",
        messageContent:"Formulaire vierge",
        messageIcon:"write",
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
        equipementDescriptionsRaw:[],
        addEquipementDescriptionsQuery : gql`
            mutation addEquipementDescription($name:String!,$controlPeriodValue:Int!,$controlPeriodUnit:String!,$alertStepValue:Int!,$alertStepUnit:String!,$unitType:String!){
                addEquipementDescription(name:$name,controlPeriodValue:$controlPeriodValue,controlPeriodUnit:$controlPeriodUnit,alertStepValue:$alertStepValue,alertStepUnit:$alertStepUnit,unitType:$unitType){
                    status
                    message
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
        equipementDescriptions : () => {
            return this.state.equipementDescriptionsRaw.map(ed =><EquipementDescriptionRow controlPeriodUnits={this.state.controlPeriodUnits} loadEquipementDescriptions={this.loadEquipementDescriptions} key={ed._id} equipementDescription={ed}/>)
        }
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
    handleUnitChange = (target,value) => {
        this.setState({
            [target]:value,
            needToCheckFormValidity:true
        })

    }
    handleUnitTypeChange = (e, { value }) => {
        this.setState({
            newUnitType:value,
            //newControlPeriodUnit:this.state.controlPeriodUnits.filter(cpu=>cpu.type.value == value)[0].units[0].value,
            //newAlertStepUnit:this.state.controlPeriodUnits.filter(cpu=>cpu.type.value == value)[0].units[0].value,
            newControlPeriodUnit:"",
            newAlertStepUnit:"",
            needToCheckFormValidity:true
        })

    }
    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value,
        needToCheckFormValidity:true
        });

    }
    showAddEquipementDescription = () => {
        this.setState({
            openAddEquipementDescription:true
        })
    }
    showDelEquipementDescription = () => {
        this.setState({
            openDelEquipementDescription:true
        })
    }
    closeAddEquipementDescription = () => {
        this.setState({
            openAddEquipementDescription:false
        })
    }
    closeDelEquipementDescription = () => {
        this.setState({
            openDelEquipementDescription:false
        })
    }
    addEquipementDescription = () => {
        this.closeAddEquipementDescription()
        this.props.client.mutate({
            mutation:this.state.addEquipementDescriptionsQuery,
            variables:{
                name:this.state.newName,
                controlPeriodValue:parseInt(this.state.newControlPeriodValue),
                controlPeriodUnit:this.state.newControlPeriodUnit,
                alertStepValue:parseInt(this.state.newAlertStepValue),
                alertStepUnit:this.state.newAlertStepUnit,
                unitType:this.state.newUnitType
            }
        }).then(({data})=>{
            data.addEquipementDescriptions.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEquipementDescriptions();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    checkFormValidity = () => {
        if(this.state.newName.toString().length < 1){
            this.setState({
                needToCheckFormValidity:false,
                messageIcon:"warning sign",
                messageContent:"Nom invalide",
                messageColor:"orange",
                validControl:false
            })
        }else{
            if(this.state.newControlPeriodValue.length < 1 || this.state.newAlertStepValue.length < 1){
                this.setState({
                    needToCheckFormValidity:false,
                    messageIcon:"warning sign",
                    messageContent:"Donnez une valeur a la fréquence de contrôle et au seuil d'alerte",
                    messageColor:"orange",
                    validControl:false
                })
            }else{
                if(this.state.newControlPeriodUnit.length < 1 || this.state.newAlertStepUnit.length < 1){
                    this.setState({
                        needToCheckFormValidity:false,
                        messageIcon:"warning sign",
                        messageContent:"Selectionnez une unité pour la fréquence de contrôle et le seuil d'alèrte",
                        messageColor:"red",
                        validControl:false
                    })  
                }else{
                    if(parseInt(this.state.newControlPeriodValue) == NaN || parseInt(this.state.newAlertStepValue) == NaN){
                        this.setState({
                            needToCheckFormValidity:false,
                            messageIcon:"warning sign",
                            messageContent:"La fréquence de contrôle et le seuil d'alerte n'ont pas de valeur valide",
                            messageColor:"red",
                            validControl:false
                        })  
                    }else{
                        let cpv = parseInt(this.state.newControlPeriodValue);
                        let asv = parseInt(this.state.newAlertStepValue);
                        if(this.state.newControlPeriodUnit == "y"){cpv = cpv * 12}
                        if(this.state.newAlertStepUnit == "y"){asv = asv * 12}
                        if(cpv<asv){
                            this.setState({
                                needToCheckFormValidity:false,
                                messageIcon:"warning sign",
                                messageContent:"Le seuil d'alerte ne peut être superieur à la fréquence de contrôle",
                                messageColor:"red",
                                validControl:false
                            })  
                        }else{
                            this.setState({
                                needToCheckFormValidity:false,
                                messageIcon:"check",
                                messageContent:"Tous les contrôles passés, formulaire valide",
                                messageColor:"green",
                                validControl:true
                            })  
                        }
                    }
                }
            }
        }
    }

    componentDidUpdate = () => {
        if(this.state.needToCheckFormValidity){
            this.checkFormValidity();
        }
    }

    componentDidMount = () => {
        this.loadEquipementDescriptions()
    }

    render() {
        return (
            <Fragment>
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
                    <div style={{display:"flex",marginBottom:"0",justifyContent:"space-between"}}>
                        <AdministrationMenu active="equipement"/>
                    </div>
                    <Button color="blue" style={{justifySelf:"stretch",gridColumnStart:"3"}} onClick={this.showAddEquipementDescription} icon labelPosition='right'>Ajouter un contrôle<Icon name='plus'/></Button>
                    <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                            <Table.Header>
                                <Table.Row textAlign='center'>
                                    <Table.HeaderCell width={10}>Contrôle</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Seuil d'alerte</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Frequence de contrôle</Table.HeaderCell>
                                    <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.equipementDescriptions()}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddEquipementDescription} onClose={this.closeAddEquipementDescription} closeIcon>
                    <Modal.Header>
                        Création du contrôle
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateRows:"1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"center stretch"}}><label>Nom</label><input onChange={this.handleChange} placeholder="Nom" name="newName"/></Form.Field>
                            <Form.Field style={{placeSelf:"center stretch"}}><label>Type de controle </label><Dropdown placeholder='Choisir une unité' search selection onChange={this.handleUnitTypeChange} options={this.state.controlPeriodUnits.map(cpu=>cpu.type)} name="newUnitType" defaultValue={this.state.newUnitType}/></Form.Field>
                            <Input style={{placeSelf:"center"}} label={
                                <Dropdown options={this.state.controlPeriodUnits.filter(cpu=>cpu.type.value==this.state.newUnitType)[0].units} onChange={(e, { value })=>{this.handleUnitChange("newControlPeriodUnit",value)}} />
                            } labelPosition='right' onChange={this.handleChange} name="newControlPeriodValue" placeholder="Fréquence de controle"/>
                            <Input style={{placeSelf:"center"}} label={
                                <Dropdown options={this.state.controlPeriodUnits.filter(cpu=>cpu.type.value==this.state.newUnitType)[0].units} onChange={(e, { value })=>{this.handleUnitChange("newAlertStepUnit",value)}} />
                            } labelPosition='right' onChange={this.handleChange} name="newAlertStepValue" placeholder="Seuil d'alerte"/>
                        </Form>
                        <Message hidden={this.state.openMessage} color={this.state.messageColor} icon>
                            <Icon name={this.state.messageIcon}/>
                            {this.state.messageContent}
                        </Message>
                        <Message color="red">
                            Un contrôle ne peut être modifié, il ne peut qu'être supprimé si aucun véhiculé n'en est équipé. 
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="blue" onClick={this.addEquipementDescription} disabled={!this.state.validControl}>Créer</Button>
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

export default wrappedInUserContext = withUserContext(withRouter(Equipements));
