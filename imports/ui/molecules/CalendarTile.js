import React, { Component, Fragment } from 'react';
import { Label } from 'semantic-ui-react';
import _ from 'lodash';

class CalendarTile extends Component {
  state={
    date:new Date(this.props.day.year,this.props.day.month,this.props.day.day),
    day:this.props.day.day,
    month:this.props.day.month,
    year:this.props.day.year,
    dow:this.props.day.dow,
    today:this.props.day.today,
    entretiens:this.props.day.entretiens,
    selected:this.props.day.today,
  }

  show = () =>{
    this.setState({ open: true })
  }
  close = () => {
    this.setState({ open: false })
  }
  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }
  handleClientSelection = (e,{value}) =>{
    this.setState({
      selectedClient:value
    });
  }
  getMonthName = n => {
    return ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][n];
  }
  selectDay = () => {
    this.props.selectDate(this.state.year,this.state.month,this.state.day);
  }
  getEntretiensPlannedUserAffected = () => {
    if(this.state.entretiens.length != 0){
      return(
        <Label color="green">{this.state.entretiens.filter(e=>e.user._id == this.props.user._id).length}</Label>
      )
    }
  }

  render() {
    
    let className="";
    if(this.state.today == true){
      className+=" today"
    }
    if(this.props.selected == true){
      className+=" selected"
    }
    return (
      <Fragment>
        <div className={"calendar-tile"+className} onClick={()=>{this.selectDay()}} style={{gridColumnStart:this.state.dow}}>
          <div className="date-display-wrap">
            <div className="date-display">
              <p className="day-of-month">{('00'+this.state.day).slice(-2)}</p>
            </div>
          </div>
          {this.getEntretiensPlannedUserAffected()}
        </div>
      </Fragment>
    )
  }
}

export default CalendarTile;