import React, { Component, Fragment } from 'react'
import { Table, Icon, Button, Modal, Header, Label, List } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class StoredObjectRow extends Component {

    state={
        openDelete:false,
        displayStoredFileName:false,
        signedDownloadLink:"",
        linkGenerated:false,
        linkGenerating:false,
        displayDownloadLink:false,
        getSignedStoredObjectDownloadLinkQuery : gql`
            query getSignedStoredObjectDownloadLink($name: String!) {
                getSignedStoredObjectDownloadLink(name:$name)
            }
        `
    }

    getSignedDocumentDownloadLink = () => {
        this.setState({
            linkGenerating:true
        })
        this.props.client.query({
            query:this.state.getSignedStoredObjectDownloadLinkQuery,
            variables:{
                name:this.props.so.name
            }
        }).then((data)=>{
            this.setState({
                linkGenerated:true,
                linkGenerating:false,
                signedDownloadLink:data.data.getSignedStoredObjectDownloadLink
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
        if(this.props.so.doc._id == ""){
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>{this.props.so.name}</Table.Cell>
                        <Table.Cell textAlign="center" colSpan="5">NO DOC RELATED IN DB</Table.Cell>
                        <Table.Cell textAlign="center">
                            <Button circular style={{color:"#00a8ff"}} inverted icon icon='search' onClick={()=>{this.setState({displayStoredFileName:true})}}/>
                        </Table.Cell>
                    </Table.Row>
                    <Modal open={this.state.displayStoredFileName} onClose={()=>this.setState({displayStoredFileName:false})}>
                        <Header icon='file' content={this.props.so.doc.name} />
                        <Modal.Content>
                            <List divided relaxed>
                                <List.Item>
                                    <List.Icon name='folder open' size='large' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Header>Chemin</List.Header>
                                        <List.Description>{this.props.so.doc.path}</List.Description>
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
                </Fragment>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>{this.props.so.name}</Table.Cell>
                        <Table.Cell>{this.props.so.doc.originalFilename}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.so.doc.type}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.so.doc.ext}</Table.Cell>
                        <Table.Cell textAlign="center">{parseFloat(this.props.so.doc.size/1048576).toFixed(2)} Mo</Table.Cell>
                        <Table.Cell textAlign="center">
                            {<Label style={{marginRight:"16px"}}> {moment(this.props.so.doc.storageDate.split(" ")[0],"DD/MM/YYYY").fromNow()}</Label>}
                            le {this.props.so.doc.storageDate.split(" ").join(" à ")}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            <Button circular style={{color:"#00a8ff"}} inverted icon icon='search' onClick={()=>{this.setState({displayStoredFileName:true})}}/>
                        </Table.Cell>
                    </Table.Row>
                    <Modal open={this.state.displayStoredFileName} onClose={()=>this.setState({displayStoredFileName:false})}>
                        <Header icon='file' content={this.props.so.doc.name} />
                        <Modal.Content>
                            <List divided relaxed>
                                <List.Item>
                                    <List.Icon name='folder open' size='large' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Header>Chemin</List.Header>
                                        <List.Description>{this.props.so.doc.path}</List.Description>
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
  
export default wrappedInUserContext = withUserContext(StoredObjectRow);