import React, { Component, Fragment } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { Pagination,Icon,Menu,Input,Dimmer,Loader } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { AvatarPicker } from '../molecules/AvatarPicker';
import { gql } from 'apollo-server-express'

export class Licences extends Component {

  state={
    
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  render() {
    return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 3fr 1fr 1fr"}}>
                <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                    <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                    <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                    <Menu.Item color="blue" name='licences' active onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                    <Menu.Item color="blue" name='rentals' onClick={()=>{this.props.history.push("/parc/rentals")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                </Menu>
                <Input style={{justifySelf:"stretch"}} name="storeFilter" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un item ... (3 caractères minimum)' />
                <Dimmer inverted active={this.state.loading}>
                    <Loader size='massive'>Chargement ...</Loader>
                </Dimmer>
            </div>
            <Pagination style={{placeSelf:"center",gridColumnEnd:"span 4"}} onPageChange={this.handlePaginationChange} defaultActivePage={this.state.currentPage} firstItem={null} lastItem={null} pointing secondary totalPages={this.state.maxPage}/>
        </Fragment>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Licences);