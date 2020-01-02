import React, { Component, Fragment } from 'react'
import { Loader, Table, Button, Icon, TextArea, Form, Message, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import CommandeRow from '../molecules/CommandeRow';
import PiecePicker from '../atoms/PiecePicker';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Entretien extends Component {
    
    state={
        entretienRaw:null,
        newPiece:"",
        newDesc:"",
        openDelete:false,
        openArchive:false,
        newPieceType:"",
        commandesRaw:[],
        _id:this.props.match.params._id,
        loadingEntretien:true,
        loadingCommandes:true,
        entretienQuery : gql`
            query entretien($_id:String!){
                entretien(_id:$_id){
                    _id
                    description
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
                        volume
                        payload
                        color
                        insurancePaid
                        endDate
                        property
                    }
                }
            }
        `,
        deleteEntretienQuery : gql`
            mutation deleteEntretien($_id:String!){
                deleteEntretien(_id:$_id)
            }
        `,
        archiveEntretienQuery : gql`
            mutation archiveEntretien($_id:String!,$archived:Boolean!){
                archiveEntretien(_id:$_id,archived:$archived)
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
                    status
                }
            }
        `,
        addCommandeQuery : gql`
            mutation addCommande($entretien:String!,$piece:String!){
                addCommande(entretien:$entretien,piece:$piece)
            }
        `,
        editDescQuery : gql`
            mutation editDesc($_id:String!,$description:String!){
                editDesc(_id:$_id,description:$description)
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

    archiveEntretien = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveEntretienQuery,
            variables:{
                _id:this.state._id,
                archived:true
            }
        }).then(({data})=>{
            this.props.history.push("/entretiens");
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
            this.props.history.push("/entretiens");
        })
    }

    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescQuery,
            variables:{
                _id:this.state._id,
                description:this.state.newDesc
            }
        })
    },400);

    showDelete = () => {
        this.setState({openDelete:true})
    }

    closeDelete = () => {
        this.setState({openDelete:false})
    }

    showArchive = () => {
        this.setState({openArchive:true})
    }

    closeArchive = () => {
        this.setState({openArchive:false})
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
                piece:this.state.newPiece
            }
        }).then(({data})=>{
            this.loadCommandes();
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
                        <Message style={{margin:"0", gridRowStart:"1",gridColumnStart:"1",gridColumnEnd:"span 2"}} icon='truck' header={this.state.entretienRaw.vehicle.registration} content={this.state.entretienRaw.vehicle.brand + " - " + this.state.entretienRaw.vehicle.model + " - " + this.state.entretienRaw.vehicle.km} />
                        <Form style={{gridRowStart:"2",gridColumnStart:"1",gridColumnEnd:"span 2"}}>
                            <TextArea defaultValue={this.state.entretienRaw.description} rows={20} onChange={this.handleEditDesc} placeholder="Description de l'entretien"/>
                        </Form>
                        <Button color="red" style={{placeSelf:"stretch"}} onClick={this.showDelete} icon labelPosition='right'>Supprimer l'entretien<Icon name='trash'/></Button>
                        <Button color="orange" style={{placeSelf:"stretch"}} onClick={this.showArchive} icon labelPosition='right'>Archiver l'entretien<Icon name='archive'/></Button>
                        <Button color="blue" style={{placeSelf:"stretch"}} onClick={this.showAddCommande} icon labelPosition='right'>Ajouter une piece à la commande<Icon name='plus'/></Button>
                        <Button color="violet" style={{placeSelf:"stretch"}} onClick={()=>{console.log("click4")}} icon labelPosition='right'>Affecter l'entretien<Icon name='clipboard'/></Button>
                        <div style={{gridRowStart:"2",gridColumnStart:"3",gridColumnEnd:"span 4"}}>
                            <Table>
                                <Table.Header>
                                    <Table.Row textAlign='center'>
                                        <Table.HeaderCell width="6">Piece</Table.HeaderCell>
                                        <Table.HeaderCell width="6">Status</Table.HeaderCell>
                                        <Table.HeaderCell width="4">Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.commandes()}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                    <Modal size="small" closeOnDimmerClick={false} open={this.state.openAddCommande} onClose={this.closeAddCommande} closeIcon>
                        <Modal.Header>
                            Choisissez une pièce à commander
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"16px"}}>
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
                            <Button color="grey" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" onClick={this.archiveEntretien}>Archiver</Button>
                        </Modal.Actions>
                    </Modal>
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