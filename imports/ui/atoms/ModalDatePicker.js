import React, { Component } from 'react'
import { Modal, ModalHeader, ModalContent } from 'semantic-ui-react';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

export class ModalDatePicker extends Component {

  state={
    open : this.props.open
  }

  onSelect = date => {
    this.props.closeDatePicker();
    this.props.onSelectDatePicker(date);
  }

  render() {
    const { selected,open } = this.props;
    return (
      <Modal size='mini' onClose={this.props.close} dimmer="inverted" open={open} closeOnDimmerClick closeOnEscape>
        <ModalHeader>
          {this.props.header}
        </ModalHeader>
        <ModalContent style={{padding:"0"}}>
          <InfiniteCalendar
              displayOptions={{
                showHeader: false
              }}
              locale={{
              weekStartsOn: 1,
              locale: require('date-fns/locale/fr'),
              headerFormat: 'dddd, D MMM',
              weekdays: ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],
              blank: 'Selectionnez une date',
              todayLabel: {
                long: 'Aujourd\'hui',
                short: 'Auj.'
              }
            }}
            theme={{
              selectionColor: 'rgba(44, 62, 80,1.0)',
              textColor: {
                default: '#333',
                active: '#FFF'
              },
              weekdayColor: 'rgba(52, 73, 94,1.0)',
              headerColor: 'rgba(44, 62, 80,1.0)',
              floatingNav: {
                background: 'rgba(81, 67, 138, 0.96)',
                color: '#FFF',
                chevron: '#FFA726'
              }
            }}
            width={"100%"}
            height={480}
            selected={selected}
            disabledDays={[7,6]}
            onSelect={this.onSelect}
          />
        </ModalContent>
      </Modal>
    )
  }
}

export default ModalDatePicker
