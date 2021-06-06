import React, { Component, Fragment } from 'react'
import { Table, Label, Popup } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import DocStateLabel from '../atoms/DocStateLabel';

class AccidentRow extends Component {

    state={
        _id:this.props.accident._id,
    }

    navigateToAccident = () => {
        this.props.history.push("/accident/"+this.props.accident._id);
    }
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    /*DB READ AND WRITE*/
    loadAccidents = () => {
        this.props.loadAccidents();
    }
    /*CONTENT GETTERS*/
    getConstatSentLabel = () => {
        if(this.props.accident.constatSent == "yes"){
            return <Label color="green">Oui</Label>
        }else{
            if(this.props.accident.constatSent == "internal"){
                return <Label color="grey">Non déclaré</Label>
            }else{
                return <Label color="red">Non</Label>
            }
        }
    }
    getQuestionsProgress = () => {
        let val = this.props.accident.answers.reduce((a,b)=>{
            let tot = a + b.fields.reduce((c,d) => {
                if(d.status == "validated"){
                    return c + 1
                }else{
                    return c
                }
            },0);
            return tot
        },0);
        let color = "orange";
        if(val == 24){
            color="green"
        }else{
            if(val == 0){color="red"}
        }
        return <Label style={{margin:"0"}} color={color}>{val}/24</Label>
    }
    getStatusLabel = () => {
        if(this.props.accident.status){
            return <Label color="green">Ouvert</Label>
        }else{
            return <Label color="grey">Clos</Label>
        }
    }
    getOthersLabel = () => {
        let totUndef = 0;
        if(this.props.accident.reglementAssureur == "" || this.props.accident.reglementAssureur == -1){totUndef++}
        if(this.props.accident.chargeSinistre == "" || this.props.accident.chargeSinistre == -1){totUndef++}
        if(this.props.accident.montantInterne == "" || this.props.accident.montantInterne == -1){totUndef++}
        if(this.props.accident.dateExpert == ""){totUndef++}
        if(this.props.accident.dateTravaux == ""){totUndef++}
        if(totUndef == 0){
            return <Popup trigger = {<Label color="green">5/5</Label>}> Les informations évoquées ici sont : le reglement assureur, la charge du sinistre, le montant interne, la date du passage de l'expert, la date des travaux.</Popup>
        }else{
            return <Popup trigger = {<Label color="red">{5-totUndef}/5</Label>}> Les informations évoquées ici sont : le reglement assureur, la charge du sinistre, le montant interne, la date du passage de l'expert, la date des travaux.</Popup>
        }
    }
    getResposabiliteLabel = () => {
        if(this.props.accident.responsabilite == 0){
            return <Label color="green">0 %</Label>
        }else{
            if(this.props.accident.responsabilite == 50){
                return <Label color="yellow">50 %</Label>
            }else{
                if(this.props.accident.responsabilite == 100){
                    return <Label color="orange">100%</Label>
                }else{
                    if(this.props.accident.responsabilite == -1){
                        return <Label color="grey">A définir</Label>
                    }else{
                        return <Label color="black">Error</Label>
                    }
                }
            }
        }
    }
    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.accident.constat._id == "" ? "red" : "green"} title="Constat"/>
                <DocStateLabel color={this.props.accident.rapportExp._id == "" ? "red" : "green"} title="Rapport de l'expert"/>
                <DocStateLabel color={this.props.accident.facture._id == "" ? "red" : "green"} title="Facture"/>
                <DocStateLabel color={this.props.accident.questionary._id == "" ? "red" : "green"} title="Questionnaire"/>
            </Table.Cell>
        )
    }
    getRowActions = () => {
        let actions = [
            {color:"blue",click:()=>{this.navigateToAccident()},icon:'arrow right',tooltip:"Détails de l'accident"}
        ];
        return actions;
    }
    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.vehicle.societe.name}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.vehicle.registration}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.accident.occurenceDate}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.getOthersLabel()}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.getQuestionsProgress()}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.getConstatSentLabel()}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.getResposabiliteLabel()}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.getStatusLabel()}</Table.Cell>
                    {this.getDocsStates()}
                    <ActionsGridCell actions={this.getRowActions()}/>
                </Table.Row>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(AccidentRow);