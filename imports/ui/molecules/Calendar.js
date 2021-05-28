import React, { Component } from 'react';
import { Header, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import CalendarTile from "../molecules/CalendarTile";
import moment from "moment";
import gql from 'graphql-tag';


class Calendar extends Component {
  state={
    daysOfTheMonth:[],
    year : parseInt(this.props.match.params.y),
    month : parseInt(this.props.match.params.m),
    selected:null,
    daysName:["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],
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
            vehicle{
              _id
              registration
              brand{
                _id
                name
              }
              model{
                _id
                name
              }
              km
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
            archived
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

  componentDidUpdate = () => {
    if(this.props.needToRefreshMonth == true){
      this.loadMonth({year:this.state.year,month:this.state.month});
    }
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
      this.props.didRefreshMonth()
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
    this.props.selectDate(moment(d+"/"+(m+1)+"/"+y,"DD/MM/YYYY"));
  }

  componentDidMount = () => {
    this.loadMonth({year:this.state.year,month:this.state.month});
  }

  render() {
    return (
      <div style={{...this.props.style,display:"grid",gridTemplateColumns:"1fr auto auto auto 1fr",gridTemplateRows:"auto 1fr",gridGap:"32px",placeSelf:"stretch"}}>
        <Button style={{gridRowStart:"1",gridColumnStart:"2",alignSelf:"center"}} size="small" color="blue" onClick={this.navigateToPrevMonth} icon><Icon name="left arrow"/></Button>
        <Header style={{gridRowStart:"1",gridColumnStart:"3"}} as="h2" textAlign='center'>{this.getMonthName(this.state.month)+" "+this.state.year}</Header>
        <Button style={{gridRowStart:"1",gridColumnStart:"4",alignSelf:"center"}} size="small" color="blue" onClick={this.navigateToNextMonth} icon><Icon name="right arrow"/></Button>
        <div className="calendar-tile-container">
          {this.state.daysName.map(name =>{
            return <div className="calendar-day-label">{name.substring(0,3)}</div>
          })}
          {this.state.daysOfTheMonth.map(day => (
            <CalendarTile key={day.year+"/"+day.month+"/"+day.day+"/"+day.entretiens.length} user={this.props.user} selected={this.dateIsSelected({d:day.day,m:day.month,y:day.year})} day={day} selectDate={this.selectDate} />
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