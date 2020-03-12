import React, { Component, Fragment } from 'react'
import { Table, Input, Button, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import moment from 'moment'
import gql from 'graphql-tag';

class BatimentControlRow extends Component {

    state={
        _id:this.props.batiment._id,
        editing:false,
        newName:this.props.batiment.name,
        newDelai:this.props.batiment.delay,
        newLastExecution:this.props.batiment.lastExecution,
        deleteBatimentControlQuery : gql`
            mutation deleteBatimentControl($_id:String!){
                deleteBatimentControl(_id:$_id){
                    status
                    message
                }
            }
        `,
        editBatimentControlQuery : gql`
            mutation editBatimentControl($_id:String!,$name:String!,$phone:String!,$mail:String!,$address:String!){
                editBatimentControl(_id:$_id,name:$name,phone:$phone,mail:$mail,address:$address){
                    status
                    message
                }
            }
        `,
        getControlRows : () => {
            if(this.props.batiment.controls.length == 0){
                return (
                    <Table.Row error>
                        <Table.Cell colSpan={6} textAlign="center">
                            Aucun contrôle pour le batiment ({this.props.batiment.societe.name})
                        </Table.Cell>
                    </Table.Row>
                )
            }else{
                return(
                    <Fragment>
                        {this.props.batiment.controls.map(c=>
                            <Table.Row key={c._id} >
                                <Table.Cell textAlign="center">{this.props.batiment.societe.name}</Table.Cell>
                                <Table.Cell textAlign="center">{c.name}</Table.Cell>
                                <Table.Cell textAlign="center">{c.delay} jours</Table.Cell>
                                <Table.Cell textAlign="center">{c.lastExecution}</Table.Cell>
                                <Table.Cell textAlign="center">{this.getNextExecutionLabel(c.lastExecution,c.delay)}</Table.Cell>
                                <Table.Cell style={{textAlign:"center"}}>
                                    <Button circular style={{color:"#2ecc71"}} inverted icon icon='check' onClick={this.showEdit}/>
                                    <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>
                                    <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Fragment>
                )
            }
        }
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

    deleteBatiment = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteBatimentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteBatiment.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editBatimentQuery,
            variables:{
                _id:this.state._id,
                name:this.state.newName,
                phone:this.state.newPhone,
                mail:this.state.newMail,
                address:this.state.newAddress
            }
        }).then(({data})=>{
            data.editBatiment.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    getNextExecutionLabel = (date,delay) => {
        let nextDate = moment(date,"DD/MM/YYYY").add(delay, 'days');
        let daysLeft = parseInt(nextDate.diff(moment(),'day', true))
        if(daysLeft <= 0){
            return <Label color="red"> {nextDate.fromNow()}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        if(daysLeft > 0 && daysLeft <= 28){
            return <Label color="red"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        if(daysLeft > 28 && daysLeft <= 56){
            return <Label color="orange"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        return <Label color="green"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
    }

    loadBatiments = () => {
        this.props.loadBatiments();
    }

    render() {
        if(this.state.editing){
            return (
                <Table.Row>
                    <Table.Cell textAlign="center"><Input value={this.state.newName} onChange={this.handleChange} placeholder="Nom du batiment" name="newName"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input value={this.state.newPhone} onChange={this.handleChange} placeholder="Telephone du batiment" name="newPhone"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input value={this.state.newMail} onChange={this.handleChange} placeholder="Mail du batiment" name="newMail"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input value={this.state.newAddress} onChange={this.handleChange} placeholder="Adresse du batiment" name="newAddress"/></Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button onClick={this.closeEdit} color="red">Annuler</Button>
                        <Button onClick={this.saveEdit} color="blue">Sauvegarder</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }else{
            return (
                <Fragment>
                    {this.state.getControlRows()}
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
  
export default wrappedInUserContext = withUserContext(BatimentControlRow);