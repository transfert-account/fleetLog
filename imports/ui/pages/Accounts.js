import React, { Component } from 'react';
import { Input, Table, Menu } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import AccountRow from '../molecules/AccountRow';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class Accounts extends Component {

  state = {
    usersQuery:gql`
      query Users{
        users{
          _id
          email
          isAdmin
          isOwner
          verified
          firstname
          lastname
          createdAt
          lastLogin
          activated
        }
      }
    `,
    setOwnerQuery:gql`mutation setOwner($owner: String!,$_id: String!){
      setOwner(owner: $owner,_id: $_id){
          _id
          isOwner
      }
    }`,
    users:[],
    usersFilter: "",
    deleteAccountQuery:gql`mutation deleteAccount($admin: String!,$_id: String!){
      deleteAccount(admin: $admin,_id: $_id){
        _id
        email
        isAdmin
        isOwner
        verified
        firstname
        lastname
        createdAt
        lastLogin
        activated
      }
    }`,
    accounts : () => {
      let displayed = Array.from(this.state.users);
      displayed = displayed.filter(u=>u.email.toLowerCase().includes(this.state.usersFilter.toLowerCase()) || u.firstname.toLowerCase().includes(this.state.usersFilter.toLowerCase()) || u.lastname.toLowerCase().includes(this.state.usersFilter.toLowerCase()));
      return displayed.map(u=>(
        <AccountRow deleteAccount={this.deleteAccount} setOwner={this.setOwner} key={u._id} u={u}/>
      ))
    }
  }

  handleFilter = e => {
    this.setState({
      usersFilter : e.target.value
    })
  }

  deleteAccount = _id =>{
    this.props.client.mutate({
      mutation : this.state.deleteAccountQuery,
      variables:{
          admin:Meteor.userId(),
          _id:_id
        }
    }).then(({data})=>{
      this.setState({
        users:data.deleteAccount
      });
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.loadAccounts();
  }

  getMenu = () => {
    if(this.props.user.isOwner){
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} vertical>
          <Menu.Item color="blue" name='Comptes' active onClick={()=>{this.props.history.push("/administration/accounts")}} />
        </Menu>
      )
    }else{
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} vertical>
          <Menu.Item color="blue" name='Comptes' active onClick={()=>{this.props.history.push("/administration/accounts")}} />
        </Menu>
      )
    }
  }

  setOwner = _id => {
    this.props.client.mutate({
      mutation : this.state.setOwnerQuery,
      variables:{
        owner:Meteor.userId(),
        _id:_id
      }
    }).then(({data})=>{
      this.loadAccounts();
    })
  }

  loadAccounts = () => {
    this.props.client.query({
      query: this.state.usersQuery
    }).then(({data}) => {
      this.setState({
        users:data.users
      })
    })
  }

  render() {
    return (
      <div>
        <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
          {this.getMenu()}
          <Input name="usersFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un compte ...' />
        </div>
          <Table compact selectable striped color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={4}>Nom</Table.HeaderCell>
                <Table.HeaderCell width={4}>Compte créé le</Table.HeaderCell>
                <Table.HeaderCell width={4}>E-mail</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={1}>Admin</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={1}>Compte actif</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={2}></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.accounts()}
            </Table.Body>
          </Table>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Accounts));
