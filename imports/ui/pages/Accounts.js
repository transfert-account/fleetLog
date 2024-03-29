import React, { Component } from 'react';
import { Input, Table } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import { UserContext } from '../../contexts/UserContext';
import AccountRow from '../molecules/AccountRow';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class Accounts extends Component {

  state = {
    allUsersQuery:gql`
      query allUsers{
        allUsers{
          _id
          email
          isAdmin
          isOwner
          verified
          societe{
            _id
            name
            trikey
          }
          firstname
          lastname
          createdAt
          lastLogin
          activated
          visibility
        }
      }
    `,
    setOwnerQuery:gql`mutation setOwner($owner: String!,$_id: String!){
      setOwner(owner: $owner,_id: $_id){
        status
        message
      }
    }`,
    users:[],
    usersFilter: "",
    deleteAccountQuery:gql`mutation deleteAccount($admin: String!,$_id: String!){
      deleteAccount(admin: $admin,_id: $_id){
        status
        message
      }
    }`,
    societesQuery : gql`
      query societes{
          societes{
              _id
              trikey
              name
          }
      }
    `,
    societesRaw:[],
    accounts : () => {
      let displayed = Array.from(this.state.users);
      displayed = displayed.filter(u=>u.email.toLowerCase().includes(this.state.usersFilter.toLowerCase()) || u.firstname.toLowerCase().includes(this.state.usersFilter.toLowerCase()) || u.lastname.toLowerCase().includes(this.state.usersFilter.toLowerCase()));
      return displayed.map(u=>(
        <AccountRow reloadAccounts={this.loadAccounts} deleteAccount={this.deleteAccount} societesRaw={this.state.societesRaw} setOwner={this.setOwner} key={u._id} u={u}/>
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
      data.deleteAccount.map(qrm=>{
        if(qrm.status){
          this.props.toast({message:qrm.message,type:"success"});
          this.loadAccounts();
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }

  loadSocietes = () => {
    this.props.client.query({
        query:this.state.societesQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        let societes = Array.from([{_id:"noidthisisgroupvisibility",name:"Groupe",trikey:"GRP"}]);
        data.societes.map(s=>{
          societes.push(s)
        });
        this.setState({
            societesRaw:societes
        })
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.loadSocietes();
    this.loadAccounts();
  }

  setOwner = _id => {
    this.props.client.mutate({
      mutation : this.state.setOwnerQuery,
      variables:{
        owner:Meteor.userId(),
        _id:_id
      }
    }).then(({data})=>{
      data.setOwner.map(qrm=>{
        if(qrm.status){
          this.props.toast({message:qrm.message,type:"success"});
          this.loadAccounts();
          this.props.forceReloadUser();
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }

  loadAccounts = () => {
    this.props.client.query({
      query: this.state.allUsersQuery,
      fetchPolicy:"network-only"
    }).then(({data}) => {
      this.setState({
        users:data.allUsers
      })
    })
  }

  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto"}}>
        <div style={{display:"flex",marginBottom:"0",justifyContent:"space-between"}}>
          <AdministrationMenu active="comptes"/>
          <Input name="usersFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un compte ...' />
        </div>
        <div style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
          <Table compact selectable striped color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={3}>Nom</Table.HeaderCell>
                <Table.HeaderCell width={3}>Compte créé le</Table.HeaderCell>
                <Table.HeaderCell width={3}>E-mail</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={1}>Admin</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={1}>Compte actif</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={3}>Visibilité</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={2}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.accounts()}
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

export default wrappedInUserContext = withUserContext(Accounts);
