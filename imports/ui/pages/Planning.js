import React, { Component } from 'react';
import { Grid,Table } from 'semantic-ui-react';
import PlanningRow from '../molecules/PlanningRow';
import Calendar from '../molecules/Calendar';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

class Planning extends Component {

  state={
    month:parseInt(this.props.match.params.m),
    year:parseInt(this.props.match.params.y),
    selectedDay:new Date().getDate(),
    
  }

  loadEntretiensOfTheDay = ({d,m,y}) => {
    this.setState({selectedDay:d})
  }

  navigateToEntretien = _id => {
    this.props.history.push("/entretien/"+_id); 
  }
  
  loadMonthByParams = ({year,month}) => {
    console.log(month)
    console.log(year)
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

  render() {
    return (
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gridGap:"32px"}}>
        <Calendar month={this.state.month} year={this.state.year}/>
        <Table style={{gridColumnStart:"2",placeSelf:"start stretch"}} striped celled compact="very">
          <Table.Header>
            <Table.Row textAlign='center'>
              <Table.HeaderCell width={6}>Entretien</Table.HeaderCell>
              <Table.HeaderCell width={6}>Véhicule</Table.HeaderCell>
              <Table.HeaderCell width={4}></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[].map(d=>{
              return (<PlanningRow key={d.year+"/"+d.month+"/"+d.day} loadEntretiensOfTheDay={this.loadEntretiensOfTheDay} navigateToEntretien={this.navigateToEntretien} entretiens={d.entretiens} />)
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(Planning));