import React, { Component, Fragment } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Input, Table, Popup } from 'semantic-ui-react';
import gql from 'graphql-tag';

class PieceRow extends Component {

    state = {
        editing:false,
        _id:this.props.piece._id,
        newName:this.props.piece.name,
        newBrand:this.props.piece.brand,
        newReference:this.props.piece.reference,
        newPrixHT:this.props.piece.prixHT,
        type:this.props.piece.type,
        openDelete:false,
        deletePieceQuery : gql`
            mutation deletePiece($_id:String!){
                deletePiece(_id:$_id){
                    status
                    message
                }
            }
        `,
        editPieceQuery : gql`
            mutation editPiece($_id:String!,$name:String!,$brand:String!,$reference:String!,$prixHT:Float!){
                editPiece(_id:$_id,name:$name,brand:$brand,reference:$reference,prixHT:$prixHT){
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

    showEdit = () => {
        this.setState({
            editing:true
        })
    }

    showDelete = () => {
        this.setState({
            openDelete:true
        })
    }

    closeDelete = () => {
        this.setState({
            openDelete:false
        })
    }

    closeEdit = () => {
        this.setState({
            editing:false
        })
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editPieceQuery,
            variables:{
                _id:this.state._id,
                name:this.state.newName,
                brand:this.state.newBrand,
                reference:this.state.newReference,
                prixHT:this.state.newPrixHT
            }
        }).then(({data})=>{
            data.editPiece.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAllPieces();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    deletePiece = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deletePieceQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deletePiece.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAllPieces();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    render() {
        if(this.state.editing){
            return (
                <Table.Row>
                    <Table.Cell><Input value={this.state.newName} onChange={this.handleChange} placeholder="Nom" name="newName"/></Table.Cell>
                    <Table.Cell><Input value={this.state.newBrand} onChange={this.handleChange} placeholder="Marque" name="newBrand"/></Table.Cell>
                    <Table.Cell><Input value={this.state.newReference} onChange={this.handleChange} placeholder="Référence" name="newReference"/></Table.Cell>
                    <Table.Cell><Input value={this.state.newPrixHT} onChange={this.handleChange} placeholder="Prix H.T." name="newPrixHT"/></Table.Cell>
                    <Table.Cell>
                        <div style={{display:"flex"}}>
                            <Button circular style={{color:"#2ecc71"}} inverted icon icon='check' onClick={this.saveEdit}/>
                            <Button circular style={{color:"#e74c3c"}} inverted icon icon='cancel' onClick={this.closeEdit}/>
                        </div>
                    </Table.Cell>
                </Table.Row>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>{this.props.piece.name}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.piece.brand}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.piece.reference}</Table.Cell>
                        <Table.Cell textAlign="center">{Intl.NumberFormat('fr-FR', {style: 'currency',currency: 'EUR'}).format(this.props.piece.prixHT)}</Table.Cell>
                        <Table.Cell textAlign="center" collapsing>
                            <div style={{display:"flex"}}>
                                <Popup trigger={<Button color="blue" icon onClick={this.showEdit} icon="edit"/>}>Editer</Popup>
                                <Popup trigger={<Button color="red" icon onClick={this.showDelete} icon="trash"/>}>Supprimer</Popup>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                    <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer cet element des pièces ?
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            {this.state.name}
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="red" onClick={this.deletePiece}>Supprimer</Button>
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

export default wrappedInUserContext = withUserContext(withRouter(PieceRow));
