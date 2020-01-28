import React, { Component, Fragment } from 'react'
import { Loader, Table, Button, Icon, TextArea, Form, Message, Modal, Input, Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import CommandeRow from '../molecules/CommandeRow';
import PiecePicker from '../atoms/PiecePicker';
import { withRouter } from 'react-router-dom';
import ModalDatePicker from '../atoms/ModalDatePicker'
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Entretien extends Component {
    
    state={
        editing:false,
        entretienRaw:null,
        newPiece:"",
        newDesc:"",
        newPrice:"",
        newTitle:"",
        newTime:0,
        newAffectDate:"",
        openDatePicker:false,
        newStatus:0,
        openDelete:false,
        openAffectToMe:false,
        openRelease:false,
        openArchive:false,
        openDisArchive:false,
        newPieceType:"",
        commandesRaw:[],
        _id:this.props.match.params._id,
        loadingEntretien:true,
        loadingCommandes:true,
        status:[{status:1,label:"En cours"},{status:2,label:"Réalisé"},{status:3,label:"Archivé"}],
        affectToMeQuery : gql`
            mutation affectToMe($_id:String!,$occurenceDate:String!){
                affectToMe(_id:$_id,occurenceDate:$occurenceDate){
                    status
                    message
                }
            }
        `,
        releaseQuery : gql`
            mutation release($_id:String!){
                release(_id:$_id){
                    status
                    message
                }
            }
        `,
        entretienQuery : gql`
            query entretien($_id:String!){
                entretien(_id:$_id){
                    _id
                    description
                    title
                    archived
                    occurenceDate
                    user
                    time
                    status
                    vehicle{
                        _id
                        societe{
                            _id
                            trikey
                            name
                        }
                        registration
                        km
                        brand
                        model
                        volume{
                            _id
                            meterCube
                        }
                        payload
                        color
                    }
                }
            }
        `,
        deleteEntretienQuery : gql`
            mutation deleteEntretien($_id:String!){
                deleteEntretien(_id:$_id){
                    status
                    message
                }
            }
        `,
        archiveEntretienQuery : gql`
            mutation archiveEntretien($_id:String!,$archived:Boolean!){
                archiveEntretien(_id:$_id,archived:$archived){
                    status
                    message
                }
            }
        `,
        disArchiveEntretienQuery : gql`
            mutation disArchiveEntretien($_id:String!,$archived:Boolean!){
                disArchiveEntretien(_id:$_id,archived:$archived){
                    status
                    message
                }
            }
        `,
        commandesByEntretienQuery : gql`
            query commandesByEntretien($entretien:String!){
                commandesByEntretien(entretien:$entretien){
                    _id
                    piece{
                        _id
                        name
                        type
                    }
                    price
                    status
                }
            }
        `,
        addCommandeQuery : gql`
            mutation addCommande($entretien:String!,$piece:String!,$price:Float!){
                addCommande(entretien:$entretien,piece:$piece,price:$price){
                    status
                    message
                }
            }
        `,
        editInfosQuery : gql`
            mutation editInfos($_id:String!,$time:Float!,$status:Int!){
                editInfos(_id:$_id,time:$time,status:$status){
                    status
                    message
                }
            }
        `,
        editDescQuery : gql`
            mutation editDesc($_id:String!,$description:String!){
                editDesc(_id:$_id,description:$description){
                    status
                    message
                }
            }
        `,
        editTitleQuery : gql`
            mutation editTitle($_id:String!,$title:String!){
                editTitle(_id:$_id,title:$title){
                    status
                    message
                }
            }
        `,
        commandes : () => {
            return (
                this.state.commandesRaw.map(c=>{
                    return <CommandeRow commande={c} key={c._id} loadCommandes={this.loadCommandes}/>
                })
            )
        }
    }

    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }

    handleChangeStatus = (e, { value }) => this.setState({ newStatus:value })

    getPieceIcon = () => {
        if(this.state.newPieceType=="pie"){
            return "cogs"
        }
        if(this.state.newPieceType=="pne"){
            return "cog"
        }
        if(this.state.newPieceType=="age"){
            return "tint"
        }
        if(this.state.newPieceType=="out"){
            return "wrench"
        }
        return "cancel";
    }

    getPieceTypeName = () => {
        if(this.state.newPieceType=="pie"){
            return "Piece"
        }
        if(this.state.newPieceType=="pne"){
            return "Pneumatique"
        }
        if(this.state.newPieceType=="age"){
            return "Agent"
        }
        if(this.state.newPieceType=="out"){
            return "Outils"
        }
        return "Aucune pièce séléctionnée";
    }

    getContentColor = () => {
        if(this.state.newPieceType=="pie"){
            return "teal"
        }
        if(this.state.newPieceType=="pne"){
            return "blue"
        }
        if(this.state.newPieceType=="age"){
            return "violet"
        }
        if(this.state.newPieceType=="out"){
            return "purple"
        }
    }
    
    handleChangePiece = piece => {
        this.setState({
            newPiece:piece._id,
            newPieceType:piece.type,
            newPieceName:piece.name
        })
    }

    handleEditDesc = (e,{value}) => {
        this.setState({
            newDesc:value
        });
        this.editDesc();
    }

    handleEditTitle = (e,{value}) => {
        this.setState({
            newTitle:value
        });
        this.editTitle();
    }

    archiveEntretien = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveEntretienQuery,
            variables:{
                _id:this.state._id,
                archived:true
            }
        }).then(({data})=>{
            data.archiveEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    disArchiveEntretien = () => {
        this.closeDisArchive();
        this.props.client.mutate({
            mutation:this.state.disArchiveEntretienQuery,
            variables:{
                _id:this.state._id,
                archived:false
            }
        }).then(({data})=>{
            data.disArchiveEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }


    deleteEntretien = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteEntretienQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/entretiens");
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescQuery,
            variables:{
                _id:this.state._id,
                description:this.state.newDesc
            }
        }).then(({data})=>{
            data.editDesc.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);

    editTitle = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editTitleQuery,
            variables:{
                _id:this.state._id,
                title:this.state.newTitle
            }
        }).then(({data})=>{
            data.editTitle.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);

    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }

    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }

    closeDelete = () => {
        this.setState({openDelete:false})
    }

    showAffectToMe = () => {
        this.setState({openAffectToMe:true})
    }

    closeAffectToMe = () => {
        this.setState({openAffectToMe:false})
    }

    showRelease = () => {
        this.setState({
            openRelease : true
        })
    }
    
      closeRelease = () => {
        this.setState({
            openRelease : false
        })
    }

    showArchive = () => {
        this.setState({openArchive:true})
    }

    closeArchive = () => {
        this.setState({openArchive:false})
    }

    showDisArchive = () => {
        this.setState({openDisArchive:true})
    }

    closeDisArchive = () => {
        this.setState({openDisArchive:false})
    }

    componentDidMount = () => {
        this.loadEntretien();
        this.loadCommandes();
    }

    addCommande = () => {
        this.closeAddCommande();
        this.props.client.mutate({
            mutation:this.state.addCommandeQuery,
            variables:{
                entretien:this.state._id,
                piece:this.state.newPiece,
                price:parseFloat(this.state.newPrice)
            }
        }).then(({data})=>{
            this.loadCommandes();
        })
    }

    affectToMe = () => {
        this.closeAffectToMe();
        this.props.client.mutate({
        mutation:this.state.affectToMeQuery,
        variables:{
            _id:this.state._id,
            occurenceDate:this.state.newAffectDate
        }
        }).then(({data})=>{
            data.affectToMe.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    release = () => {
        this.closeRelease();
        this.props.client.mutate({
        mutation:this.state.releaseQuery,
        variables:{
            _id:this.state._id
        }
        }).then(({data})=>{
            data.release.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    saveEdit = () => {
        this.setState({editing:false})
        this.props.client.mutate({
            mutation:this.state.editInfosQuery,
            variables:{
                _id:this.state.entretienRaw._id,
                time:parseFloat(this.state.newTime),
                status:parseInt(this.state.newStatus)
            }
        }).then(({data})=>{
            data.editTitle.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    showAddCommande = () => {
        this.setState({
            openAddCommande:true
        })
    }

    closeAddCommande = () => {
        this.setState({
            openAddCommande:false
        })
    }
    
    loadEntretien = () => {
        this.props.client.query({
            query:this.state.entretienQuery,
            variables:{
                _id:this.state._id
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                entretienRaw:data.entretien,
                newTime:data.entretien.time,
                newStatus:data.entretien.status,
                loadingEntretien:false
            })
        })
    }

    loadCommandes = () => {
        this.props.client.query({
            query:this.state.commandesByEntretienQuery,
            variables:{
                entretien:this.state._id
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                commandesRaw:data.commandesByEntretien,
                loadingCommandes:false
            })
        })
    }

    getStatusLabel = () => {
        return this.state.status.filter(s=>s.status == this.state.entretienRaw.status)[0].label
    }

    getEditionPanel = () => {
        if(this.state.editing){
            return (
                <Fragment>
                    <Form.Field>
                        <label>Temps passé (en heures)</label>
                        <Input defaultValue={this.state.entretienRaw.time} name="newTime" onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Status de l'entretien</label>
                        <Dropdown defaultValue={this.state.entretienRaw.status} onChange={this.handleChangeStatus} fluid selection options={this.state.status.map(s=>{return{key:s.status,text:s.label,value:s.status}})}/>
                    </Form.Field>
                    <div style={{placeSelf:"center"}}>
                        <Button color="red" icon onClick={()=>this.setState({editing:false})}>
                            <Icon name='cancel' />
                        </Button>
                        <Button color="green" icon onClick={this.saveEdit}>
                            <Icon name='check' />
                        </Button>
                    </div>
                </Fragment>
            )
        }else{
            return (
                <Fragment>
                    <Form.Field>
                        Temps sur l'entretien : <span style={{fontWeight:'bold'}}>{this.state.entretienRaw.time} heures</span>
                    </Form.Field>
                    <Form.Field>
                        Status de l'entretien : <span style={{fontWeight:'bold'}}>{this.getStatusLabel()}</span>
                    </Form.Field>
                    <Button color="blue" icon style={{placeSelf:"center"}} onClick={()=>this.setState({editing:true})}>
                        <Icon name='edit' />
                    </Button>
                </Fragment>
            )
        }
    }

    getCommandesTotalLine = () => {
        if(this.state.commandesRaw.length > 0){
            return(
                <Table.Row>
                    <Table.Cell textAlign="right" colSpan="2">Total :</Table.Cell>
                    <Table.Cell textAlign="left" colSpan="2" >{this.state.commandesRaw.reduce((a, b) => a + (b.price || 0), 0)} €</Table.Cell>
                </Table.Row>
            )
        }
    }

    getArchiveButton = () => {
        if(this.state.entretienRaw.archived){
            return (
                <Button color="green" style={{placeSelf:"stretch"}} onClick={this.showDisArchive} icon labelPosition='right'>Ré-ouvrir l'entretien<Icon name='folder open outline'/></Button>
            )
        }else{
            return (
                <Button color="orange" style={{placeSelf:"stretch"}} onClick={this.showArchive} icon labelPosition='right'>Archiver l'entretien<Icon name='archive'/></Button>
            )
        }
    }
    
    getAffectButton = () => {
        if(this.state.entretienRaw.user == ""){
            return (
                <Button color="violet" style={{placeSelf:"stretch"}} onClick={this.showAffectToMe} icon labelPosition='right'>Affecter l'entretien<Icon name='clipboard'/></Button>
            )
        }else{
            if(this.state.entretienRaw.user == Meteor.userId()){
                return (
                    <Button color="violet" style={{placeSelf:"stretch"}} onClick={this.showRelease} icon labelPosition='right'>Relacher l'entretien<Icon name='clipboard'/></Button>
                )
            }else{
                return (
                    <Button color="grey" style={{placeSelf:"stretch"}} disabled icon labelPosition='right'>Entretien pris en charge<Icon name='user'/></Button>
                )
            }
        }
    }

    render() {
        if(this.state.loadingCommandes || this.state.loadingEntretien){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loadingCommandes || this.state.loadingEntretien)} >Chargement de l'entretien</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",gridGap:"32px",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gridTemplateRows:"auto auto"}}>
                        <Message style={{margin:"0", gridRowStart:"1",gridColumnStart:"1",gridColumnEnd:"span 2"}} icon='truck' header={this.state.entretienRaw.vehicle.registration} content={this.state.entretienRaw.vehicle.brand + " - " + this.state.entretienRaw.vehicle.model + " - " + this.state.entretienRaw.vehicle.km + " km"}/>
                        <Form style={{gridRowStart:"2",gridColumnStart:"1",gridColumnEnd:"span 2",display:"grid",gridGap:"8px",gridTemplateColumns:"1fr 1fr auto"}}>
                            {this.getEditionPanel()}
                            <Form.Field style={{gridColumnEnd:"span 3"}}>
                                <label>Titre de l'entretien</label>
                                <TextArea defaultValue={this.state.entretienRaw.title} rows={1} onChange={this.handleEditTitle} placeholder="Titre ..."/>
                            </Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 3"}}>
                                <label>Description détaillée</label>
                                <TextArea defaultValue={this.state.entretienRaw.description} rows={16} onChange={this.handleEditDesc} placeholder="Description de l'entretien"/>
                            </Form.Field>
                        </Form>
                        <Button color="red" style={{placeSelf:"stretch"}} onClick={this.showDelete} icon labelPosition='right'>Supprimer l'entretien<Icon name='trash'/></Button>
                        {this.getArchiveButton()}
                        <Button color="blue" style={{placeSelf:"stretch"}} onClick={this.showAddCommande} icon labelPosition='right'>Ajouter une piece à la commande<Icon name='plus'/></Button>
                        {this.getAffectButton()}
                        <div style={{gridRowStart:"2",gridColumnStart:"3",gridColumnEnd:"span 4"}}>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row textAlign='center'>
                                        <Table.HeaderCell width="4">Piece</Table.HeaderCell>
                                        <Table.HeaderCell width="4">Prix</Table.HeaderCell>
                                        <Table.HeaderCell width="4">Status</Table.HeaderCell>
                                        <Table.HeaderCell width="4">Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.commandes()}
                                    {this.getCommandesTotalLine()}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                    <Modal size="small" closeOnDimmerClick={false} open={this.state.openAddCommande} onClose={this.closeAddCommande} closeIcon>
                        <Modal.Header>
                            Choisissez une pièce à commander
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form style={{display:"grid",gridTemplateRows:"1fr 1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                                <Form.Field style={{gridRowStart:"1",gridColumnStart:"1"}}>
                                    <label>Pièces</label>
                                    <PiecePicker type={"pie"} name={"Pièces"} onChange={this.handleChangePiece}/>
                                </Form.Field>
                                <Form.Field style={{gridRowStart:"1",gridColumnStart:"2"}}>
                                    <label>Pneumatiques</label>
                                    <PiecePicker type={"pne"} name={"Pneumatiques"} onChange={this.handleChangePiece}/>
                                </Form.Field>
                                <Form.Field style={{gridRowStart:"1",gridColumnStart:"3"}}>
                                    <label>Agents</label>
                                    <PiecePicker type={"age"} name={"Agents"} onChange={this.handleChangePiece}/>
                                </Form.Field>
                                <Form.Field style={{gridRowStart:"1",gridColumnStart:"4"}}>
                                    <label>Outils</label>
                                    <PiecePicker type={"out"} name={"Outils"} onChange={this.handleChangePiece}/>
                                </Form.Field>
                                <Message color={this.getContentColor()} icon={this.getPieceIcon()} header={this.state.newPieceName} style={{gridRowStart:"2",gridColumnStart:"2",gridColumnEnd:"span 2"}} content={this.getPieceTypeName()}/>
                                <Form.Field style={{gridRowStart:"3",gridColumnStart:"2",gridColumnEnd:"span 2",placeSelf:"stretch"}}>
                                    <label>Cout de la commande</label>
                                    <Input name="newPrice" onChange={this.handleChange}/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeAddCommande}>Annuler</Button>
                            <Button color="blue" onClick={this.addCommande}>Créer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer l'entretien du vehicule : {this.state.entretienRaw.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteEntretien}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver l'entretien du vehicule : {this.state.entretienRaw.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" onClick={this.archiveEntretien}>Archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDisArchive} onClose={this.closeDisArchive} closeIcon>
                        <Modal.Header>
                            Sortir l'entretien du vehicule : {this.state.entretienRaw.vehicle.registration} des archives ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDisArchive}>Annuler</Button>
                            <Button color="green" onClick={this.disArchiveEntretien}>Réactiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAffectToMe} onClose={this.closeAffectToMe} closeIcon>
                        <Modal.Header>
                            A quelle date voulez vous vous affecter l'entretien ?
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field style={{placeSelf:"stretch"}}>
                                    <label>Date de l'entretien</label>
                                    <Input value={this.state.newAffectDate} onFocus={()=>{this.showDatePicker("newAffectDate")}} name="newAffectDate"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeAffectToMe}>Annuler</Button>
                            <Button color="blue" onClick={this.affectToMe}>Affecter l'entretien</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size="mini" closeOnDimmerClick={false} open={this.state.openRelease} onClose={this.closeRelease} closeIcon>
                        <Modal.Header>
                            Relacher l'entretien ?
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            L'entretien ne vous sera plus affecté et sera de nouveau en attente de prise en charge
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeRelease}>Annuler</Button>
                            <Button color="red" onClick={this.release}>Relacher l'entretien</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(Entretien));