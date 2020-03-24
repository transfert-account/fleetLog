import React, { Component, Fragment } from 'react'
import { Table, Label, Dropdown, Icon, Message, Button, Modal } from 'semantic-ui-react';
import SocietePicker from '../atoms/SocietePicker';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

export class AccountRow extends Component {

    state={
        openDelete:false,
        openUnsetAdmin:false,
        needToRefreshSociete:false,
        newSociete:this.props.u.visibility,
        setAdminQuery:gql`mutation setAdmin($admin: String!,$_id: String!){
            setAdmin(admin: $admin,_id: $_id){
                status
                message
            }
        }`,
        unsetAdminQuery:gql`mutation unsetAdmin($admin: String!,$_id: String!,$societe: String!){
            unsetAdmin(admin: $admin,_id: $_id,societe: $societe){
                status
                message
            }
        }`,
        toggleActiveQuery:gql`mutation toggleActive($admin: String!,$_id: String!){
            toggleActive(admin: $admin,_id: $_id){
                status
                message
            }
        }`,
        setVisibilityQuery:gql`mutation setVisibility($visibility: String!,$_id: String!){
            setVisibility(visibility: $visibility,_id: $_id){
                status
                message
            }
        }`
    }

    closeDelete = () => {
        this.setState({openDelete:false})
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }

    closeUnsetAdmin = () => {
        this.setState({openUnsetAdmin:false})
    }

    showUnsetAdmin = () => {
        this.setState({openUnsetAdmin:true})
    }

    tryShowUnsetAdmin = () => {
        if(this.props.u.visibility == "noidthisisgroupvisibility"){
            this.showUnsetAdmin()
        }else{
            this.unsetAdmin(this.props.u._id)
        }
    }

    deleteAccount = _id => {
        this.props.deleteAccount(_id);
    }

    setAdmin = _id =>{
        this.props.client.mutate({
            mutation : this.state.setAdminQuery,
            variables:{
                admin:Meteor.userId(),
                _id:_id
            }
        }).then(({data})=>{
            data.setAdmin.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.reloadAccounts();
                    this.setState({
                        needToRefreshSociete:true
                    })
                }else{
                  this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    unsetAdmin = _id =>{
        this.props.client.mutate({
            mutation : this.state.unsetAdminQuery,
            variables:{
                admin:Meteor.userId(),
                _id:_id,
                societe:this.state.newSociete
            }
        }).then(({data})=>{
            data.unsetAdmin.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeUnsetAdmin();
                    this.reloadAccounts();
                    this.setState({
                        needToRefreshSociete:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    setOwner = _id =>{
        this.props.setOwner(_id);
    }
    
    activateAccount = _id =>{
        this.props.client.mutate({
            mutation : this.state.toggleActiveQuery,
            variables:{
                admin:Meteor.userId(),
                _id:_id
            }
        }).then(({data})=>{
            data.toggleActive.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.reloadAccounts();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    setVisibility = (e, { value }) => {
        this.props.client.mutate({
            mutation : this.state.setVisibilityQuery,
            variables:{
                visibility:value,
                _id:this.props.u._id
            }
        }).then(({data})=>{
            data.setVisibility.map(qrm=>{
                if(qrm.status){
                  this.props.toast({message:qrm.message,type:"success"});
                  this.reloadAccounts();
                }else{
                  this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    executeNukeQuery = () => {
        this.props.client.query({
            query:gql`
                query testThis{
                    testThis{
                        status
                        message
                    }
                }
            `
        }).then(({data})=>{
            data.testThis.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    didRefreshSociete = () => {
        this.setState({
            needToRefreshSociete:false
        })
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

    reloadAccounts = () => {
        this.props.reloadAccounts()
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.u.firstname + " " + this.props.u.lastname}</Table.Cell>
                    <Table.Cell>{("00"+(parseInt(new Date(parseInt(this.props.u.createdAt)).getDate())).toString()).slice(-2) + "/" + ("00"+(parseInt(new Date(parseInt(this.props.u.createdAt)).getMonth())+1).toString()).slice(-2) + "/" + new Date(parseInt(this.props.u.createdAt)).getFullYear() + " - " + ("00"+(parseInt(new Date(parseInt(this.props.u.createdAt)).getHours())).toString()).slice(-2) + ":" + ("00"+(parseInt(new Date(parseInt(this.props.u.createdAt)).getMinutes())).toString()).slice(-2) + ":" + ("00"+(parseInt(new Date(parseInt(this.props.u.createdAt)).getSeconds())).toString()).slice(-2)}</Table.Cell>
                    <Table.Cell>{this.props.u.email}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {(this.props.u.isOwner ?
                        <Label style={{textAlign:"center"}} color="blue">Propriétaire</Label>
                        :
                        (this.props.u.isAdmin ?
                            <Label style={{textAlign:"center"}} color="yellow">
                                oui
                                <Label.Detail>
                                    <Icon name='check'/>
                                </Label.Detail>
                            </Label>
                        :
                            <Label style={{textAlign:"center"}}>
                                non
                                <Label.Detail>
                                    <Icon name='delete'/>
                                </Label.Detail>
                            </Label>
                        )
                        )}
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {(this.props.u.isOwner ?
                        <Label style={{textAlign:"center"}} color="blue">Propriétaire</Label>
                        :
                        (this.props.u.activated ?
                            <Label style={{textAlign:"center"}}>
                                actif
                                <Label.Detail>
                                    <Icon name='check'/>
                                </Label.Detail>
                            </Label>
                        :
                            <Label style={{textAlign:"center"}} color="black">
                                inactif
                                <Label.Detail>
                                    <Icon name='delete'/>
                                </Label.Detail>
                            </Label>
                        )
                        )}
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {(this.props.user.isOwner ?
                        <SocietePicker didRefresh={this.didRefreshSociete} needToRefresh={this.state.needToRefreshSociete} groupAppears={(this.props.u.isOwner || this.props.u.isAdmin)} onChange={this.setVisibility} value={this.props.u.visibility} />
                        :
                        <p>{this.props.u.societe.name}</p>
                        )}
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {(this.props.u.isOwner ?
                            <Fragment>
                                {((this.props.user.isOwner) ?
                                    <Dropdown style={{margin:"0",padding:"6px"}} text='Actions ...' floating labeled button className='icon'>
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon='bolt' color="violet" text='Nuke the app /!\' onClick={()=>{this.executeNukeQuery()}}/>                
                                        </Dropdown.Menu>
                                    </Dropdown>
                                : 
                                    ""
                                )}
                            </Fragment>
                        :
                            <Fragment>
                                {((this.props.user.isOwner) ?
                                    <Dropdown style={{margin:"0",padding:"6px"}} text='Actions ...' floating labeled button className='icon'>
                                        <Dropdown.Menu>
                                            {(this.props.u.isAdmin ?
                                                <Dropdown.Item icon='delete' color="orange" text="Retirer les droits d'admin" onClick={this.tryShowUnsetAdmin}/>
                                            :
                                                <Dropdown.Item icon='certificate' color="gree" text="Donner les droits d'admin" onClick={()=>{this.setAdmin(this.props.u._id)}}/>
                                            )}
                                            {(this.props.u.activated ?
                                                <Dropdown.Item icon='delete' color="orange" text='Désactiver le compte' onClick={()=>{this.activateAccount(this.props.u._id)}}/>
                                            :
                                                <Dropdown.Item icon='check' color="green" text='Activer le compte' onClick={()=>{this.activateAccount(this.props.u._id)}}/>
                                            )}
                                            {((this.props.u.isAdmin && !this.props.u.isOwner && this.props.user.isOwner) ?
                                                <Dropdown.Item icon='gem outline' color="violet" text='Nommer propriétaire' onClick={()=>{this.setOwner(this.props.u._id)}}/>
                                                :
                                                ""
                                            )}
                                            <Dropdown.Item icon='trash' color="red" text='Supprimer le compte' onClick={()=>{this.showDelete(this.props.u._id)}}/>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                :
                                    <Dropdown style={{margin:"0",padding:"6px"}} text='Actions ...' floating labeled button className='icon'>
                                        <Dropdown.Menu>
                                            {(this.props.u.activated ?
                                                <Dropdown.Item icon='delete' color="orange" text='Désactiver le compte' onClick={()=>{this.activateAccount(this.props.u._id)}}/>
                                            :
                                                <Dropdown.Item icon='check' color="green" text='Activer le compte' onClick={()=>{this.activateAccount(this.props.u._id)}}/>
                                            )}
                                            <Dropdown.Item icon='trash' color="red" text='Supprimer le compte' onClick={()=>{this.showDelete(this.props.u._id)}}/>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </Fragment>
                        )}
                    </Table.Cell>
                </Table.Row>
                <Modal closeOnDimmerClick={false} dimmer="inverted" size="small" open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmez la suppression du compte:
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Utilisateur :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {this.props.u.firstname + " " + this.props.u.lastname}
                                </p>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Mail :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {this.props.u.email}
                                </p>
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelete}>Annuler</Button>
                        <Button color="red" onClick={()=>{this.deleteAccount(this.props.u._id)}}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} dimmer="inverted" size="small" open={this.state.openUnsetAdmin} onClose={this.closeUnsetAdmin} closeIcon>
                    <Modal.Header>
                        Suppression des droits administrateur : {this.props.u.firstname + " " + this.props.u.lastname}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message icon>
                            <Icon name='warning sign'/>
                            <Message.Content>
                                Un compte ne possèdant pas de droits administrateur ne peux avoir la visibilité "Groupe", pour retirer les droit administrateur de ce compte, veuillez lui assigner une société.
                            </Message.Content>
                        </Message>
                        <SocietePicker groupAppears={false} onChange={this.handleChangeSociete} defaultValue={(this.props.u.visibility == "noidthisisgroupvisibility" ? "" : this.props.u.visibility)} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeUnsetAdmin}>Annuler</Button>
                        <Button color="red" onClick={()=>{this.unsetAdmin(this.props.u._id)}}>Retier les droits</Button>
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
  
export default wrappedInUserContext = withUserContext(AccountRow);