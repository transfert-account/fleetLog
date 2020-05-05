
import React, { Component, Fragment } from 'react';
import { Dropdown, Modal, Menu, Button, Icon, Form, Table, Input } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import EquipementDescriptionRow from '../molecules/EquipementDescriptionRow';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class Equipements extends Component {

  state = {
    newName:"",
    newUnitType:"t",
    newControlPeriodValue:"",
    newControlPeriodUnit:"",
    newAlertStepValue:"",
    newAlertStepUnit:"",
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
        [target]:value
    })
  }

  handleUnitTypeChange = (e, { value }) => {
    this.setState({
        newUnitType:value,
        newControlPeriodUnit:this.state.controlPeriodUnits.filter(cpu=>cpu.type.value == value)[0].units[0].value,
        newAlertStepUnit:this.state.controlPeriodUnits.filter(cpu=>cpu.type.value == value)[0].units[0].value
    })
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
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
        this.loadEquipementDescriptions();
    })
  }

  getMenu = () => {
    if(this.props.user.isOwner){
      return (
        <Menu style={{cursor:"pointer",marginBottom:"0"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' active onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
            <Menu.Item color="blue" name='exports' onClick={()=>{this.props.history.push("/administration/exports")}}><Icon name='file excel outline'/>Exports</Menu.Item>
        </Menu>
      )
    }else{
      return (
        <Menu style={{cursor:"pointer",marginBottom:"0"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' active onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
            <Menu.Item color="blue" name='exports' onClick={()=>{this.props.history.push("/administration/exports")}}><Icon name='file excel outline'/>Exports</Menu.Item>
        </Menu>
      )
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
                    {this.getMenu()}
                </div>
                <Button color="blue" style={{justifySelf:"stretch",gridColumnStart:"3"}} onClick={this.showAddEquipementDescription} icon labelPosition='right'>Ajouter un contrôle<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell width={10}>Name</Table.HeaderCell>
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
                        <Form.Field style={{placeSelf:"center stretch"}}><label>Type de controle </label><Dropdown placeholder='Choisir une unité' search selection onChange={this.handleUnitTypeChange} options={this.state.controlPeriodUnits.map(cpu=>cpu.type)} name="newUnitType" /></Form.Field>
                        <Input style={{placeSelf:"center"}} label={
                            <Dropdown options={this.state.controlPeriodUnits.filter(cpu=>cpu.type.value==this.state.newUnitType)[0].units} onChange={(e, { value })=>{this.handleUnitChange("newControlPeriodUnit",value)}} />
                        } labelPosition='right' onChange={this.handleChange} name="newControlPeriodValue" placeholder="Fréquence de controle"/>
                        <Input style={{placeSelf:"center"}} label={
                            <Dropdown options={this.state.controlPeriodUnits.filter(cpu=>cpu.type.value==this.state.newUnitType)[0].units} onChange={(e, { value })=>{this.handleUnitChange("newAlertStepUnit",value)}} />
                        } labelPosition='right' onChange={this.handleChange} name="newAlertStepValue" placeholder="Seuil d'alerte"/>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addEquipementDescription}>Créer</Button>
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
