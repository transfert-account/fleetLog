import React, { Component } from 'react';
import { Input, Table, Menu, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import DocumentRow from '../molecules/DocumentRow';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class Documents extends Component {

  state = {
    documentsFilter:"",
    documentsQuery:gql`
        query documents{
            documents{
                _id
                name
                size
                path
                originalFilename
                ext
                type
                storageDate
                mimetype
            }
        }
    `,
    documentsRaw:[],
    documents : () => {
      let displayed = Array.from(this.state.documentsRaw);
      displayed = displayed.filter(d=>d.name.toLowerCase().includes(this.state.documentsFilter.toLowerCase()) || d.originalFilename.toLowerCase().includes(this.state.documentsFilter.toLowerCase()));
      return displayed.map(d=>(
        <DocumentRow key={d._id} document={d}/>
      ))
    }
  }

  handleFilter = e => {
    this.setState({
      documentsFilter : e.target.value
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.loadDocuments();
  }

  getMenu = () => {
    if(this.props.user.isOwner){
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/Documents")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
            <Menu.Item color="blue" name='exports' onClick={()=>{this.props.history.push("/administration/exports")}}><Icon name='file excel outline'/>Exports</Menu.Item>
            <Menu.Item color="blue" name='patchnotes' onClick={()=>{this.props.history.push("/administration/patchnotes")}}><Icon name='clipboard list'/>Notes de version</Menu.Item>
            <Menu.Item color="blue" name='documents' active onClick={()=>{this.props.history.push("/administration/documents")}}><Icon name='file outline'/>Documents S3</Menu.Item>
        </Menu>
      )
    }else{
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/Documents")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
            <Menu.Item color="blue" name='exports' onClick={()=>{this.props.history.push("/administration/exports")}}><Icon name='file excel outline'/>Exports</Menu.Item>
            <Menu.Item color="blue" name='patchnotes' onClick={()=>{this.props.history.push("/administration/patchnotes")}}><Icon name='clipboard list'/>Notes de version</Menu.Item>
            <Menu.Item color="blue" name='documents' active onClick={()=>{this.props.history.push("/administration/documents")}}><Icon name='file outline'/>Documents S3</Menu.Item>
        </Menu>
      )
    }
  }

  loadDocuments = () => {
    this.props.client.query({
      query: this.state.documentsQuery,
      fetchPolicy:"network-only"
    }).then(({data}) => {
      this.setState({
        documentsRaw:data.documents
      })
    })
  }

  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto"}}>
        <div style={{display:"grid",marginBottom:"0",gridTemplateColumns:"auto 1fr", gridGap:"32px"}}>
          {this.getMenu()}
          <Input name="documentsFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un document ...' />
        </div>
        <div style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
          <Table compact selectable striped color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Nom original du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Format</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Taille du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Date de stockage</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.documents()}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Documents));
