import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Icon, Message, Input, Button, Modal, Progress } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

class CommandeRow extends Component {

    state={
        _id:this.props.commande._id,
        commande:this.props.commande,
        buttonStatusEdition:false,
        deleteCommandeQuery : gql`
            mutation deleteCommande($_id:String!){
                deleteCommande(_id:$_id){
                    status
                    message
                }
            }
        `,
        editCommandeStatusQuery : gql`
            mutation editCommandeStatus($_id:String!,$status:Int!){
                editCommandeStatus(_id:$_id,status:$status){
                    status
                    message
                }
            }
        `,
    }

    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }
    closeDelete = () => {
        this.setState({openDelete:false})
    }
    showButtonStatusEdition = () => {
        this.setState({
            buttonStatusEdition:true
        })
    }
    hideButtonStatusEdition = () => {
        this.setState({
            buttonStatusEdition:false
        })
    }


    deleteCommande = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteCommandeQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteCommande.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadCommandes();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    editCommandeStatus = newStatus => {
        this.hideButtonStatusEdition();
        this.props.client.mutate({
            mutation:this.state.editCommandeStatusQuery,
            variables:{
                _id:this.state._id,
                status:newStatus
            }
        }).then(({data})=>{
            data.editCommandeStatus.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadCommandes();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    getProgressColor = () =>  {
        if(this.props.commande.status == 1){
            return "grey"
        }
        if(this.props.commande.status == 2){
            return "orange"
        }
        if(this.props.commande.status == 3){
            return "green"
        }
    }

    getProgressLabel = () =>  {
        if(this.props.commande.status == 1){
            return "A commander"
        }
        if(this.props.commande.status == 2){
            return "Commandé"
        }
        if(this.props.commande.status == 3){
            return "Prêt"
        }
    }

    getActionsButtons = () => {
        if(this.state.buttonStatusEdition){
            return(
                <Table.Cell style={{textAlign:"center"}}>
                    <Button circular style={{color:"#2c3e50"}} inverted icon icon='chevron left' onClick={this.hideButtonStatusEdition}/>
                    <Button circular style={{color:"#95a5a6"}} inverted icon icon='clipboard check' onClick={()=>{this.editCommandeStatus(1)}}/>
                    <Button circular style={{color:"#e67e22"}} inverted icon icon='truck' onClick={()=>{this.editCommandeStatus(2)}}/>
                    <Button circular style={{color:"#2ecc71"}} inverted icon icon='check' onClick={()=>{this.editCommandeStatus(3)}}/>
                </Table.Cell>
            )
        }else{
            return(
                <Table.Cell style={{textAlign:"center"}}>
                    <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showButtonStatusEdition}/>    
                    <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                </Table.Cell>
            )
        }
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.commande.piece.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.commande.price} €</Table.Cell>
                    <Table.Cell>
                        <Progress size="small" value={this.props.commande.status} color={this.getProgressColor()} total='3' >{this.getProgressLabel()}</Progress>
                    </Table.Cell>
                    {this.getActionsButtons()}
                </Table.Row>
                <Modal closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmation de suppression 
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                Confirmer l'annulation de la commande de la pièce : {this.props.commande.piece.name} ?
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                        <Button color="red" onClick={this.deleteCommande}>Supprimer</Button>
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
  
export default wrappedInUserContext = withUserContext(CommandeRow);