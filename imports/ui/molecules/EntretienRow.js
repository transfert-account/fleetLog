import React, { Component, Fragment } from 'react'
import { Table, Button, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class EntretienRow extends Component {

    state={
        _id:this.props.entretien._id,
        newVehicle:this.props.entretien.vehicle,
        deleteEntretienQuery : gql`
            mutation deleteEntretien($_id:String!){
                deleteEntretien(_id:$_id)
            }
        `
    }

    navigateToEntretien = () => {
        this.props.history.push("/entretien/"+this.state._id);
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
    deleteEntretien = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteEntretienQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            this.props.loadEntretiens();
        })
    }
    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editEntretienQuery,
            variables:{
                _id:this.state._id,
                name:this.state.newName,
                phone:this.state.newPhone,
                mail:this.state.newMail,
                address:this.state.newAddress
            }
        }).then(({data})=>{
            this.props.loadEntretiens();
        })
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell>{this.props.entretien.title}</Table.Cell>
                    <Table.Cell>{this.props.entretien.description.substring(0,128)}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='arrow right' onClick={this.navigateToEntretien}/>
                        <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                    </Table.Cell>
                </Table.Row>
                <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Supprimer l'entretien du vehicule : {this.props.entretien.vehicle.registration} ?
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                        <Button color="red" onClick={this.deleteEntretien}>Supprimer</Button>
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
  
export default wrappedInUserContext = withRouter(withUserContext(EntretienRow));