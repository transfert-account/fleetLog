import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base'
import { Header,Icon,Segment,Message,Button,Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { AvatarPicker } from '../molecules/AvatarPicker';
import { gql } from 'apollo-server-express'

export class Compte extends Component {

  state={
    oldPass:"",
    newPass1:"",
    newPass2:"",
    openAvatar:false,
    avatar:this.props.user.avatar,
    setUserAvatarQuery : gql`
        mutation setUserAvatar($_id:String!,$avatar:String!){
          setUserAvatar(_id:$_id,avatar:$avatar){
                _id
                avatar
            }
        }
    `,
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  applyPassword = () => {
    Accounts.changePassword(this.state.oldPass,this.state.newPass1,err=>{
      if(!err){
        this.props.toast({message:"Mot de passe modifié avec succès",type:"info"});
      }else{
        this.props.toast({message:err.reason,type:"error"});
      }
    });
  }

  getModalLabel = ({error,errorContent}) => {
    if(error){
      return(
        <Message style={{margin:"0",justifySelf:"start"}} color="blue" content={errorContent}/>
      )
    }
  }

  openAvatar = () => {
    this.setState({
      openAvatar:true
    })
  }

  closeAvatar = () => {
    this.setState({
      openAvatar:false
    })
  }

  randomizeAvatar = () => {
    const id = Math.floor(Math.random()*260)+1;
    this.setState({
        avatar: id
    })
    this.saveAvatar(id);
  }

  saveAvatar = id => {
    this.props.client.mutate({
      mutation : this.state.setUserAvatarQuery,
      variables:{
          _id:Meteor.userId(),
          avatar:id.toString().padStart(3,"0")+".png"
      }
    }).then(({data})=>{
      this.setState({
        avatar:data.setUserAvatar.avatar
      });
    })
  }

  render() {
    const { newPass1,newPass2 } = this.state;
    let error = false;
    let errorContent = "";
    if(newPass1.length == 0 || newPass2.length == 0){
      error = true;
      errorContent = "Veuillez renseigner tous les champs";
    }else{
      if(newPass1 != newPass2){
        error = true;
        errorContent = "Les mots de passe sont different";
      }else{
        if(newPass1.length < 6){
          error = true;
          errorContent = "Le mot de passe nécessite 6 caractères minimum";
        }
      }
    }
    return (
      <div style={{display:"grid",gridGap:"16px",gridTemplateColumns:"1fr 75% 1fr"}}>
        <Segment raised style={{display:"grid",gridColumnStart:"2",gridGap:"16px",placeSelf:"stretch",marginTop:"16px",padding:"24px 0",gridTemplateColumns:"1fr 3fr"}}>
          <div style={{display:"grid",borderRight:"6px solid #74b9ff"}}>
            <Header style={{placeSelf:"center"}} as='h3' icon>
              <Icon circular name='user'/>
              Gérer votre profil
            </Header>
          </div>
          <Form style={{display:"grid",gridTemplateColumns:"2fr 3fr",gridTemplateRows:"1fr 1fr",gridGap:"8px",gridColumnGap:"32px",margin:"16px 48px 0 48px"}}>
          
          </Form>
        </Segment>
        <Segment raised style={{display:"grid",gridColumnStart:"2",gridGap:"16px",placeSelf:"stretch",marginTop:"16px",padding:"24px 0",gridTemplateColumns:"1fr 3fr"}}>
          <div style={{display:"grid",borderRight:"6px solid #74b9ff"}}>
            <Header style={{placeSelf:"center"}} as='h3' icon>
              <Icon circular name='user outline'/>
              Modifier votre avatar
            </Header>
          </div>
          <AvatarPicker open={this.state.openAvatar} close={this.closeAvatar} saveAvatar={this.saveAvatar} />
          <Form style={{display:"grid",gridTemplateColumns:"2fr 3fr",gridTemplateRows:"1fr 1fr",gridGap:"8px",gridColumnGap:"32px",margin:"16px 48px 0 48px"}}>
            <img alt="userAvatar" style={{gridColumnStart:"1",gridRowEnd:"span 2",justifySelf:"center",width:"128px"}} src={'/res/avatar/'+this.state.avatar}/>
            <Button onClick={this.openAvatar} style={{justifySelf:"stretch",alignSelf:"center",gridRowStart:"1",gridColumnStart:"2"}} color="blue" size="big" content="Choisir ..." icon='search' labelPosition='right'/>
            <Button onClick={this.randomizeAvatar} style={{justifySelf:"stretch",alignSelf:"center",gridRowStart:"2",gridColumnStart:"2"}} color="black" size="big" content="Aleatoire !" icon='random' labelPosition='right'/>
          </Form>
        </Segment>
        <Segment raised style={{display:"grid",gridColumnStart:"2",gridGap:"16px",placeSelf:"stretch",marginTop:"16px",padding:"24px 0",gridTemplateColumns:"1fr 3fr"}}>
          <div style={{display:"grid",borderRight:"6px solid #74b9ff"}}>
            <Header style={{placeSelf:"center"}} as='h3' icon>
              <Icon circular name='key'/>
              Modifier votre mot de passe
            </Header>
          </div>
          <Form style={{display:"grid",gridTemplateRows:"1fr 1fr 1fr auto",gridColumnGap:"32px",margin:"16px 48px 0 48px"}}>
            <Form.Input type="password" onChange={this.handleChange} autoComplete="off" name="oldPass" label="Ancien mot de passe"/>
            <Form.Input type="password" onChange={this.handleChange} autoComplete="off" name="newPass1" label="Nouveau mot de passe"/>
            <Form.Input type="password" onChange={this.handleChange} autoComplete="off" name="newPass2" label="Confirmez le nouveau mot de passe"/>
            <div style={{paddingTop:"16px",justifySelf:"stretch",display:"grid",gridTemplateColumns:"1fr auto"}}>
              {this.getModalLabel({error:error,errorContent:errorContent})}
              <Button onClick={this.applyPassword} style={{gridColumnStart:"2",width:"160px"}} color="blue" size="big" content="Valider"/>
            </div>
          </Form>
        </Segment>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Compte);