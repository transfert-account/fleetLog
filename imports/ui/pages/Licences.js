import React, { Component } from 'react';
import { Icon,Menu,Input,Button,Table,Modal,Form,Loader } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import LicenceRow from '../molecules/LicenceRow';
import SocietePicker from '../atoms/SocietePicker';
import VehiclePicker from '../atoms/VehiclePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express'

export class Licences extends Component {

  state={
    loading:true,
    licenceFilter:"",
    openAddLicence:false,
    newSociete:"",
    newNumber:"",
    newEndDate:"",
    newVehicle:"",
    societesRaw: [],
    licencesRaw : [],
    licences : () => {
        let displayed = Array.from(this.state.licencesRaw);
        if(this.state.licenceFilter.length>0){
            displayed = displayed.filter(l =>
                l.shiftName.toLowerCase().includes(this.state.licenceFilter.toLowerCase()) ||
                l.vehicle.registration.toLowerCase().includes(this.state.licenceFilter.toLowerCase()) ||
                l.number.toLowerCase().includes(this.state.licenceFilter.toLowerCase()) 
            );
            if(displayed.length == 0){
                return(
                <Table.Row key={"none"}>
                    <Table.Cell width={16} colSpan='14' textAlign="center">
                    <p>Aucune licence ne correspond à ce filtre</p>
                    </Table.Cell>
                </Table.Row>
                )
            }
        }
        if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
            displayed = displayed.filter(l =>
                l.societe._id == this.props.societeFilter
            );
        }
        return displayed.map(l =>(
            <LicenceRow loadLicences={this.loadLicences} societesRaw={this.state.societesRaw} key={l._id} licence={l}/>
        ))
    },
    addLicenceQuery : gql`
        mutation addLicence($societe:String!,$number:String!,$vehicle:String!,$endDate:String!){
            addLicence(societe:$societe,number:$number,vehicle:$vehicle,endDate:$endDate){
                status
                message
            }
        }
    `,
    licencesQuery : gql`
        query licences{
          licences{
            _id
            societe{
              _id
              trikey
              name
            }
            number
            shiftName
            endDate
            vehicle{
              _id
              registration
              km
              volume{
                  _id
                  meterCube
              }
              payload
            }
          }
        }
    `,
    societesQuery : gql`
        query societes{
            societes{
                _id
                trikey
                name
            }
        }
    `,
  }

    handleFilter = e => {
        this.setState({
            licenceFilter : e.target.value
        })
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }

    handleChangeVehicle = _id => {
        this.setState({ newVehicle:_id })
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

    showAddLicence = () => {
        this.setState({
        openAddLicence:true
        })
    }

    closeAddLicence = () => {
        this.setState({
        openAddLicence:false
        })
    }

    loadLicences = () => {
        this.props.client.query({
            query:this.state.licencesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                loading:false,
                licencesRaw:data.licences
            })
        })
    }

    addLicence = () => {
        this.closeAddLicence()
        this.props.client.mutate({
            mutation:this.state.addLicenceQuery,
            variables:{
                societe:this.state.newSociete,
                number:this.state.newNumber,
                vehicle:this.state.newVehicle,
                endDate:this.state.newEndDate
            }
        }).then(({data})=>{
            data.addLicence.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLicences();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    loadSocietes = () => {
        this.props.client.query({
            query:this.state.societesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            data.societes.push({_id:"noidthisisgroupvisibility",name:"Groupe",trikey:"GRP"})
            this.setState({
                societesRaw:data.societes
            })
        })
    }

    componentDidMount = () => {
        this.loadLicences();
        this.loadSocietes();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement des licences</Loader>
                </div>
            )
        }else{
            return (
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
                    <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                        <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                        <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                        <Menu.Item color="blue" name='licences' active onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                        <Menu.Item color="blue" name='locations' onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                    </Menu>
                    <Input style={{justifySelf:"stretch"}} name="storeFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher une tournée, un numéro de licence ou une immatriculation' />
                    <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddLicence} icon labelPosition='right'>Ajouter une licence<Icon name='plus'/></Button>
                    <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                            <Table.Header>
                                <Table.Row textAlign='center'>
                                    <Table.HeaderCell>Societe</Table.HeaderCell>
                                    <Table.HeaderCell>Numero de licence</Table.HeaderCell>
                                    <Table.HeaderCell>Véhicule associé</Table.HeaderCell>
                                    <Table.HeaderCell>Nom de tournée</Table.HeaderCell>
                                    <Table.HeaderCell>Fin de validité</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.licences()}
                            </Table.Body>
                        </Table>
                    </div>
                    <Modal closeOnDimmerClick={false} open={this.state.openAddLicence} onClose={this.closeAddLicence} closeIcon>
                        <Modal.Header>
                            Création de la licence
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Societe</label>
                                    <SocietePicker groupAppears={false} onChange={this.handleChangeSociete}/>
                                </Form.Field>
                                <Form.Field><label>Numero de licence</label><input onChange={this.handleChange} placeholder="Numero de licence" name="newNumber"/></Form.Field>
                                <Form.Field>
                                    <label>Véhicule associé</label>
                                    <VehiclePicker onChange={this.handleChangeVehicle}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Date de fin de validité</label>
                                    <Input value={this.state.newEndDate} placeholder="Fin de validité" onFocus={()=>{this.showDatePicker("newEndDate")}} name="newEndDate"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="blue" onClick={this.addLicence}>Créer</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </div>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Licences);