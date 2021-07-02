import React, { Component, Fragment } from 'react';
import { Table, Modal, Button, Popup } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ControlRow extends Component {

    state={
        openDeleteControl:false,
        unitsRaw:[
            {type:"distance",unit:"km",label:"km"},
            {type:"time",unit:"d",label:"jours"},
            {type:"time",unit:"m",label:"mois"},
            {type:"time",unit:"y",label:"ans"}
        ],
        deleteControlQuery: gql`
            mutation deleteControl($_id:String!){
                deleteControl(,_id:$_id){
                    status
                    message
                }
            }
        `,
    }
    
    /*SHOW AND HIDE MODALS*/
    showDeleteControl = () => this.setState({openDeleteControl:true})
    closeDeleteControl = () => this.setState({openDeleteControl:false})
    
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    deleteControl = () => {
        this.props.client.mutate({
            mutation:this.state.deleteControlQuery,
            variables:{
                _id:this.props.control._id
            }
        }).then(({data})=>{
            data.deleteControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadControls(this.props.ctrlType);
                    this.closeDeleteControl()
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                    this.closeDeleteControl()
                }
            })
        })

    }
    /*CONTENT GETTERS*/
    getUnitLabel = unit => {
        return this.state.unitsRaw.filter(u=>u.unit == unit)[0].label;
    }
    getFrequencyLabel = () => {
        if(this.props.control.firstIsDifferent){
            return (this.props.control.firstFrequency + " " + this.getUnitLabel(this.props.control.unit) + " puis tous les " + this.props.control.frequency + " " + this.getUnitLabel(this.props.control.unit))
        }else{
            return (this.props.control.frequency + " " + this.getUnitLabel(this.props.control.unit))
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Fragment>
            <Table.Row>
                <Table.Cell>{this.props.control.name}</Table.Cell>
                <Table.Cell collapsing textAlign="center">
                    {this.getFrequencyLabel()}
                </Table.Cell>
                <Table.Cell textAlign="center">{this.props.control.alert + " " + this.getUnitLabel(this.props.control.alertUnit)}</Table.Cell>
                <Table.Cell textAlign="center">
                    <Popup trigger={
                        <Button color="red" icon onClick={this.showDeleteControl} icon="trash"/>
                    }>
                        Supprimer le contrôle
                    </Popup>
                </Table.Cell>
            </Table.Row>
            <Modal size="mini" closeOnDimmerClick={false} open={this.state.openDeleteControl} onClose={this.closeDeleteControl} closeIcon>
                <Modal.Header>
                    Suppresion du contrôle : {this.props.control.name}
                </Modal.Header>
                <Modal.Actions>
                    <Button color="black" onClick={this.closeDeleteControl}>Annuler</Button>
                    <Button color="red" onClick={this.deleteControl}>Supprimer</Button>
                </Modal.Actions>
            </Modal>
        </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(ControlRow);