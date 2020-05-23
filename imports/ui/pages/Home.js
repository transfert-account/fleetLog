import React, { Component, Fragment } from 'react'
import { Button, Input, Icon, Modal, Form, Message } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import SocietePicker from '../atoms/SocietePicker';

export class Home extends Component {

  state={
    email:"",
    pass:"",
    open:false,
    firstname:"",
    lastname:"",
    societe:"",
    password:"",
    passwordAgain:"",
    error:false,
    errorContent:"",
    mail:""
  }

  setSite =  (e, { value })  => {
    this.props.setSite(value);
  }

  handleChange = e => {
    this.setState({
        [e.target.name] : e.target.value
    })
  }

  handleChangeSociete = (e, { value }) => this.setState({ societe:value })

  showRegister = () => {
    this.setState({
        registering:true
    })
  }

  closeRegister = () => {
    this.setState({
      registering:false
    })
  }

  createAccount = error => {
    Accounts.createUser({
      email: this.state.mail,
      password: this.state.password,
      profile: {
          firstname: this.state.firstname,
          lastname: this.state.lastname
      },
      settings:{
        isAdmin:false,
        isOwner:false,
        visibility:this.state.societe
      }
    },
    error=>{
        if(!error){
          this.props.client.resetStore();
          Meteor.loginWithPassword(this.state.mail, this.state.password,
            error=>{
              if(!error){
                this.props.client.cache.reset();
                this.props.reloadUser()
              }else{
                this.props.toast({
                  message: error.reason,
                  type: "error"
                });
              }
            }
          );
        }else{
          this.props.toast({
            message: error.reason,
            type: "error"
          });
        }
    })
  }

  loginUser = e => {
    e.preventDefault();
    Meteor.loginWithPassword(this.state.email, this.state.pass,
      error=>{
        if(!error){
          this.props.client.cache.reset();
          this.props.reloadUser()
        }else{
          this.props.toast({
            message: error.reason,
            type: "error"
          });
        }
      }
    );
  }

  getModalLabel = ({error,errorContent}) => {
    if(error){
      return(
      <Modal.Actions style={{display:"flex",justifyContent:"space-between"}}>
        <Message style={{margin:"0"}} color="blue" content={errorContent}/>
        <Button disabled color="grey" size="small" style={{margin:"0 16px",cursor:"pointer"}} content='Créer' icon='plus' labelPosition='right'/>
      </Modal.Actions>
      )
    }else{
      return(
        <Modal.Actions>
          <Button color="blue" size="small" style={{margin:"0 16px",cursor:"pointer"}} onClick={()=>{this.createAccount(error);this.close();}} content='Créer' icon='plus' labelPosition='right'/>
        </Modal.Actions>
      )
    }
  }

  getModalActions = error => {
    if(error){
      return(
        <Fragment>
          <Button disabled={false} size="big" icon='cancel' onClick={this.closeRegister}>Annuler</Button>
          <Button disabled={true} size="big" icon='check'>Créer</Button>
        </Fragment>
      )
    }else{
      return(
        <Fragment>
          <Button disabled={false} size="big" icon='cancel' onClick={this.closeRegister}>Annuler</Button>
          <Button disabled={false} size="big" icon='check' onClick={this.createAccount}>Créer</Button>
        </Fragment>
      )
    }   
  }
  
  render() {
    const { newFirstname,newLastname,newPassword,newPasswordAgain,newMail} = this.state;
    let error = false;
    let errorContent = "";
    if(newPassword != newPasswordAgain){
      error = true;
      errorContent = "Les mots de passe sont differents";
    }
    if(newFirstname == "" || newLastname == "" || newPassword == "" || newPasswordAgain == "" || newMail == ""){
      error = true;
      errorContent = "Tous les champs doivent être renseignés";
    }
    if(!this.state.registering){
      return (
        <div className="home-top-container">
          <div style={{padding:"128px 32px",display:"grid",gridColumnStart:"1",backgroundColor:'rgba(0,0,0,0.65)',gridGap:"16px",gridTemplateColumns:"16px 1fr 16px",gridTemplateRows:"1fr auto"}}>
            <div style={{gridColumnStart:"2",placeSelf:"center"}}>
              <h1>WG</h1>
              <h1>LOGISTIQUE</h1>
            </div>
            <form style={{gridRowStart:"2",gridColumnStart:"2",display:"grid",gridGap:"16px",gridTemplateRows:"1fr 1fr",alignSelf:"center"}}>
              <Input onChange={this.handleChange} name="email" type="email" style={{gridColumnEnd:"span 2",justifySelf:"stretch",alignSelf:"center"}} icon="user" size='huge' placeholder='Adresse mail' />
              <Input onChange={this.handleChange} name="pass" type="password" style={{gridColumnEnd:"span 2",justifySelf:"stretch",alignSelf:"center"}} icon="key" size='huge' placeholder='Mot de passe' />
              <Button size="small" type="submit" style={{gridRowStart:"3",gridColumnStart:"1",justifySelf:"stretch",alignSelf:"center",fontSize:"1.2em",cursor:"pointer"}} onClick={e=>{this.loginUser(e)}} animated='fade'>
                <Button.Content visible>Connexion</Button.Content>
                <Button.Content hidden><Icon name='arrow right'/></Button.Content>
              </Button>
              <Button size="small" style={{gridRowStart:"3",gridColumnStart:"2",alignSelf:"center",fontSize:"1.2em",justifyContent:"stretch",cursor:"pointer"}} onClick={this.showRegister} animated="fade">
                <Button.Content visible>Créer un compte</Button.Content>
                <Button.Content hidden><Icon name='edit outline'/></Button.Content>
              </Button>
            </form>
          </div>
        </div>
      )
    }else{
      return(
        <div className="home-top-container">
          <div style={{padding:"128px 32px",display:"grid",gridColumnStart:"1",backgroundColor:'rgba(0,0,0,0.65)',gridGap:"16px",gridTemplateColumns:"16px 1fr 16px",gridTemplateRows:"1fr auto"}}>
            <div style={{gridColumnStart:"2",placeSelf:"center"}}>
              <h1>WG</h1>
              <h1>LOGISTIQUE</h1>
            </div>
            <Form style={{gridRowStart:"2",gridColumnStart:"2",display:"grid",gridGap:"8px",gridTemplateColumns:"1fr 1fr",alignSelf:"center"}}>
              <Form.Field style={{gridColumnEnd:"span 2"}}><label>Société</label><SocietePicker groupAppears={false} onChange={this.handleChangeSociete}/></Form.Field>
              <Form.Field style={{justifySelf:"stretch",alignSelf:"center"}}><label>Prénom</label><input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="new-password" icon='user' label='Prénom' placeholder='Prénom' name="firstname" onChange={this.handleChange}/></Form.Field>
              <Form.Field style={{justifySelf:"stretch",alignSelf:"center"}}><label>Nom</label><input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="new-password" icon='user outline' label='Nom' placeholder='Nom' name="lastname" onChange={this.handleChange}/></Form.Field>
              <Form.Field style={{gridColumnEnd:"span 2",justifySelf:"stretch",alignSelf:"center"}}><label>Adresse mail</label><input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="new-password" icon='mail' label='Mail' placeholder='Mail' name="mail" onChange={this.handleChange}/></Form.Field>
              <Form.Field style={{justifySelf:"stretch",alignSelf:"center"}}><label>Mot de passe</label><input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="new-password" icon='key' type="password" label='Mot de passe' placeholder='Mot de passe' name="password" onChange={this.handleChange}/></Form.Field>
              <Form.Field style={{justifySelf:"stretch",alignSelf:"center"}}><label>Confirmation du mot de passe</label><input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="new-password" icon='key' type="password" label='Confirmez le mot de passe' placeholder='Confirmez le mot de passe' name="passwordAgain" onChange={this.handleChange}/></Form.Field>
              {this.getModalActions(error)}
            </Form>
          </div>
        </div>
      )
    }
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Home);