import React, { Component, Fragment } from 'react';
import { Button, Icon, Modal, Dropdown, Label, Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
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

    getDayName = n => {
        return ["","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"][n];
    }

    getMonthName = n =>{
      return ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][n];
    }

    selectDay = () =>{
      this.props.selectDate(this.state.year,this.state.month,this.state.day);
    }

  render() {
    let { dow,day,today,open,month,year,entretiens } = this.state;
    let { selected } = this.props;
    let dayColorCode;
    switch (true) {
      case (entretiens.length < 1):
        dayColorCode = "black";
        break;
      case (entretiens.length < 2):
        dayColorCode = "green";
        break;
      case (entretiens.length < 6):
        dayColorCode = "orange";
        break;
      case (entretiens.length >= 8):
        dayColorCode = "red";
        break;
      default:
        dayColorCode = "black";
        break;
    }
    let headerColor = "linear-gradient(315deg, #000000 0%, #414141 74%)";
    let bodyColor = "linear-gradient(315deg, #c0b4b6 0%, #a49fb3 74%)";
    if(today == true){headerColor = "linear-gradient(315deg, #E0A235 0%, #E0861A 74%)";bodyColor = "linear-gradient(315deg, #ECC785 0%, #ECB675 74%)"}
    if(selected == true){
      headerColor = "linear-gradient(315deg, #2a2a72 0%, #009ffd 74%)";
      bodyColor = "linear-gradient(315deg, #f3e6e8 0%, #d5d0e5 74%)";
      return (
        <Fragment>
          <div onClick={()=>{this.selectDay()}} style={{cursor:"pointer",justifyItems:"stretch",display:"grid",gridTemplateRows:"32px 1fr",gridColumnStart:dow}}>
            <div style={{backgroundColor:"#000000",borderColor:"#414141",borderWidth:"2px 2px 2px 2px",borderStyle:"solid",backgroundImage:headerColor,color:"#fff",display:"flex"}}>
              <p style={{margin:"auto"}}>{this.getDayName(dow).substring(0,3)+" "+('00'+day).slice(-2)}</p>
            </div>
            <div style={{display:"grid",gridTemplateRows:"26px 1fr",gridTemplateColumns:"1fr",justifyContent:"center",alignItems:"center",borderColor:"#414141",borderWidth:"0 3px 3px 3px",borderStyle:"solid",backgroundColor:"#ecf0f1",backgroundImage:bodyColor}}>
              <Label style={{margin:"3px 3px 0 0",justifySelf:"end",alignSelf:"start"}} color={dayColorCode}>
                {entretiens.length}
              </Label>
            </div>
          </div>
        </Fragment>
      )
    }else{
      return (
        <div onClick={()=>{this.selectDay()}} style={{cursor:"pointer",justifyItems:"stretch",display:"grid",gridTemplateRows:"32px 1fr",gridColumnStart:dow}}>
          <div style={{backgroundColor:"#000000",borderColor:"#414141",borderWidth:"2px 2px 2px 2px",borderStyle:"solid",backgroundImage:headerColor,color:"#fff",display:"flex"}}>
            <p style={{margin:"auto"}}>{this.getDayName(dow).substring(0,3)+" "+('00'+day).slice(-2)}</p>
          </div>
          <div style={{display:"grid",gridTemplateRows:"26px 1fr",gridTemplateColumns:"1fr",justifyContent:"center",alignItems:"center",borderColor:"#414141",borderWidth:"0 3px 3px 3px",borderStyle:"solid",backgroundColor:"#ecf0f1",backgroundImage:bodyColor}}>
            <Label style={{margin:"3px 3px 0 0",justifySelf:"end",alignSelf:"start"}} color={dayColorCode}>
              {entretiens.length}
            </Label>
          </div>
        </div>
      )
    }
  }
}

export default CalendarTile;