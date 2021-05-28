import React, { Component, Fragment } from 'react';
import { Table, Button, Modal, Form, Input, Menu, Segment, Label } from 'semantic-ui-react';
import PlanningRow from '../molecules/PlanningRow';
import Calendar from '../molecules/Calendar';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import moment from "moment";
import gql from 'graphql-tag';

class Planning extends Component {

  state={
    entretienToAffect:"",
    entretienToRealse:"",
    selectedDate:moment(),
    activeItem:"selectedDay",
    newAffectDate:"",
    needToRefreshMonth:false,
    entretiensOfTheDayRaw:[],
    unaffectedEntretiensRaw:[],
    openAffectToMe:false,
    openRelease:false,
    myEntretiensRaw:[],
    activeItem:"unaffected",
    month:parseInt(this.props.match.params.m),
    year:parseInt(this.props.match.params.y),
    selectedDay:new Date().getDate(),
    unaffectedEntretiens : () => {
      let displayed = Array.from(this.state.unaffectedEntretiensRaw);
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
        displayed = displayed.filter(e =>e.societe._id == this.props.societeFilter)
      }
      return displayed;
    },
    entretiensOfTheDay : () => {
      let displayed = Array.from(this.state.entretiensOfTheDayRaw);
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
        displayed = displayed.filter(e =>e.societe._id == this.props.societeFilter)
      }
      return displayed;
    },
    entretiensOfTheDayQuery : gql`
      query entretiensOfTheDay($date:String!){
        entretiensOfTheDay(date:$date){
          _id
          societe{
            _id
            trikey
            name
          }
          originNature{
            _id
            name
          }
          originControl{
            key
            name
          }
          notes{
            _id
            text
            date
          }
          user{
            _id
            firstname
            lastname
          }
          vehicle{
            _id
            registration
            km
            brand{
              _id
              name
            }
            model{
              _id
              name
            }
            volume{
              _id
              meterCube
            }
            payload
          }
        }
      }
    `,
    myEntretiensQuery : gql`
      query myEntretiens{
        myEntretiens{
          _id
          societe{
            _id
            trikey
            name
          }
          originNature{
            _id
            name
          }
          originControl{
            key
            name
          }
          notes{
            _id
            text
            date
          }
          occurenceDate
          societe{
            _id
            trikey
            name
          }
          vehicle{
            _id
            registration
            km
            brand{
              _id
              name
            }
            model{
              _id
              name
            }
            volume{
              _id
              meterCube
            }
            payload
          }
        }
      }
    `,
    unaffectedEntretiensQuery : gql`
      query unaffectedEntretiens{
        unaffectedEntretiens{
          _id
          societe{
            _id
            trikey
            name
          }
          originNature{
            _id
            name
          }
          originControl{
            key
            name
          }
          notes{
            _id
            text
            date
          }
          vehicle{
            _id
            registration
            km
            brand{
              _id
              name
            }
            model{
              _id
              name
            }
            volume{
              _id
              meterCube
            }
            payload
          }
        }
      }
    `,
    affectToMeQuery : gql`
      mutation affectToMe($_id:String!,$occurenceDate:String!){
        affectToMe(_id:$_id,occurenceDate:$occurenceDate){
          status
          message
        }
      }
    `,
    releaseQuery : gql`
      mutation release($_id:String!){
        release(_id:$_id){
          status
          message
        }
      }
    `
  }
  triggerAffectToMe = _id => {
    this.setState({
      entretienToAffect:_id
    })
    this.showAffectToMe();
  }
  triggerReleaseEntretien = _id => {
    this.setState({
      entretienToRealse:_id
    })
    this.showRelease();
  }
  didRefreshMonth = () => {
    this.setState({
      needToRefreshMonth:false
    })
  }
  navigateToEntretien = _id => {
    this.props.history.push("/entretien/"+_id); 
  }
  /*SHOW AND HIDE MODALS*/
  showRelease = () => {
    this.setState({
      openRelease : true
    })
  }
  closeRelease = () => {
    this.setState({
      openRelease : false
    })
  }
  showDatePicker = target => {
    this.setState({openDatePicker:true,datePickerTarget:target})
  }
  closeDatePicker = target => {
    this.setState({openDatePicker:false,datePickerTarget:""})
  }
  showAffectToMe = () => {
    this.setState({
      openAffectToMe : true
    })
  }
  closeAffectToMe = () => {
    this.setState({
      openAffectToMe : false
    })
  }
  /*CHANGE HANDLERS*/
  selectDate = date => {
    this.setState({
      selectedDate:date
    })
    this.loadEntretiensOfTheDay(date);
  }
  onSelectDatePicker = date => {
    this.setState({
        [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
    })
  }
  /*DB READ AND WRITE*/
  loadMonthByParams = ({year,month}) => {
    this.props.client.query({
      query:this.state.entretiensPopulatedMonthQuery,
      variables:{
        month:month,
        year:year
      },
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        daysOfTheMonth:data.entretiensPopulatedMonth
      })
    })
  }
  affectToMe = () => {
    this.closeAffectToMe();
    this.props.client.mutate({
      mutation:this.state.affectToMeQuery,
      variables:{
        _id:this.state.entretienToAffect,
        occurenceDate:this.state.newAffectDate
      }
    }).then(({data})=>{
      data.affectToMe.map(qrm=>{
        if(qrm.status){
          this.props.toast({message:qrm.message,type:"success"});
          this.setState({
            needToRefreshMonth:true
          })
          this.loadMyEntretiens();
          this.loadUnaffectedEntretiens();
          this.loadEntretiensOfTheDay();
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }
  release = () => {
    this.closeRelease();
    this.props.client.mutate({
      mutation:this.state.releaseQuery,
      variables:{
        _id:this.state.entretienToRealse
      }
    }).then(({data})=>{
      data.release.map(qrm=>{
        if(qrm.status){
          this.props.toast({message:qrm.message,type:"success"});
          this.setState({
            needToRefreshMonth:true
          })
          this.loadEntretiensOfTheDay();
          this.loadMyEntretiens();
          this.loadUnaffectedEntretiens();
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }

  loadUnaffectedEntretiens = () => {
    this.props.client.query({
      query:this.state.unaffectedEntretiensQuery,
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        unaffectedEntretiensRaw: data.unaffectedEntretiens
      })
    })
  }

  loadMyEntretiens = () => {
    this.props.client.query({
      query:this.state.myEntretiensQuery,
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        myEntretiensRaw:data.myEntretiens
      })
    })
  }

  loadEntretiensOfTheDay = (date) => {
    let formatedDate = "";
    this.props.client.query({
      query:this.state.entretiensOfTheDayQuery,
      variables:{
        date: (date != null ? formatedDate = date : formatedDate = this.state.selectedDate).format('DD/MM/YYYY')
      },
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        entretiensOfTheDayRaw:data.entretiensOfTheDay
      })
    })
  }
  /*CONTENT GETTERS*/
  getSideTable = () => {
    if(this.state.activeItem=="selectedDay"){
      return (
        <Table color="blue" celled selectable compact>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell>Affecté à</Table.HeaderCell>
              <Table.HeaderCell>Véhicule</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Entretien</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.entretiensOfTheDay().map(e=>{
              return (<PlanningRow key={e._id+"unaffected"} active={this.state.activeItem} triggerReleaseEntretien={this.triggerReleaseEntretien} navigateToEntretien={this.navigateToEntretien} entretien={e} />)
            })}
          </Table.Body>
        </Table>
      )
    }
    if(this.state.activeItem=="affectedToMe"){
      return (
        <Table color="green" celled selectable compact>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell>Véhicule</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Entretien</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.myEntretiensRaw.map(e=>{
              return (<PlanningRow active={this.state.activeItem} triggerReleaseEntretien={this.triggerReleaseEntretien} key={e._id} navigateToEntretien={this.navigateToEntretien} entretien={e} />)
            })}
          </Table.Body>
        </Table>
      )
    }
    if(this.state.activeItem=="unaffected"){
      return (
        <Table color="orange" celled selectable compact>
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell>Societe</Table.HeaderCell>
              <Table.HeaderCell>Véhicule</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Entretien</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.unaffectedEntretiens().map(e=>{
              return (<PlanningRow active={this.state.activeItem} key={e._id+"unaffected"} triggerAffectToMe={this.triggerAffectToMe} navigateToEntretien={this.navigateToEntretien} entretien={e} />)
            })}
          </Table.Body>
        </Table>
      )
    }
  }
  getSelectedDayLabel = () => {
    let allEntretiensLabel = this.state.entretiensOfTheDay().length;
    return(
      <Fragment>
        {(allEntretiensLabel != 0 ? <Label size="big" color="blue" >{allEntretiensLabel}</Label> : "")}
      </Fragment>
    )
  }
  getMyLabel = () => {
    let myEntretiens = this.state.myEntretiensRaw.length;
    if(myEntretiens != 0){
      return(<Label size="big" color="green" >{myEntretiens}</Label>)
    }else{
      return(<Label size="big" color="grey" >0</Label>)
    }
  }
  getUnaffectedLabel = () => {
    let unaffectedEntretiens = this.state.unaffectedEntretiens().length;
    if(unaffectedEntretiens != 0){
      return(<Label size="big" color="orange" >{unaffectedEntretiens}</Label>)
    }else{
      return(<Label size="big" color="grey" >0</Label>)
    }
  }
  
  /*COMPONENTS LIFECYCLE*/
  componentDidMount = () => {
    this.loadUnaffectedEntretiens();
    this.loadMyEntretiens();
    this.loadEntretiensOfTheDay();
  }
  render() {
    return (
      <Fragment>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto 1fr",gridGap:"32px",height:"100%"}}>
          <Calendar didRefreshMonth={this.didRefreshMonth} needToRefreshMonth={this.state.needToRefreshMonth} selectDate={this.selectDate} month={this.state.month} year={this.state.year}/>
          <Segment style={{gridRowEnd:"span 2",display:"grid",gridGap:"20px",gridTemplateRows:"auto minmax(0,1fr)"}}>
            <Menu size="massive" widths={3} pointing secondary>
              <Menu.Item color="blue" name='selectedDay' active={this.state.activeItem === 'selectedDay'} onClick={()=>this.setState({activeItem:"selectedDay"})}>
                {this.state.selectedDate.format("DD/MM/YYYY")}
                {this.getSelectedDayLabel()}
              </Menu.Item>
              <Menu.Item color="green" name='affectedToMe' active={this.state.activeItem === 'affectedToMe'} onClick={()=>this.setState({activeItem:"affectedToMe"})}>
                Mes entretiens
                {this.getMyLabel()}
              </Menu.Item>
              <Menu.Item color="orange" name='unaffected' active={this.state.activeItem === 'unaffected'} onClick={()=>this.setState({activeItem:"unaffected"})}>
                Entretiens à affecter
                {this.getUnaffectedLabel()}
              </Menu.Item>
            </Menu>
            <div style={{display:"block",overflowY:"scroll"}}>
              {this.getSideTable()}
            </div>
          </Segment>
        </div>
        <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAffectToMe} onClose={this.closeAffectToMe} closeIcon>
          <Modal.Header>
            A quelle date voulez vous affecter l'entretien ?
          </Modal.Header>
          <Modal.Content style={{textAlign:"center"}}>
            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
              <Form.Field style={{placeSelf:"stretch"}}>
                <label>Date de l'entretien</label>
                <Input value={this.state.newAffectDate} onFocus={()=>{this.showDatePicker("newAffectDate")}} name="newAffectDate"/>
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={this.closeAffectToMe}>Annuler</Button>
            <Button color="blue" onClick={this.affectToMe}>Affecter l'entretien</Button>
          </Modal.Actions>
        </Modal>
        <Modal size="mini" closeOnDimmerClick={false} open={this.state.openRelease} onClose={this.closeRelease} closeIcon>
          <Modal.Header>
            Relacher l'entretien ?
          </Modal.Header>
          <Modal.Content style={{textAlign:"center"}}>
            L'entretien ne vous sera plus affecté et sera de nouveau en attente d'affectation
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={this.closeRelease}>Annuler</Button>
            <Button color="red" onClick={this.release}>Relacher l'entretien</Button>
          </Modal.Actions>
        </Modal>
        <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
      </Fragment>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(Planning));