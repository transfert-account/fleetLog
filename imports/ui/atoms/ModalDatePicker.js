import React, { Component } from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react';

export class ModalDatePicker extends Component {

  state={
    displayed:[],
    open : this.props.open,
    date : new Date(),
    months : [{i:0,label:"Janvier"},{i:1,label:"Fevrier"},{i:2,label:"Mars"},{i:3,label:"Avril"},{i:4,label:"Mai"},{i:5,label:"Juin"},{i:6,label:"Juillet"},{i:7,label:"Août"},{i:8,label:"Septembre"},{i:9,label:"Octobre"},{i:10,label:"Novembre"},{i:11,label:"Décembre"}],

    todayFormated : new Date().getDate().toString().padStart(2, '0')+"/"+parseInt(new Date().getMonth()+1).toString().padStart(2, '0')+"/"+new Date().getFullYear().toString().padStart(4, '0'),
    day:new Date().getDate(),
    month:new Date().getMonth(),
    year:new Date().getFullYear(),

    dMonth:new Date().getMonth(),
    dYear:new Date().getFullYear(),
    centralYear:new Date().getFullYear(),

    selectedDate : new Date(),
    selectedDateFormated : () => { return this.state.selectedDate.getDate().toString().padStart(2, '0')+"/"+parseInt(this.state.selectedDate.getMonth()+1).toString().padStart(2, '0')+"/"+this.state.selectedDate.getFullYear().toString().padStart(4, '0');}
  }
  
  onDateSelected = () => {
    this.props.closeDatePicker();
    this.props.onSelectDatePicker(this.state.selectedDate);
  }

  setYear = y => {
    this.setState({
      dYear : y,
      centralYear: y,
      displayed:this.generateMonth({m:this.state.dMonth,y:y})
    })
  }

  setMonth = m => {
    this.setState({
      dMonth : m,
      displayed:this.generateMonth({m:m,y:this.state.dYear})
    })
  }

  setDay = d => {
    this.setState({
      selectedDate : new Date(d.year,d.month,d.day)
    })
  }

  scrollYearsUp = () => {
    this.setState({
      centralYear : this.state.centralYear-1
    })
  }

  scrollYearsDown = () => {
    this.setState({
      centralYear : this.state.centralYear+1
    })
  }

  //DAYS OF MONTH AND UI OFFSET GENERATION
  generateMonth = ({m,y}) => {
    let todayDate = this.state.date;
    let date = new Date(y, m, 1);
    let days = [];
    let today = null;
    while (date.getMonth() === m) {
      (date.getDate() == todayDate.getDate() && date.getMonth() == todayDate.getMonth() && date.getFullYear() == todayDate.getFullYear() ? today = true : today = false)
      let day = {
        day:date.getDate(),
        month:date.getMonth(),
        year:date.getFullYear(),
        dow: date.getDay() === 0 ? 7 : date.getDay(),

        today:today
      }
      days.push(day);
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  //GETTER UI CONTROLS DAYS MONTHS YEARS
  getYearsControls = () => {
    let yearsAvailable = []
    for(let y = this.state.centralYear-3;y<=this.state.centralYear+3;y++){
      yearsAvailable.push(y)
    }
    return(
      <div className="datePickerYearsLayout">
        <div className="yearDPTile scroll" onClick={this.scrollYearsUp}>
          <Icon name="angle up"/>
        </div>
        {yearsAvailable.map(y=>
          <div key={y} className={"yearDPTile"+(y == this.state.dYear ? " selected" : "")} onClick={()=>{this.setYear(y)}}>{y}</div>
        )}
        <div className="yearDPTile scroll" onClick={this.scrollYearsDown}>
          <Icon name="angle down"/>
        </div>
      </div>
    )
  }

  getMonthsControls = () => {
    let months = [
      {i:0,label:"Janvier"},
      {i:1,label:"Fevrier"},
      {i:2,label:"Mars"},
      {i:3,label:"Avril"},
      {i:4,label:"Mai"},
      {i:5,label:"Juin"},
      {i:6,label:"Juillet"},
      {i:7,label:"Août"},
      {i:8,label:"Septembre"},
      {i:9,label:"Octobre"},
      {i:10,label:"Novembre"},
      {i:11,label:"Décembre"}
    ];
    return(
      <div className="datePickerMonthsLayout">
        {months.map(m=>
          <div key={m.i} className={"monthDPTile"+(m.i == this.state.dMonth ? " selected" : "")} onClick={()=>{this.setMonth(m.i)}}>{m.label}</div>
        )}
      </div>
    )
  }

  getDaysControls = () => {
    let dow = ["Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.","Dim."]
    if(this.state.displayed.length>0){
      return(
        <div className="datePickerDaysLayout">
          {dow.map(d=>
            <div key={d} className="dowLabel">{d}</div>
          )}
          {this.state.displayed.map(d=>
            <div key={d.year+"/"+d.month+"/"+d.day} className={"dayDPTile"+(d.day == this.state.selectedDate.getDate() && d.month == this.state.selectedDate.getMonth() && d.year == this.state.selectedDate.getFullYear() ? " selected" : "")+(d.today ? " today" : "")} style={{gridColumnStart:d.dow}} onClick={()=>{this.setDay(d)}}>{d.day}</div>
          )}
        </div>
      )
    }else{
      return ""
    }
    
  }

  //INIT
  initPicker = () => {
    this.setState({
      dMonth:this.state.month,
      dYear:this.state.year,
      displayed:this.generateMonth({m:this.state.month,y:this.state.year})
    })
  }

  componentDidMount = () => {
    this.initPicker();
  }

  render() {
    return (
      <Modal size="large" onClose={this.props.closeDatePicker} dimmer="inverted" open={this.props.open} closeOnDimmerClick closeOnEscape>
        <Modal.Content style={{padding:"0"}}>
          <div className="datePickerTopLayout">
            {this.getYearsControls()}
            {this.getMonthsControls()}
            {this.getDaysControls()}
            <div className="datePickerSelectedLayout">
              <Icon size="large" name="calendar check outline"/>
              <div>
                {this.state.selectedDateFormated()}
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
            <Button color="black" onClick={this.props.closeDatePicker}>Annuler</Button>
            <Button color="blue" onClick={this.onDateSelected}>Selectionner la date du {this.state.selectedDateFormated()}</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ModalDatePicker
