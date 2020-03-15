import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Icon, Message, Input, Button, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

class FournisseurRow extends Component {

    state={
        _id:this.props.fournisseur._id,
        editing:false,
        newName:this.props.fournisseur.name,
        newPhone:this.props.fournisseur.phone,
        newMail:this.props.fournisseur.mail,
        newAddress:this.props.fournisseur.address,
        deleteFournisseurQuery : gql`
            mutation deleteFournisseur($_id:String!){
                deleteFournisseur(_id:$_id){
                    status
                    message
                }
            }
        `,
        editFournisseurQuery : gql`
            mutation editFournisseur($_id:String!,$name:String!,$phone:String!,$mail:String!,$address:String!){
                editFournisseur(_id:$_id,name:$name,phone:$phone,mail:$mail,address:$address){
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
    
    closeEdit = () => {
        this.setState({editing:false})
    }
    showEdit = () => {
        this.setState({editing:true})
    }

    deleteFournisseur = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteFournisseurQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteFournisseur.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadFournisseurs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editFournisseurQuery,
            variables:{
                _id:this.state._id,
                name:this.state.newName,
                phone:this.state.newPhone,
                mail:this.state.newMail,
                address:this.state.newAddress
            }
        }).then(({data})=>{
            data.editFournisseur.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadFournisseurs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    loadFournisseurs = () => {
        this.props.loadFournisseurs();
    }

    render() {
        if(this.state.editing){
            return (
                <Table.Row>
                    <Table.Cell textAlign="center"><Input value={this.state.newName} onChange={this.handleChange} placeholder="Nom du fournisseur" name="newName"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input value={this.state.newPhone} onChange={this.handleChange} placeholder="Telephone du fournisseur" name="newPhone"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input value={this.state.newMail} onChange={this.handleChange} placeholder="Mail du fournisseur" name="newMail"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input value={this.state.newAddress} onChange={this.handleChange} placeholder="Adresse du fournisseur" name="newAddress"/></Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button onClick={this.closeEdit} color="red">Annuler</Button>
                        <Button onClick={this.saveEdit} color="blue">Sauvegarder</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>{this.props.fournisseur.name}</Table.Cell>
                        <Table.Cell>{this.props.fournisseur.phone}</Table.Cell>
                        <Table.Cell>{this.props.fournisseur.mail}</Table.Cell>
                        <Table.Cell>{this.props.fournisseur.address}</Table.Cell>
                        <Table.Cell style={{textAlign:"center"}}>
                            <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>    
                            <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                        </Table.Cell>
                    </Table.Row>
                    <Modal closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Confirmation de suppression 
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Message color='red' icon>
                                <Icon name='warning sign'/>
                                <Message.Content>
                                    Veuillez confirmer vouloir supprimer le fournisseur : {this.props.fournisseur.name} ?
                                </Message.Content>
                            </Message>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="red" onClick={this.deleteFournisseur}>Supprimer</Button>
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
  
export default wrappedInUserContext = withUserContext(FournisseurRow);