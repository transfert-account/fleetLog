import React, { Component } from 'react';
import { Input, Table } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import StoredObjectRow from '../molecules/StoredObjectRow';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import 'moment/locale/fr';

export class Storage extends Component {

  state = {
    storedObjectsFilter:"",
    storedObjectsQuery:gql`
      query storedObjects{
        storedObjects{
          name
          doc{
            _id
            name
            size
            path
            originalFilename
            ext
            type
            mimetype
            storageDate
          }
        }
      }
    `,
    storedObjectsRaw:[],
    storedObjects : () => {
      let displayed = Array.from(this.state.storedObjectsRaw);
      displayed = displayed.filter(d=>d.name.toLowerCase().includes(this.state.storedObjectsFilter.toLowerCase()));
      return displayed.map(so=>(
        <StoredObjectRow key={so.name} so={so}/>
      ))
    }
  }

  handleFilter = e => {
    this.setState({
      storedObjectsFilter : e.target.value
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.loadStoredObjects();
  }

  loadStoredObjects = () => {
    this.props.client.query({
      query: this.state.storedObjectsQuery,
      fetchPolicy:"network-only"
    }).then(({data}) => {
      this.setState({
        storedObjectsRaw:data.storedObjects
      })
    })
  }

  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto"}}>
        <div style={{display:"grid",marginBottom:"0",gridTemplateColumns:"auto 1fr", gridGap:"32px"}}>
          <AdministrationMenu active="storage"/>
          <Input name="storageFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un objet ...' />
        </div>
        <div style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
          <Table compact selectable striped color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Nom de l'objet</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Nom original du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Format</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Taille du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Date de stockage</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.storedObjects()}
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

export default wrappedInUserContext = withUserContext(withRouter(Storage));
