import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Form, Label } from 'semantic-ui-react';
import DocStateLabel from '../atoms/DocStateLabel';
import FileManagementPanel from '../atoms/FileManagementPanel';
import { UserContext } from '../../contexts/UserContext';
import moment from 'moment';
import { gql } from 'apollo-server-express';

class ControlEquipementRow extends Component {
    
    state={
        equipement : this.props.equipement,
        openDocs:false,
        newControlTech:null,
        controlPeriodUnits:[
            {
                type:{text:"Temps",key:"t",value:"t"},
                units:[
                    {text:"Mois",key:"m",value:"m"},
                    {text:"Ans",key:"y",value:"y"}
                ]
            },
            {
                type:{text:"Distance",key:"d",value:"d"},
                units:[
                    {text:"Kilomètres",key:"km",value:"km"},
                ]
            },
            {
                type:{text:"Temps de route",key:"r",value:"r"},
                units:[
                    {text:"Heures",key:"h",value:"h"},
                ]
            }
        ],
        uploadControlDocumentQuery : gql`
            mutation uploadControlDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadControlDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
    }

    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }
    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.equipement.controlTech._id == "" ? "red" : "green"} title="Contrôle technique"/>
            </Table.Cell>
        )
    }
    getLastControlCell = () => {
        if(this.props.equipement.equipementDescription.controlPeriodUnit == "y" || this.props.equipement.equipementDescription.controlPeriodUnit == "m"){
            return(
                <div>
                    {this.props.equipement.lastControl}
                    <Label style={{marginLeft:"16px"}} size="small" horizontal>
                        {this.getTimeBetween(this.props.equipement.lastControl)}
                    </Label>
                </div>
            )
        }else{
            return (
                <div>
                    {this.props.equipement.lastControl} km
                    <Label style={{marginLeft:"16px"}} size="small" horizontal>
                        il y a {this.props.vehicle.km - this.props.equipement.lastControl} km
                    </Label>
                </div>
            )
        }
    }
    getNextControlCell = () => {
        if(this.props.equipement.equipementDescription.controlPeriodUnit == "y" || this.props.equipement.equipementDescription.controlPeriodUnit == "m"){
            this.props.equipement.nextControl = moment(this.props.equipement.lastControl,"DD/MM/YYYY").add(this.props.equipement.equipementDescription.controlPeriodValue,this.props.equipement.equipementDescription.controlPeriodUnit.toUpperCase()).format("DD/MM/YYYY")
            return (
                <div>
                    {this.props.equipement.nextControl}
                    <Label color={this.props.equipement.color} style={{marginLeft:"16px"}} size="small" horizontal>
                        {this.getTimeBetween(this.props.equipement.nextControl)}
                    </Label>
                </div>
            )
        }else{
            if(this.props.equipement.nextControl > 0){
                return (
                    <div>
                        {parseInt(this.props.equipement.lastControl) + parseInt(this.props.equipement.equipementDescription.controlPeriodValue)} km
                        <Label color={this.props.equipement.color} style={{marginLeft:"16px"}} size="small" horizontal>
                            dans {this.props.equipement.nextControl} km
                        </Label>
                    </div>
                )
            }else{
                return (
                    <div>
                        {parseInt(this.props.equipement.lastControl) + parseInt(this.props.equipement.equipementDescription.controlPeriodValue)} km
                        <Label color={this.props.equipement.color} style={{marginLeft:"16px"}} size="small" horizontal>
                            dépassé de {Math.abs(this.props.equipement.nextControl)} km
                        </Label>
                    </div>
                )
            }
        }
    }
    getTimeBetween = (time) => {
        if(moment(time, "DD/MM/YYYY").diff(moment())){
            return moment(time, "DD/MM/YYYY").fromNow();
        }else{
            return moment(time, "DD/MM/YYYY").toNow();
        }
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
    }
    uploadDocControlTech = () => {
        this.props.client.mutate({
            mutation:this.state.uploadControlDocumentQuery,
            variables:{
                _id:this.state.equipement._id,
                file:this.state.newControlTech,
                type:"controlTech",
                size:this.state.newControlTech.size
            }
        }).then(({data})=>{
            data.uploadControlDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadVehicles();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    render() {
        return (
            <Fragment>
                <Table.Row key={this.props.equipement._id}>
                    <Table.Cell textAlign="center">{this.props.equipement.equipementDescription.name}</Table.Cell>
                    <Table.Cell textAlign="center">
                        {this.props.equipement.attachementDate}
                        <Label style={{marginLeft:"16px"}} size="small" horizontal>
                            {this.getTimeBetween(this.props.equipement.attachementDate)}
                        </Label>
                    </Table.Cell>
                    <Table.Cell textAlign="center">{this.getLastControlCell()}</Table.Cell>
                    <Table.Cell textAlign="center">{this.getNextControlCell()}</Table.Cell>
                    {this.getDocsStates()}
                    <Table.Cell textAlign="center">
                        <Button circular color="purple" inverted icon onClick={this.showDocs} icon="folder" />
                        <Button circular color="green" inverted icon onClick={this.showUpdateControlDate} icon="wrench" />
                        <Button circular color="red" inverted icon onClick={this.showDissociateEquipement} icon="cancel" />
                    </Table.Cell>
                </Table.Row>
                <Modal closeOnDimmerClick={false} open={this.state.openDissociateEquipement} onClose={this.closeDissociateEquipement} closeIcon>
                    <Modal.Header>
                        Dissocier ce contrôle du véhicule :
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDissociateEquipement}>Annuler</Button>
                        <Button color="red" onClick={this.dissociateEquipement}>Dissocier</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openUpdateControl} onClose={this.closeUpdateControl} closeIcon>
                    <Modal.Header>
                        Mise à jour du contrôle de l'equipement :
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",margin:"auto 25%",gridTemplateRows:"1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field className={this.state.hideLastControlDate}><label>Date de contrôle</label><input onChange={this.handleChange} name="newUpdatedControlDate" value={this.state.newUpdatedControlDate} onFocus={()=>{this.showDatePicker("newUpdatedControlDate")}} placeholder="Date du contrôle"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlKm}><label>Kilomètre au contrôle</label><input onChange={this.handleChange} name="newUpdatedControlKm" value={this.state.newUpdatedControlKm} placeholder="Kilomètre au contrôle"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeUpdateControl}>Annuler</Button>
                        <Button color="green" onClick={this.updateControlEquipement}>Mettre à jour</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                    <Modal.Header>
                        Documents relatifs au vehicule immatriculé : {this.props.vehicle.registration}, contrôle de l'équipement : {this.props.equipement.equipementDescription.name}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"24px"}}>
                            <FileManagementPanel importLocked={this.state.newControlTech == null} handleInputFile={this.handleInputFile} fileTarget="newControlTech" uploadDoc={this.uploadDocControlTech} downloadDoc={this.downloadDocControlTech} fileInfos={this.props.equipement.controlTech} title="Contrôle technique" type="controlTech"/>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDocs}>Fermer</Button>
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
  
export default wrappedInUserContext = withUserContext(ControlEquipementRow);