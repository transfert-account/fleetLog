import React, { Component } from 'react';
import { Input, Table } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
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
          <AdministrationMenu active="documents"/>
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
