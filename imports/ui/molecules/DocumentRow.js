import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Button, Modal, Header, Label, List } from 'semantic-ui-react';
import SocietePicker from '../atoms/SocietePicker';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class AccountRow extends Component {

    state={
        openDelete:false,
        displayStoredFileName:false,
        signedDownloadLink:"",
        linkGenerated:false,
        linkGenerating:false,
        displayDownloadLink:false,
        getSignedDocumentDownloadLinkQuery : gql`
            query getSignedDocumentDownloadLink($_id: String!) {
                getSignedDocumentDownloadLink(_id:$_id)
            }
        `
    }

    getSignedDocumentDownloadLink = () => {
        this.setState({
            linkGenerating:true
        })
        this.props.client.query({
            query:this.state.getSignedDocumentDownloadLinkQuery,
            variables:{
                _id:this.props.document._id
            }
        }).then((data)=>{
            this.setState({
                linkGenerated:true,
                linkGenerating:false,
                signedDownloadLink:data.data.getSignedDocumentDownloadLink
            })
        })
    }

    closeDelete = () => {
        this.setState({openDelete:false})
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }

    reloadDocuments = () => {
        this.props.reloadDocuments()
    }

    getDownloadLink = () => {
        if(this.state.linkGenerated){
            return <a href={this.state.signedDownloadLink} target="blank" download>{this.state.signedDownloadLink}</a>
        }else{
            return <p>Cliquez sur "Générer" pour faire apparaître le lien de téléchargement</p>
        }
    }

    getDownloadButton = () => {
        if(this.state.linkGenerated){
            return (
                <Button color="black" onClick={()=>{this.setState({displayDownloadLink:true})}}>Afficher</Button>
            )
        }else{
            if(this.state.linkGenerating){
                return (
                    <Button color="black" loading></Button>
                )
            }else{
                return (
                    <Button color="black" onClick={this.getSignedDocumentDownloadLink}>Générer</Button>
                )
            }
        }
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.document.originalFilename}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.document.type}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.document.ext}</Table.Cell>
                    <Table.Cell textAlign="center">{parseFloat(this.props.document.size/1048576).toFixed(2)} Mo</Table.Cell>
                    <Table.Cell textAlign="center">
                        {<Label style={{marginRight:"16px"}}> {moment(this.props.document.storageDate.split(" ")[0],"DD/MM/YYYY").fromNow()}</Label>}
                        le {this.props.document.storageDate.split(" ").join(" à ")}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                        <Button circular style={{color:"#00a8ff"}} inverted icon icon='search' onClick={()=>{this.setState({displayStoredFileName:true})}}/>
                    </Table.Cell>
                </Table.Row>
                <Modal open={this.state.displayStoredFileName} onClose={()=>this.setState({displayStoredFileName:false})}>
                    <Header icon='file' content={this.props.document.name} />
                    <Modal.Content>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='folder open' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Chemin</List.Header>
                                    <List.Description>{this.props.document.path}</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                        <br/>
                        {this.getDownloadLink()}
                    </Modal.Content>
                    <Modal.Actions>
                        {this.getDownloadButton()}
                        <Button basic color='red' onClick={()=>this.setState({displayStoredFileName:false})}>
                            <Icon name='cancel'/> Fermer
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} dimmer="inverted" size="small" open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmez la suppression du compte:
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Nom du fichier :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {this.props.document.name}
                                </p>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Nom d'origine :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {this.props.document.originalFilename}
                                </p>
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelete}>Annuler</Button>
                        <Button color="red" onClick={()=>{this.props.deleteDocument(this.props.document._id)}}>Supprimer</Button>
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