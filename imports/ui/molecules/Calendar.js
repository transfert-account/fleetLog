import React, { Component } from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import CalendarTile from "../molecules/CalendarTile";
import gql from 'graphql-tag';


class Calendar extends Component {
  state={
    daysOfTheMonth:[],
    year : parseInt(this.props.match.params.y),
    month : parseInt(this.props.match.params.m),
    selected:null,
    entretiensPopulatedMonthQuery: gql`
      query entretiensPopulatedMonth($month:Int!,$year:Int!) {
        entretiensPopulatedMonth(month:$month,year:$year){
          day
          month
          year
          dow
          today
          entretiens{
            _id
            piece{
              name
              type
            }
            vehicle{
              registration
              model
              brand
              km
            }
            description
            archived
            occurenceDay
            occurenceMonth
            occurenceYear
            user
          }
        }
      }
    `
  }

  dateIsSelected = ({ d,m,y }) => {
    const date = new Date (y,m,d);
    if(this.state.selected != null){
      if(date.getDate() == this.state.selected.getDate() && date.getMonth() == this.state.selected.getMonth() && date.getFullYear() == this.state.selected.getFullYear()){
        return true
      }else{
        return false
      }
    }else{
      return false;      
    }
  }

  getMonthName = n =>{
    if(n-1 == -1){return "Décembre"}
    if(n-1 == 12){return "Janvier"}
    return ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][n-1];
  }

  navigateToPrevMonth = () => {
    let {year,month} = this.state;
    if(month<=1){
      year=year-1;
      month=12;
    }else{
      month=month-1;
    }
    this.props.history.push("/planning/"+year+"/"+month)
    this.loadMonth({year:year,month:month});
  }

  navigateToNextMonth = () => {
    let {year,month} = this.state;
    if(month>=12){
      year=year+1;
      month=1;
    }else{
      month=month+1;
    }
    this.props.history.push("/planning/"+year+"/"+month)
    this.loadMonth({year:year,month:month});
  }

  loadMonth = ({year,month}) => {
    this.props.client.query({
      query:this.state.entretiensPopulatedMonthQuery,
      variables:{
        month:month,
        year:year
      },
      fetchPolicy:"network-only"
    }).then(({data})=>{
      this.setState({
        daysOfTheMonth:data.entretiensPopulatedMonth,
        year:year,
        month:month
      })
    })
  }

  selectDate = (y,m,d) =>{
    this.setState({
      selected:new Date(y,m,d)
    })
    this.props.loadEntretiensOfTheDay({y:y,m:m,d:d});
  }

  componentDidMount = () => {
    this.loadMonth({year:this.state.year,month:this.state.month});
  }

  render() {
    return (
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto 1fr",gridTemplateRows:"auto 1fr",gridGap:"32px"}}>
        <Button style={{gridRowStart:"1",gridColumnStart:"2",alignSelf:"center"}} size="small" color="blue" onClick={this.navigateToPrevMonth} icon><Icon name="left arrow"/></Button>
        <Header style={{gridRowStart:"1",gridColumnStart:"3"}} as="h2" textAlign='center'>{this.getMonthName(this.state.month)+" "+this.state.year}</Header>
        <Button style={{gridRowStart:"1",gridColumnStart:"4",alignSelf:"center"}} size="small" color="blue" onClick={this.navigateToNextMonth} icon><Icon name="right arrow"/></Button>
        <div style={{gridRowStart:"2",gridColumnStart:"1",gridColumnEnd:"span 5",display:"grid",gridGap:"6px",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr 1fr",gridTemplateRows:"120px 120px 120px 120px 120px 120px"}}>
          {this.state.daysOfTheMonth.map(day => (
            <CalendarTile key={day.year+"/"+day.month+"/"+day.day} selected={this.dateIsSelected({d:day.day,m:day.month,y:day.year})} day={day} selectDate={this.selectDate} />
          ))}
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

export default wrappedInUserContext = withRouter(withUserContext(Calendar));