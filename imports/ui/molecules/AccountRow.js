import React, { Component, Fragment } from 'react'
import { Table, Label, Dropdown, Icon, Message, Button, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

export class AccountRow extends Component {

    state={
        user:this.props.u,
        openDelete:false,
        activated:this.props.u.activated,
        isAdmin:this.props.u.isAdmin,
        isOwner:this.props.u.isOwner,
        visibility:this.props.u.visibility,
        toggleAdminQuery:gql`mutation toggleAdmin($admin: String!,$_id: String!){
            toggleAdmin(admin: $admin,_id: $_id){
                _id
                isAdmin
            }
        }`,
        toggleActiveQuery:gql`mutation toggleActive($admin: String!,$_id: String!){
            toggleActive(admin: $admin,_id: $_id){
                _id
                activated
            }
        }`,
        setVisibility:gql`mutation setVisibility($visibility: String!,$_id: String!){
            setVisibility(visibility: $visibility,_id: $_id){
                _id
                visibility
            }
        }`
    }

    closeDelete = () => {
        this.setState({openDelete:false})
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }

    deleteAccount = _id => {
        this.props.deleteAccount(_id);
    }

    setAdmin = _id =>{
        this.props.client.mutate({
            mutation : this.state.toggleAdminQuery,
            variables:{
                admin:Meteor.userId(),
                _id:_id
            }
        }).then(({data})=>{
            this.setState({
                isAdmin:data.toggleAdmin.isAdmin
            });
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
            this.setState({
                activated:data.toggleActive.activated
            });
        })
    }

    setVisibility = (e, { value }) => {
        this.props.client.mutate({
            mutation : this.state.setVisibility,
            variables:{
                visibility:value,
                _id:this.state.user._id
            }
        }).then(({data})=>{
            this.setState({
                visibility:data.setVisibility.visibility
            });
        })
    }

    render() {
        const { user,activated,isAdmin,isOwner } = this.state;
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{user.firstname + " " + user.lastname}</Table.Cell>
                    <Table.Cell>{("00"+(parseInt(new Date(parseInt(user.createdAt)).getDate())).toString()).slice(-2) + "/" + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getMonth())+1).toString()).slice(-2) + "/" + new Date(parseInt(user.createdAt)).getFullYear() + " - " + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getHours())).toString()).slice(-2) + ":" + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getMinutes())).toString()).slice(-2) + ":" + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getSeconds())).toString()).slice(-2)}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {(user.isOwner ?
                        <Label style={{textAlign:"center"}} color="blue">Propriétaire</Label>
                        :
                        (isAdmin ?
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
                        {(isOwner ?
                        <Label style={{textAlign:"center"}} color="blue">Propriétaire</Label>
                        :
                        (activated ?
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
                        <Dropdown style={{margin:"auto 12px"}} placeholder='Choisir un société' search selection onChange={this.setVisibility} value={this.state.visibility} options={this.props.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                    {(user.isOwner ? "" :
                        <Dropdown style={{margin:"0",padding:"6px"}} text='Actions ...' floating labeled button className='icon'>
                        <Dropdown.Menu>
                            {(isAdmin ?
                                <Dropdown.Item icon='delete' color="orange" text="Retirer les droits d'admin" onClick={()=>{this.setAdmin(user._id)}}/>
                            :
                                <Dropdown.Item icon='certificate' color="gree" text="Donner les droits d'admin" onClick={()=>{this.setAdmin(user._id)}}/>
                            )}
                            {(activated ?
                                <Dropdown.Item icon='delete' color="orange" text='Désactiver le compte' onClick={()=>{this.activateAccount(user._id)}}/>
                            :
                                <Dropdown.Item icon='check' color="green" text='Activer le compte' onClick={()=>{this.activateAccount(user._id)}}/>
                            )}
                            {((isAdmin && !isOwner && this.props.user.isOwner) ?
                                <Dropdown.Item icon='gem outline' color="violet" text='Nommer propriétaire' onClick={()=>{this.setOwner(user._id)}}/>
                                :
                                ""
                            )}
                            <Dropdown.Item icon='trash' color="red" text='Supprimer le compte' onClick={()=>{this.showDelete(user._id)}}/>
                        </Dropdown.Menu>
                        </Dropdown>
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
                                    {user.firstname + " " + user.lastname}
                                </p>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Mail :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {user.email}
                                </p>
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="red" onClick={()=>{this.deleteAccount(user._id)}}>Supprimer</Button>
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