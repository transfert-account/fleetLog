import React, { Component, Fragment } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Input, Table } from 'semantic-ui-react';
import gql from 'graphql-tag';

class PieceRow extends Component {

    state = {
        editing:false,
        _id:this.props.piece._id,
        newName:this.props.piece.name,
        type:this.props.piece.type,
        name:this.props.piece.name,
        openDelete:false,
        deletePieceQuery : gql`
            mutation deletePiece($_id:String!){
                deletePiece(_id:$_id)
            }
        `,
        editPieceQuery : gql`
            mutation editPiece($_id:String!,$name:String!){
                editPiece(_id:$_id,name:$name)
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
                name:this.state.newName
            }
        }).then(({data})=>{
            this.props.loadAllPieces();
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
            this.props.loadAllPieces();
        })
    }

    render() {
        if(this.state.editing){
            return (
                <Table.Row>
                    <Table.Cell><Input value={this.state.newName} onChange={this.handleChange} placeholder="Nom" name="newName"/></Table.Cell>
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
                        <Table.Cell>
                            <div style={{display:"flex"}}>
                                <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>    
                                <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
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
                            <Button color="red" onClick={this.deletePiece}>Ajouter</Button>
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
