import React, { Component, Fragment } from 'react'
import { Button, Input, Icon, Modal, Form, Message, Image } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import anime from "animejs";

export class Home extends Component {

  state={
    email:"",
    pass:"",
    open:false,
    firstname:"",
    lastname:"",
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

  popModal = () => {
    this.setState({
        open:true
    })
  }

  close = () => {
    this.setState({
        open:false
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
        isOwner:false
      }
    },
    error=>{
        if(!error){
          this.props.client.resetStore();
        }
    });
  }

  loginUser = e => {
    e.preventDefault();
    Meteor.loginWithPassword(this.state.email, this.state.pass,
      error=>{
        if(!error){
          this.props.client.resetStore();
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

  componentDidMount = () => {
    anime({
      targets: '#titleLogo .st0,.st1',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: function(el, i) { return i * 300 },
      direction: 'normal',
      changeComplete: anim => {
        anime({
          targets: '#titleLogo .st0',
          fill: '#1e73be',
          easing: 'linear'
        });
        anime({
          targets: '#titleLogo .st1',
          fill: '#519bdb',
          easing: 'linear'
        });
      }
    });
  }

  render() {
    const { firstname,lastname,password,passwordAgain,mail } = this.state;
    let error = false;
    let errorContent = "";
    if(password != passwordAgain){
      error = true;
      errorContent = "Les mots de passe sont different";
    }
    /*if(!mail.endsWith('@exemple.com')){
      error = true;
      errorContent = "Le format de l'adresse mail n'est pas user@exemple.com";
    }*/
    if(firstname == "" || lastname == "" || password == "" || passwordAgain == "" || mail == ""){
      error = true;
      errorContent = "Tous les champs doivent être renseignés";
    }
    if(this.props.user._id != null){
      return (
        <div style={{display:"grid",marginTop:"40px",gridTemplateColumns:"1fr 250px 512px 250px 1fr",gridTemplateRows:"512px 60px 60px 240px 80px",flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
          <img style={{width:"800px",gridColumnStart:"2",gridColumnEnd:"span 3",placeSelf:"center"}} src={"/res/semanticui.png"} alt="titleLogo"/>
          <p style={{placeSelf:"center",gridColumnStart:"2",gridColumnEnd:"span 3",gridRowStart:"4",}}>
            Optimisé pour Google Chome <Image style={{margin:"0 12px",display:"inline",width:"48px",height:"48px"}} src="/res/chrome.png"/>
            & Mozilla Firefox <Image style={{margin:"0 12px",display:"inline",width:"48px",height:"48px"}} src="/res/firefox.png"/>
          </p>
        </div>
      )
    }else{
      return (
        <div style={{display:"grid",gridTemplateColumns:"1fr 840px 1fr",marginTop:"40px",gridTemplateRows:"32px 1fr 64px",justifyContent:"center",width:"100%"}}>
          <div style={{padding:"16px",display:"grid",gridColumnStart:"2",gridRowStart:"2",backgroundColor:"rgba(0,0,0,.2)",gridTemplateColumns:"16px 1fr 16px",gridTemplateRows:"360px auto 64px"}}>
            <div style={{gridColumnStart:"2",placeSelf:"stretch"}}>
              <svg style={{width:"100%"}} version="1.1" id="titleLogo" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 560 288" space="preserve">
                <g className="firstWord">
                    <path id="101s" className="st0" d="M43.84,138.42c5.25,2.82,13.49,5.5,21.96,5.5c9.1,0,13.92-3.78,13.92-9.54c0-5.38-4.18-8.55-14.67-12.25 c-14.62-5.18-24.17-13.15-24.17-25.95c0-14.94,12.54-26.3,33.15-26.3c9.99,0,17.21,1.98,22.37,4.41l-4.38,15.89 c-3.47-1.66-9.78-4.16-18.29-4.16c-8.63,0-12.75,3.99-12.75,8.47c0,5.57,4.85,8.03,16.22,12.32c15.51,5.8,22.7,13.85,22.7,26.24 c0,14.63-11.2,27.19-35.32,27.19c-9.93,0-19.87-2.7-24.75-5.45L43.84,138.42z"/>
                    <path id="102e" className="st0" d="M172.2,121.8h-32.24v20.84H176v16.23h-55.85V71.24h53.98v16.23h-34.17v18.25h32.24V121.8z"/>
                    <path id="103n" className="st0" d="M196.33,158.87V71.24h23.08l18.19,32.14c5.25,9.18,10.37,20.15,14.32,30.05l0.34-0.04 c-1.22-11.59-1.6-23.37-1.6-36.61V71.24h18.19v87.62h-20.75l-18.78-33.74c-5.23-9.45-10.98-20.68-15.22-30.96l-0.43,0.04 c0.61,11.61,0.86,24.01,0.86,38.32v26.34H196.33z"/>
                    <path id="104g" className="st0" d="M365.95,154.82c-6.14,2.12-17.71,4.92-29.26,4.92c-16.01,0-27.55-4.01-35.62-11.75 c-8.04-7.62-12.44-19.02-12.39-31.9c0.1-29.15,21.34-45.73,50.04-45.73c11.32,0,20.02,2.15,24.36,4.21l-4.14,15.87 c-4.86-2.09-10.75-3.72-20.39-3.72c-16.52,0-29.08,9.28-29.08,28.34c0,18.1,11.42,28.69,27.64,28.69c4.48,0,8.11-0.52,9.69-1.24 v-18.41h-13.55v-15.46h32.69V154.82z"/>
                    <path id="105e" className="st0" d="M440.26,121.8h-32.24v20.84h36.04v16.23H388.2V71.24h53.98v16.23h-34.17v18.25h32.24V121.8z"/>
                    <path id="106s" className="st0" d="M465.03,138.42c5.25,2.82,13.49,5.5,21.96,5.5c9.1,0,13.92-3.78,13.92-9.54c0-5.38-4.18-8.55-14.67-12.25 c-14.62-5.18-24.17-13.15-24.17-25.95c0-14.94,12.54-26.3,33.14-26.3c9.99,0,17.21,1.98,22.38,4.41l-4.38,15.89 c-3.47-1.66-9.78-4.16-18.29-4.16c-8.63,0-12.75,3.99-12.75,8.47c0,5.57,4.85,8.03,16.22,12.32c15.51,5.8,22.7,13.85,22.7,26.24 c0,14.63-11.2,27.19-35.32,27.19c-9.93,0-19.87-2.7-24.75-5.45L465.03,138.42z"/>
                </g>
                <g className="secondWord">
                    <path id="201w" className="st1" d="M167.74,209.67l-6.86-28.98h7.02l2.2,11.93c0.62,3.45,1.22,7.21,1.69,10.14h0.09 c0.46-3.15,1.16-6.62,1.89-10.22l2.48-11.85h6.96l2.32,12.23c0.62,3.38,1.11,6.48,1.53,9.69h0.09c0.45-3.23,1.06-6.59,1.7-10.07 l2.34-11.85h6.66l-7.47,28.98h-7.08l-2.47-12.48c-0.58-2.9-1.03-5.63-1.4-8.92h-0.09c-0.49,3.26-0.96,6.01-1.65,8.94l-2.77,12.46 H167.74z"/>
                    <path id="202point" className="st1" d="M200.64,206.17c0-2.33,1.6-3.98,3.87-3.98c2.27,0,3.82,1.61,3.85,3.98c0,2.3-1.54,3.97-3.87,3.97 C202.22,210.14,200.63,208.48,200.64,206.17z"/>
                    <path id="203g" className="st1" d="M239.78,208.33c-2.03,0.7-5.86,1.63-9.68,1.63c-5.3,0-9.11-1.33-11.78-3.89c-2.66-2.52-4.12-6.29-4.1-10.55 c0.03-9.64,7.06-15.12,16.55-15.12c3.74,0,6.62,0.71,8.06,1.39l-1.37,5.25c-1.61-0.69-3.56-1.23-6.74-1.23 c-5.46,0-9.62,3.07-9.62,9.38c0,5.99,3.78,9.49,9.14,9.49c1.48,0,2.68-0.17,3.21-0.41v-6.09h-4.48v-5.11h10.81V208.33z"/>
                    <path id="204l" className="st1" d="M259.7,180.68h6.55v23.49h11.53v5.49H259.7V180.68z"/>
                    <path id="205o" className="st1" d="M309.59,194.89c0,9.51-5.74,15.25-14.21,15.25c-8.59,0-13.65-6.5-13.65-14.77c0-8.66,5.57-15.16,14.11-15.16 C304.73,180.21,309.59,186.87,309.59,194.89z M288.66,195.25c0,5.68,2.68,9.68,7.05,9.68c4.43,0,6.96-4.19,6.96-9.82 c0-5.22-2.47-9.69-6.98-9.69C291.25,185.42,288.66,189.61,288.66,195.25z"/>
                    <path id="206g" className="st1" d="M341.17,208.33c-2.03,0.7-5.86,1.63-9.68,1.63c-5.3,0-9.11-1.33-11.78-3.89c-2.66-2.52-4.12-6.29-4.1-10.55 c0.03-9.64,7.06-15.12,16.55-15.12c3.74,0,6.62,0.71,8.06,1.39l-1.37,5.25c-1.61-0.69-3.56-1.23-6.74-1.23 c-5.46,0-9.62,3.07-9.62,9.38c0,5.99,3.78,9.49,9.14,9.49c1.48,0,2.68-0.17,3.21-0.41v-6.09h-4.48v-5.11h10.81V208.33z"/>
                    <path id="207i" className="st1" d="M355.9,180.68v28.98h-6.55v-28.98H355.9z"/>
                    <path id="208s" className="st1" d="M364.87,202.9c1.74,0.93,4.46,1.82,7.26,1.82c3.01,0,4.61-1.25,4.61-3.16c0-1.78-1.38-2.83-4.85-4.05 c-4.83-1.71-7.99-4.35-7.99-8.58c0-4.94,4.15-8.7,10.96-8.7c3.3,0,5.69,0.66,7.4,1.46l-1.45,5.26c-1.15-0.55-3.24-1.38-6.05-1.38 c-2.85,0-4.22,1.32-4.22,2.8c0,1.84,1.61,2.65,5.37,4.07c5.13,1.92,7.51,4.58,7.51,8.68c0,4.84-3.71,8.99-11.68,8.99 c-3.28,0-6.57-0.89-8.19-1.8L364.87,202.9z"/>
                    <path id="209t" className="st1" d="M396.53,186.19h-7.82v-5.5h22.31v5.5h-7.93v23.48h-6.55V186.19z"/>
                    <path id="210i" className="st1" d="M424.1,180.68v28.98h-6.55v-28.98H424.1z"/>
                    <path id="211q" className="st1" d="M457.63,214.65c-4.13-1.19-7.57-2.46-11.46-4.06c-0.64-0.27-1.33-0.4-2-0.45 c-6.55-0.42-12.67-5.25-12.67-14.71c0-8.7,5.5-15.22,14.18-15.22c8.84,0,13.69,6.71,13.69,14.62c0,6.58-3.04,11.23-6.85,12.93v0.18 c2.22,0.65,4.71,1.18,6.98,1.64L457.63,214.65z M452.43,195.11c0-5.3-2.48-9.69-6.95-9.69c-4.48,0-7.07,4.36-7.06,9.81 c-0.02,5.51,2.62,9.7,7,9.7C449.88,204.93,452.43,200.78,452.43,195.11z"/>
                    <path id="212u" className="st1" d="M473.25,180.68v16.67c0,5.01,1.92,7.56,5.25,7.56c3.44,0,5.33-2.43,5.33-7.56v-16.67h6.55v16.26 c0,8.94-4.52,13.19-12.11,13.19c-7.32,0-11.58-4.06-11.58-13.27v-16.19H473.25z"/>
                    <path id="213e" className="st1" d="M516.33,197.41h-10.66v6.89h11.92v5.37h-18.47v-28.98h17.85v5.37h-11.3v6.04h10.66V197.41z"/>
                </g>
              </svg>
            </div>
            <form style={{gridRowStart:"2",gridColumnStart:"2",display:"grid",gridGap:"16px",gridTemplateRows:"1fr 1fr 1fr",alignSelf:"center"}} onSubmit={this.loginUser}>
              <Input onChange={this.handleChange} name="email" type="email" style={{justifySelf:"stretch",alignSelf:"center"}} icon="user" size='huge' placeholder='Adresse mail' />
              <Input onChange={this.handleChange} name="pass" type="password" style={{justifySelf:"stretch",alignSelf:"center"}} icon="key" size='huge' placeholder='Mot de passe' />
              <Button basic size="small" type="submit" style={{justifySelf:"stretch",alignSelf:"center",fontSize:"1.2em",cursor:"pointer"}} onClick={e=>{this.loginUser(e)}} color="black" animated='fade'>
                <Button.Content visible>Connexion</Button.Content>
                <Button.Content hidden><Icon name='arrow right'/></Button.Content>
              </Button>
            </form>
            <Button basic size="small" style={{gridRowStart:"3",gridColumnStart:"2",alignSelf:"center",fontSize:"1.2em",justifyContent:"stretch",cursor:"pointer"}} onClick={()=>{this.popModal()}} color="black" animated="fade">
              <Button.Content visible>Créer un compte</Button.Content>
              <Button.Content hidden><Icon name='edit outline'/></Button.Content>
            </Button>
          </div>
          <Modal closeOnDimmerClick={false} size="small" open={this.state.open} onClose={this.close} closeIcon>
            <Modal.Header>
              Créer un compte :
            </Modal.Header>
            <Modal.Content >
              <Form autoComplete="off">
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='user' label='Prénom' placeholder='Prénom' name="firstname" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='user outline' label='Nom' placeholder='Nom' name="lastname" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='mail' label='Mail' placeholder='Mail' name="mail" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='key' type="password" label='Mot de passe' placeholder='Mot de passe' name="password" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='key' type="password" label='Confirmez le mot de passe' placeholder='Confirmez le mot de passe' name="passwordAgain" onChange={this.handleChange}/>
              </Form>
            </Modal.Content>
            {this.getModalLabel({error:error,errorContent:errorContent})}
          </Modal>
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