import React, { Component, Fragment } from 'react';
import { Button, Label, Segment, Icon, Popup, Loader } from 'semantic-ui-react';
import { TextareaControlled } from '../atoms/TextareaControlled';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

export class AccidentTabularCirconstances extends Component {

  state={
    checking:true,
    needToReset:false,
    currentQIndex:0,
    currentAnswer:"",
    questions:[
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
      {q:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
    ],
    answers:this.props.answers,
    saveAnswersQuery:gql`
      mutation saveAnswers($_id:String!,$answers:String){
        saveAnswers(_id: $_id,answers: $answers){
          status
          message
        }
      }
    `
  }
  /*SHOW AND HIDE MODALS*/
  /*CHANGE HANDLERS*/
  setCurrent = i => {
    if(i == this.state.questions.length){
      this.setState({end:true})
    }
    if(i < this.state.questions.length && i>=0){
      this.setState({
        currentQIndex : i,
        needToReset:true,
        end:false
      })
    }
    setTimeout(this.reset,150)
  }
  reset = () => {
    this.setState({needToReset:false})
  }
  prev = () => {
    this.setCurrent(this.state.currentQIndex - 1);
  }
  next = () => {
    this.setCurrent(this.state.currentQIndex + 1);
  }
  cancel = () => {
    let as = this.state.answers;
    as[this.state.currentQIndex].status = "virgin"
    this.setState({answers:as});
  }
  validate = i => {
    let as = this.state.answers;
    as[this.state.currentQIndex].status = "validated"
    this.setState({answers:as})
    this.saveAnswers();
  }
  handleEditAnswer = value => {
    let as = this.state.answers;
    as[this.state.currentQIndex].body = value
    as[this.state.currentQIndex].status = "virgin"
    this.setState({answers:as,currentAnswer:value});
    this.saveAnswers();
  };
  /*FILTERS HANDLERS*/
  /*DB READ AND WRITE*/
  checkAnswers = () => {
    if(this.state.answers.length != this.state.questions.length){
      if(this.state.answers.length < this.state.questions.length){
        let answers = this.state.answers;
        for (let i = this.state.answers.length; i != this.state.questions.length ; i++) {
          answers.push({body:"",status:"virgin"})
        }
        this.setState({answers:answers,checking:false})
      }else{
        let answers = this.state.answers;
        answers = answers.slice(0, this.state.questions.length);
        this.setState({answers:answers,checking:false})
      }
    }else{
      this.setState({checking:false})
    }
  }
  saveAnswers = _.debounce(()=>{
    this.props.client.mutate({
      mutation : this.state.saveAnswersQuery,
      variables:{
        _id:this.props.accident._id,
        answers:JSON.stringify(this.state.answers)
      }
    }).then(({data})=>{
        data.saveAnswers.map(qrm=>{
            if(qrm.status){
                this.props.toast({message:qrm.message,type:"success"});
            }else{
              this.props.toast({message:qrm.message,type:"error"});
            }
        })
    })
  },1500);
  /*CONTENT GETTERS*/
  getProgressSegment = () => {
    if(this.state.checking){
      this.checkAnswers()
      return (
        <div style={{display:"flex",placeSelf:"center",justifyContent:"space-between",backgroundColor:"#eee",borderRadius:"4px",padding:"8px"}}>
          <Label style={{margin:"8px",cursor:"pointer"}} color="grey">1</Label>
          <Label style={{margin:"8px",cursor:"pointer"}} color="grey">2</Label>
          <Label style={{margin:"8px",cursor:"pointer"}} color="grey">...</Label>
          <Label style={{margin:"8px",cursor:"pointer"}} color="grey">Fin</Label>
        </div>
      )
    }else{
      return (
        <div style={{display:"flex",placeSelf:"center",justifyContent:"space-between",backgroundColor:"#eee",borderRadius:"4px",padding:"8px"}}>
          {this.state.questions.map((q,i)=>{
            return this.getLabel(q,i)
          })}
          <Label style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(this.state.questions.length)}} color={(this.state.end ? "green" : "grey")}>Fin</Label>
        </div>
      )
    }
  }
  getLabel = (q,i) => {
    if(i == this.state.currentQIndex && !this.state.end){
      return (
        <Label key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="blue">
          <Icon style={{margin:"0"}} name='edit'/>
          <Label.Detail>{i+1}</Label.Detail>
        </Label>
      )
    }
    if(this.state.answers[i].status == "validated"){
      return (
        <Label key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="green">
          <Icon style={{margin:"0"}} name='check'/>
          <Label.Detail>{i+1}</Label.Detail>
        </Label>
      )
    }
    return (
      <Label key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="grey">
        {i+1}
      </Label>
    )
  }
  getQuestionLabel = () => {
    if(this.state.answers[this.state.currentQIndex].status == "validated"){
      return <Label style={{placeSelf:"center",minWidth:"240px"}} color="green">Cette réponse est validée</Label>
    }else{
      return <Label style={{placeSelf:"center",minWidth:"240px"}} color="grey">Cette réponse n'est pas validée</Label>
    }
  }
  getQuestionnaryBody = () => {
    if(!this.state.end){
      return (
        <Fragment>
          <h1>Question {this.state.currentQIndex+1 + ") " + this.state.questions[this.state.currentQIndex].q}</h1>
          <TextareaControlled defaultValue={this.state.answers[this.state.currentQIndex].body} needToReset={this.state.needToReset} name="currentAnswer" className="textarea" style={{border:"2px solid #d9d9d9",margin:"0"}} onChange={this.handleEditAnswer}/>
          {this.getQuestionLabel()}
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto 1fr auto",gridRowStart:"5",gridGap:""}}>
            <Button color="blue" icon="arrow left" labelPosition="left" size="large" onClick={this.prev} style={{gridColumnStart:"1"}} content="Question précedente" />
            <Popup trigger={<Button color="red" icon="cancel" size="large" onClick={this.cancel} style={{gridColumnStart:"3"}}/>}>Annuler la validation de cette réponse</Popup>
            <Popup trigger={<Button color="green" icon="check" size="large" onClick={this.validate} style={{gridColumnStart:"4"}}/>}>Valider cette réponse</Popup>
            <Button color="blue" icon="arrow right" labelPosition="right" size="large" onClick={this.next} style={{gridColumnStart:"6"}} content="Question suivante" />
          </div>
        </Fragment>
      )
    }else{
      return (
        <Fragment>
          <h1>Fin du questionnaire</h1>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",gridRowStart:"4",gridGap:""}}>
            <Button icon="arrow left" color="blue" labelPosition="left" size="large" onClick={()=>this.setCurrent(0)} style={{gridColumnStart:"1"}} content="Relire le questionnaire"/>
            <Button icon="download" color="blue" labelPosition="right" size="large" disabled={this.state.answers.some(a => a.status != "validated")} onClick={this.download} style={{gridColumnStart:"3"}} content="Télécharger pour signature"/>
            <Button icon="upload" color="blue" labelPosition="right" size="large" disabled={this.state.answers.some(a => a.status != "validated")} onClick={this.updload} style={{gridColumnStart:"4"}} content="Stockage document signé"/>
          </div>
        </Fragment>
      )
    }
  }
  /*COMPONENTS LIFECYCLE*/

  componentDidMount = () => {
    this.checkAnswers()
  }

  render() {
    if(this.props.loading){
      return(
        <Segment attached="bottom" style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr",gridTemplateRows:"1fr",placeSelf:"stretch",gridColumnEnd:"span 2",gridGap:"24px",padding:"32px"}}>
          <Loader size='massive' active>Chargement du questionnaire</Loader>
        </Segment>
      )
    }else{
      return (
        <Segment attached="bottom" style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr",gridTemplateRows:"auto auto 1fr auto auto",placeSelf:"stretch",gridColumnEnd:"span 2",gridGap:"24px",padding:"32px"}}>
          {this.getProgressSegment()}
          {this.getQuestionnaryBody()}
        </Segment>
      )
    }
  }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(AccidentTabularCirconstances);