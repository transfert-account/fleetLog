import React, { Component, Fragment } from 'react';
import { Button, Label, Segment, Icon, Popup, Loader, Progress } from 'semantic-ui-react';
import { TextareaControlled } from '../atoms/TextareaControlled';
import { UserContext } from '../../contexts/UserContext';
import QuestionsPanel from './QuestionsPanel';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import _ from 'lodash';

export class AccidentTabularCirconstances extends Component {

  state={
    pdfGenerated:false,
    pdf:null,
    saveOn:null,
    end:(this.props.answers.some(a => a.status != "validated") ? false : true),
    checking:true,
    needToReset:false,
    currentQIndex:0,
    currentAnswer:"",
    saveTriggered:false,
    savePercent:100,
    questions:[
      {
        page:1,
        title:"Informations concernant l'entretien",
        fields:[
          {
            index:1,
            label:"Date de l'entretien",
            expected:"date",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Entretien réalisé par",
            expected:"string",
            status:"virgin",
            answer:""
          }
        ]
      },{
        page:2,
        title:"Informations concernant le salarié conducteur",
        fields:[
          {
            index:1,
            label:"Nom du salarié",
            expected:"string",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Prénom du salarié",
            expected:"string",
            status:"virgin",
            answer:""
          },{
            index:3,
            label:"Date d'obtention du permis de conduire",
            expected:"date",
            status:"virgin",
            answer:""
          },{
            index:4,
            label:"Date d'entrée dans l'entreprise",
            expected:"date",
            status:"virgin",
            answer:""
          }
        ]
      },{
        page:3,
        title:"Informations concernant l'accident",
        fields:[
          {
            index:1,
            label:"Date de l'accident",
            expected:"date",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Heure de l'accident",
            expected:"time",
            status:"virgin",
            answer:""
          },{
            index:3,
            label:"Véhicule de l'entreprise impliqué",
            expected:"registration",
            status:"validated",
            answer:"",
            autoDisabled:true
          }
        ]
      },{
        page:4,
        title:"Implication",
        fields:[
          {
            index:1,
            label:"Implication d'un tier",
            expected:"boolean",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Constat envoyé à l'assurance",
            expected:"constat",
            status:"virgin",
            answer:""
          },{
            index:3,
            label:"Dégats corporel au salarié",
            expected:"boolean",
            status:"virgin",
            answer:""
          },{
            index:4,
            label:"Dégats corporel au tier",
            expected:"boolean",
            status:"virgin",
            answer:""
          }
        ]
      },{
        page:5,
        title:"Circonstances générales",
        fields:[
          {
            index:1,
            label:"Météo",
            expected:"accWeather",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Lieu",
            expected:"accPlace",
            status:"virgin",
            answer:""
          },{
            index:3,
            label:"État de la chaussée",
            expected:"accTrackState",
            status:"virgin",
            answer:""
          },{
            index:4,
            label:"Profil de la route",
            expected:"accRoadProfile",
            status:"virgin",
            answer:""
          }
        ]
      },{
        page:6,
        title:"Circonstances préçises",
        fields:[
          {
            index:1,
            label:"Caractéristiques de l'accident",
            expected:"accCharacteristic",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Note du salarié",
            expected:"text",
            status:"virgin",
            answer:""
          }
        ]
      },{
        page:7,
        title:"Dégats",
        fields:[
          {
            index:1,
            label:"Visite du véhicule lors de l'entretien",
            expected:"boolean",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Coût approximatif des réparations du véhicule de l'entreprise",
            expected:"float",
            status:"virgin",
            answer:""
          },{
            index:3,
            label:"Coût approximatif des réparations du véhicule du tier",
            expected:"float",
            status:"virgin",
            answer:""
          }
        ]
      },{
        page:8,
        title:"Questions au conducteur",
        fields:[
          {
            index:1,
            label:"Comment l'accident aurait-il pu être évité ?",
            expected:"text",
            status:"virgin",
            answer:""
          },{
            index:2,
            label:"Besoin d'une formation",
            expected:"boolean",
            status:"virgin",
            answer:""
          }
        ]
      }
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
    if(!this.state.saveTriggered){
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
  cancel = (page,index) => {
    let qs = this.state.questions;
    qs[page].fields[index].status = "virgin"
    this.setState({questions:qs});
    this.saveAnswers();
  }
  validate = (page,index) => {
    let qs = this.state.questions;
    qs[page].fields[index].status = "validated"
    this.setState({questions:qs});
    this.saveAnswers();
  }
  handleEditAnswer = (page,index,value) => {
    let qs = this.state.questions;
    qs[page].fields[index].answer = value
    this.setState({questions:qs});
    this.tiggerSaveAnswers();
  };
  /*FILTERS HANDLERS*/
  /*PDF HANDLING*/
  getHeader = () => {
    return {
      text: [
        "Rapport d'entretien du " + this.getAnswer(1,1) + " des suites d'un accident \n",
        "Accident du " + this.getAnswer(3,1) + " impliquant le véhicule " + this.getAnswer(3,3) + " \n"
        ],
      style: 'header',
      margin: [0,0,16,32]
    }
  }
  getBody = () => {
    let questions = [];
    for (let i=0;i<this.state.questions.length;i++) {
      const qn = this.state.questions[i];
      let tbody = [];
      questions.push({text: qn.page + ") " + qn.title,style:"title"})
      qn.fields.forEach(f => {
        tbody.push([{
          text: qn.page + "." + f.index + ") " + f.label,
          style: 'question'
        },{
          text: (f.expected == "float" ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(f.answer) : f.answer),
          style: 'answer'
        }])
      });
      questions.push({style:"table",pageBreak:(qn.page == 5 ? 'after':""),table: {dontBreakRows: true,widths: [200, '*'], body: tbody}});
    }
    return questions
  }
  getFooter = () => {
    return {
      margin: [0,32,0,0],
      columns:[
        {
          text: "Signature de l'employeur :\n",
          style: 'footer',
          bold: true
        },{
          text: "Signature de l'employé :\n",
          style: 'footer',
          bold: true
        }
      ] 
    }
  }
  generate = () => {
    let docDef = {
      content: [
        this.getHeader(),
        this.getBody(),
        this.getFooter()
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: 'center',
          fontWeight:"bold",
          border:"1px solid black",
          backgroundColor:"#ddd"
        },
        title: {
          fontSize: 13,
          bold: true,
          alignment: 'justify'
        },
        question: {
          fontSize: 10,
          bold: true,
          margin:4,
          alignment: 'justify'
        },
        answer: {
          fontSize: 10,
          bold: false,
          margin:4,
          alignment: 'justify'
        },
        table:{
          margin:[16,8,16,24]
        },
        footer: {
          fontSize: 10,
          bold: false,
          alignment: 'justify'
        }
      }
    }
    pdfMake.createPdf(docDef).open()
  }
  /*DB READ AND WRITE*/
  checkAnswers = () => {
    if(this.state.checking){
      let qs = this.state.questions;
      this.props.answers.forEach((q,i)=>{
        qs[i].page = q.page;
        q.fields.forEach((f,j)=>{
          qs[i].fields[j].index = f.index;
          qs[i].fields[j].status = f.status;
          if(qs[i].fields[j].expected == "registration"){
            qs[i].fields[j].answer = this.props.accident.vehicle.registration;
          }else{
            qs[i].fields[j].answer = f.answer;
          }
        });
      })
      this.setState({questions:qs,checking:false})
    }else{
      this.setState({checking:false})
    }
  }
  tiggerSaveAnswers = () => {
    this.setState({
      saveTriggered:true,
      saveOn:moment().add(3000,"ms")
    })
    this.countdown(moment().add(3000,"ms"));
    this.saveAnswersDebounced();
  }
  countdown = saveOn => {
    if(this.state.saveOn == null){
      this.setState({saveOn:saveOn})
    }else{
      saveOn = this.state.saveOn
    }
    let diff = moment(saveOn).diff(moment())
    if(diff>0){
      this.setState({savePercent:(diff/3000)*100})
      setTimeout(this.countdown,50);
    }else{
      this.setState({
        savePercent:100,
        saveTriggered:false,
        saveOn:null
      })
    }
  }
  saveAnswersDebounced = _.debounce(()=>this.saveAnswers,3000);
  saveAnswers = () => {
    let answers = [];
    this.state.questions.forEach(q=>{
      let fields = []
      q.fields.forEach(f=>{
        fields.push({
          index:f.index,
          status:f.status,
          answer:f.answer
        })
      });
      answers.push({
        page : q.page,
        fields : fields
      });
    })
    this.props.client.mutate({
      mutation : this.state.saveAnswersQuery,
      variables:{
        _id:this.props.accident._id,
        answers:JSON.stringify(answers)
      }
    }).then(({data})=>{
        data.saveAnswers.map(qrm=>{
            if(qrm.status){
              this.setState({answers:answers});
              this.props.toast({message:qrm.message,type:"success"});
            }else{
              this.props.toast({message:qrm.message,type:"error"});
            }
        })
    })
  }
  /*CONTENT GETTERS*/
  getAnswersOverview = () => {
    return(
      <div style={{display:"grid",padding:"32px",gridColumnStart:"2",gridTemplateColumns:"repeat(8,auto)",gridTemplateRows:"repeat(4,auto)",backgroundColor:"#eee"}}>
        {this.state.questions.map(q=>{
          return (
            q.fields.map(f=>{
              return (
                <Label image onClick={()=>this.setCurrent(q.page-1)} color={(f.status == "validated" ? "green" : "grey")} style={{cursor:"pointer",margin:"12px",gridColumnStart:q.page+1,gridRowStart:f.index+1}}>
                  <Icon style={{margin:"0"}} name={(f.status == "validated" ? "check" : "cancel")}/>
                  <Label.Detail>{q.page+"."+f.index}</Label.Detail>
                </Label>
              )
            })
          )
        })}
      </div>
    )
  }
  getAnswer = (page,index) => {
    return this.state.questions.filter(q=>q.page == page)[0].fields.filter(f=>f.index == index)[0].answer
  }
  getProgressSegment = () => {
    if(this.state.checking){
      this.checkAnswers()
      return (
        <div style={{display:"flex",placeSelf:"center",justifyContent:"space-between",backgroundColor:"#eee",borderRadius:"4px",padding:"8px"}}>
          <Label image style={{margin:"8px",cursor:"pointer"}} color="grey">1</Label>
          <Label image style={{margin:"8px",cursor:"pointer"}} color="grey">2</Label>
          <Label image style={{margin:"8px",cursor:"pointer"}} color="grey">...</Label>
          <Label image style={{margin:"8px",cursor:"pointer"}} color="grey">Fin</Label>
        </div>
      )
    }else{
      return (
        <div style={{display:"flex",placeSelf:"center",justifyContent:"space-between",backgroundColor:"#eee",borderRadius:"4px",padding:"8px"}}>
          {this.state.questions.map((q,i)=>{
            return this.getLabel(q,i)
          })}
          <Label style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(this.state.questions.length)}} color={this.getEndColor()}>{this.getEndLabel()}</Label>
        </div>
      )
    }
  }
  getEndColor = () => {
    if(this.state.end){
      return "blue"
    }else{
      if(this.state.answers.some(a => a.status != "validated")){
        return "grey";
      }else{
        return "green"
      }
    }
  }
  getEndLabel = () => {
    if(this.state.answers.some(a => a.status != "validated")){
      return "Fin";
    }else{
      if(this.props.accident.questions._id != ""){
        return "PDF en ligne"
      }
      if(this.state.pdfGenerated){
        return "PDF prêt pour impression"
      }else{
        return "Génération PDF possible"
      }
    }
  }
  getLabel = (q,i) => {
    if(i == this.state.currentQIndex && !this.state.end){
      if(this.state.questions[i].fields.some(q=>q.status != "validated")){
        return (
          <Label image key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="grey">
            <Icon style={{margin:"0"}} name={this.state.saveTriggered ? "lock":"edit"}/>
            <Label.Detail>{i+1}</Label.Detail>
          </Label>
        )
      }else{
        return (
          <Label image key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="green">
            <Icon style={{margin:"0"}} name={this.state.saveTriggered ? "lock":"edit"}/>
            <Label.Detail>{i+1}</Label.Detail>
          </Label>
        )
      }
    }else{
      if(this.state.questions[i].fields.some(q=>q.status != "validated")){
        if(this.state.saveTriggered){
          return (
            <Label image key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="grey">
              <Icon style={{margin:"0"}} name="lock"/>
              <Label.Detail>{i+1}</Label.Detail>
            </Label>
          )
        }else{
          return(
            <Label image key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="grey">
              <Icon style={{margin:"0"}} name="cancel"/>
              <Label.Detail>{i+1}</Label.Detail>
            </Label>
          )
        }
      }else{
        return (
          <Label image key={"l"+i} style={{margin:"8px",cursor:"pointer"}} onClick={()=>{this.setCurrent(i)}} color="green">
            <Icon style={{margin:"0"}} name={this.state.saveTriggered ? "lock":"check"}/>
            <Label.Detail>{i+1}</Label.Detail>
          </Label>
        )
      }
    }
  }
  getSavingCountdown = () => {
    return <Progress size="small" indicating style={{placeSelf:"center stretch",gridColumnEnd:"span 2",margin:"0 16px"}} percent={this.state.savePercent}/>
  }
  getQuestionnaryBody = () => {
    if(!this.state.end){
      return (
        <Fragment>
          <QuestionsPanel onChange={this.handleEditAnswer} validate={this.validate} cancel={this.cancel} index={this.state.currentQIndex} needToReset={this.state.needToReset} questions={this.state.questions[this.state.currentQIndex]}/>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr auto",gridRowStart:"4",gridGap:""}}>
            <Button color="blue" icon="arrow left" labelPosition="left" size="large" disabled={this.state.saveTriggered} onClick={this.prev} style={{margin:"0",gridColumnStart:"1"}} content="Question précedente" />
            {this.getSavingCountdown()}
            <Button color="blue" icon="arrow right" labelPosition="right" size="large" disabled={this.state.saveTriggered} onClick={this.next} style={{margin:"0",gridColumnStart:"6"}} content="Question suivante" />
          </div>
        </Fragment>
      )
    }else{
      return (
        <Fragment>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gridTemplateRows:"auto auto 1fr"}}>
            <h1 style={{gridColumnEnd:"span 3",placeSelf:"center"}}>Fin du questionnaire</h1>
            {this.getAnswersOverview()}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto",gridRowStart:"3",gridGap:""}}>
            <Button icon="arrow left" color="blue" labelPosition="left" size="large" onClick={()=>this.setCurrent(0)} style={{gridColumnStart:"1"}} content="Relire le questionnaire"/>
            <Button icon="file pdf outline" color="blue" labelPosition="right" size="large" disabled={this.state.questions.some(q=>q.fields.some(f => f.status != "validated"))} onClick={this.generate} style={{gridColumnStart:"3"}} content="Générer le pdf"/>
            <Button icon="upload" color="blue" labelPosition="right" size="large" disabled={this.props.accident.questions._id == ""} onClick={this.updload} style={{gridColumnStart:"5"}} content="Stocker le document signé"/>
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
        <Segment style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr",gridTemplateRows:"auto 1fr auto auto",placeSelf:"stretch",gridColumnEnd:"span 2",gridGap:"24px",padding:"32px"}}>
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