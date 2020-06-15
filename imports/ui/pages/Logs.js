import React, { Component } from 'react';
import { Input, Segment, List } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import LogItem from "../molecules/LogItem";
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class Logs extends Component {

    state = {
        logsFilter:"",
        logsQuery:gql`
            query logs{
                logs{
                    _id
                    number
                    date
                    time
                    message
                    stacktrace
                    type
                    domain
                }
            }
        `,
        logsRaw:[],
        logs : () => {
            let displayed = Array.from(this.state.logsRaw);
            displayed = displayed.filter(d=>d.number.toLowerCase().includes(this.state.logsFilter.toLowerCase()) || d.message.toLowerCase().includes(this.state.logsFilter.toLowerCase()));
            for (let index = 10000; index < 10250; index++) {
                displayed.push({_id:index,number:index,date:"02/02/2020",time:"12:34:56",message:"Error : can't resolve this shit !",stacktrace:"blah \nblah \nblah \nblah \nblah \nblah \nblah",type:"err",domain:"vehicles"});   
            }
            return displayed.map(l=>(
                <LogItem log={l}/>
            ))
        }
    }

  handleFilter = e => {
    this.setState({
      logsFilter : e.target.value
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.loadLogs();
  }

  loadLogs = () => {
    this.props.client.query({
      query: this.state.logsQuery,
      fetchPolicy:"network-only"
    }).then(({data}) => {
      this.setState({
        logsRaw:data.logs
      })
    })
  }

  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto"}}>
        <div style={{display:"grid",marginBottom:"0",gridTemplateColumns:"auto 1fr", gridGap:"32px"}}>
          <AdministrationMenu active="logs"/>
          <Input name="logsFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un log ...' />
        </div>
        <Segment verticalAlign='middle' style={{display:"block",overflowY:"auto",justifySelf:"stretch",overflowY:"scroll"}}>
            <List divided>
                {this.state.logs()}
            </List>
        </Segment>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Logs));
