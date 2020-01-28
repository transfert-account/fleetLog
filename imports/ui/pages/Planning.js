import React, { Component, Fragment } from 'react';
import { Table,Button,Modal,Form,Input,Menu,Segment } from 'semantic-ui-react';
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
  sideTableSelected:true,
  month:parseInt(this.props.match.params.m),
  year:parseInt(this.props.match.params.y),
  selectedDay:new Date().getDate(),
  entretiensOfTheDayQuery : gql`
    query entretiensOfTheDay($date:String!){
      entretiensOfTheDay(date:$date){
        _id
        description
        title
        vehicle{
          _id
          societe{
            _id
            trikey
            name
          }
          registration
          km
          brand
          model
          volume{
            _id
            meterCube
          }
          payload
          color
        }
      }
    }
  `,
  myEntretiensQuery : gql`
    query myEntretiens{
      myEntretiens{
        _id
        description
        title
        occurenceDate
        vehicle{
          _id
          societe{
            _id
            trikey
            name
          }
          registration
          km
          brand
          model
          volume{
            _id
            meterCube
          }
          payload
          color
        }
      }
    }
  `,
  unaffectedEntretiensQuery : gql`
    query unaffectedEntretiens{
      unaffectedEntretiens{
        _id
        description
        title
        vehicle{
          _id
          societe{
            _id
            trikey
            name
          }
          registration
          km
          brand
          model
          volume{
            _id
            meterCube
          }
          payload
          color
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

  loadUnaffectedEntretiens = () => {
    this.props.client.query({
      query:this.state.unaffectedEntretiensQuery,
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        unaffectedEntretiensRaw:data.unaffectedEntretiens
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
    this.props.client.query({
      query:this.state.entretiensOfTheDayQuery,
      variables:{
        date:(date != null ? date : this.state.selectedDate)
      },
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        entretiensOfTheDayRaw:data.entretiensOfTheDay
      })
    })
  }

  showDatePicker = target => {
    this.setState({openDatePicker:true,datePickerTarget:target})
  }

  closeDatePicker = target => {
    this.setState({openDatePicker:false,datePickerTarget:""})
  }

  onSelectDatePicker = date => {
    this.setState({
        [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
    })
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

  triggerAffectToMe = _id => {
    this.setState({
      entretienToAffect:_id
    })
    this.showAffectToMe();
  }

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
          this.loadMyEntretiens();
          this.loadUnaffectedEntretiens();
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }

  navigateToEntretien = _id => {
    this.props.history.push("/entretien/"+_id); 
  }
  
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

  selectDate = date => {
    this.setState({
      selectedDate:date
    })
    this.loadEntretiensOfTheDay(date);
  }
  
  getSideTable = () => {
    if(this.state.activeItem=="selectedDay"){
      return (
        <Segment attached='bottom'>
          <Table color="blue" style={{gridColumnStart:"2",placeSelf:"start stretch"}} striped celled compact="very">
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell width={4}>Véhicule</Table.HeaderCell>
                <Table.HeaderCell width={10}>Entretien</Table.HeaderCell>
                <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.entretiensOfTheDayRaw.map(e=>{
                return (<PlanningRow key={e._id+"unaffected"} active={this.state.activeItem} triggerReleaseEntretien={this.triggerReleaseEntretien} navigateToEntretien={this.navigateToEntretien} entretien={e} />)
              })}
            </Table.Body>
          </Table>
        </Segment>
      )
    }
    if(this.state.activeItem=="affectedToMe"){
      return (
        <Segment attached='bottom'>
          <Table color="green" style={{gridColumnStart:"2",placeSelf:"start stretch"}} striped celled compact="very">
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell width={4}>Véhicule</Table.HeaderCell>
                <Table.HeaderCell width={6}>Entretien</Table.HeaderCell>
                <Table.HeaderCell width={4}>Date</Table.HeaderCell>
                <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.myEntretiensRaw.map(e=>{
                return (<PlanningRow active={this.state.activeItem} triggerReleaseEntretien={this.triggerReleaseEntretien} key={e._id} navigateToEntretien={this.navigateToEntretien} entretien={e} />)
              })}
            </Table.Body>
          </Table>
        </Segment>
      )
    }
    if(this.state.activeItem=="unaffected"){
      return (
        <Segment attached='bottom'>
          <Table color="orange" style={{gridColumnStart:"2",placeSelf:"start stretch"}} striped celled compact="very">
            <Table.Header>
              <Table.Row textAlign='center'>
                <Table.HeaderCell width={4}>Véhicule</Table.HeaderCell>
                <Table.HeaderCell width={10}>Entretien</Table.HeaderCell>
                <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.unaffectedEntretiensRaw.map(e=>{
                return (<PlanningRow active={this.state.activeItem} key={e._id+"unaffected"} triggerAffectToMe={this.triggerAffectToMe} navigateToEntretien={this.navigateToEntretien} entretien={e} />)
              })}
            </Table.Body>
          </Table>
        </Segment>
      )
    }
  }

  componentDidMount = () => {
    this.loadUnaffectedEntretiens();
    this.loadMyEntretiens();
    this.loadEntretiensOfTheDay();
  }

  render() {
    return (
      <Fragment>
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gridTemplateRows:"auto 1fr",gridGap:"32px"}}>
          <Calendar didRefreshMonth={this.didRefreshMonth} needToRefreshMonth={this.state.needToRefreshMonth} style={{gridRowEnd:"span 2"}} selectDate={this.selectDate} month={this.state.month} year={this.state.year}/>
          <div style={{gridRowEnd:"span 2"}}>
          <Menu widths={3} attached='top' tabular>
            <Menu.Item color="blue" name='selectedDay' active={this.state.activeItem === 'selectedDay'} onClick={()=>this.setState({activeItem:"selectedDay"})}>{this.state.selectedDate.format("DD/MM/YYYY")}</Menu.Item>
            <Menu.Item color="green" name='affectedToMe' active={this.state.activeItem === 'affectedToMe'} onClick={()=>this.setState({activeItem:"affectedToMe"})}>Mes entretiens</Menu.Item>
            <Menu.Item color="orange" name='unaffected' active={this.state.activeItem === 'unaffected'} onClick={()=>this.setState({activeItem:"unaffected"})}>Entretiens à affecter</Menu.Item>
          </Menu>
          {this.getSideTable()}
          </div>
        </div>
        <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAffectToMe} onClose={this.closeAffectToMe} closeIcon>
          <Modal.Header>
            A quelle date voulez vous vous affecter l'entretien ?
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
            L'entretien ne vous sera plus affecté et sera de nouveau en attente de prise en charge
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