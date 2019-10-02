import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Icon, Message, Button, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

export class VehiclesRow extends Component {

    state={
        openDelete:false,
        openDocs:false,
        openEdit:false,
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    showEdit = () => {
        this.setState({openEdit:true})
    }
    closeDelete = () => {
        this.setState({openDelete:false})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
    }
    closeEdit = () => {
        this.setState({openEdit:false})
    }

    deleteVehicle = () => {
        
    }

    editVehicle = () => {
        
    }

    downloadDoc = doc => {
        
    }
    
    uploadDoc = doc => {
        
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.vehicle.company}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.registration}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.firstRegistrationDate}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.km}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.lastKmUpdate}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.brand}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.model}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.volume}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.payload}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.color}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.insurancePaid}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.endDate}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.property}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Dropdown style={{margin:"0",padding:"6px"}} text='Actions ...' floating labeled button className='icon'>
                            <Dropdown.Menu>
                                <Dropdown.Item style={{color:"#a29bfe"}} icon='folder open' text="Documents" onClick={this.showDocs}/>
                                <Dropdown.Item style={{color:"#2980b9"}} icon='edit' text="Editer" onClick={this.showEdit}/>
                                <Dropdown.Item style={{color:"#e74c3c"}} icon='trash' text='Supprimer' onClick={this.showDelete}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Table.Cell>
                </Table.Row>
                <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                    <Modal.Header>
                        Documents relatifs au vehicle immatriculé : {this.props.vehicle.registration}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"1fr auto 1fr",gridGap:"0 24px"}}>
                            <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 1</p>
                            <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 2</p>
                            <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                <p className="gridLabel">Nom du fichier :</p>
                                <p className="gridValue">Doc Name XYZ</p>
                                <p className="gridLabel">Taille du fichier:</p>
                                <p className="gridValue">1234 kB</p>
                                <p className="gridLabel">Enregistré le :</p>
                                <p className="gridValue">01/02/2019</p>
                            </Message>
                            <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                <p className="gridLabel">Nom du fichier :</p>
                                <p className="gridValue">Doc Name XYZ</p>
                                <p className="gridLabel">Taille du fichier:</p>
                                <p className="gridValue">1234 kB</p>
                                <p className="gridLabel">Enregistré le :</p>
                                <p className="gridValue">01/02/2019</p>
                            </Message>
                            <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                            <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                            <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                            <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="grey" onClick={this.closeDocs}>Fermer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmez la suppression du véhicule immatriculé : {this.props.vehicle.registration}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="red" onClick={this.closeDelete}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openEdit} onClose={this.closeEdit} closeIcon>
                    <Modal.Header>
                        Edition du véhicule:
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="red" onClick={this.closeEdit}>Supprimer</Button>
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
  
export default wrappedInUserContext = withUserContext(VehiclesRow);

/*style={{color:"#a29bfe"}}
style={{color:"#e67e22"}}
style={{color:"#27ae60"}}
style={{color:"#2d3436"}}
style={{color:"#2980b9"}}
style={{color:"#e74c3c"}} */