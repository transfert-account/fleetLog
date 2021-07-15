import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, Segment, Popup, Button, Icon, Header, Label } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class Scripts extends Component {

    state={
      msFormat : "DD/MM/YYYYY - HH:mm:ss.SSS",
      jobsRaw:[],
      selectedJobExecutionsRaw:[],
      selectedExecutionLogsRaw:[],
      jobsQuery : gql`
        query jobs{
          jobs{
            key
            name
            lastExecuted
          }
        }
      `,
      jobExecutionsQuery : gql`
        query jobExecutions($key:String!){
          jobExecutions(key:$key){
            _id
            timeStart
            timeEnd
            executionTime
          }
        }
      `,
      jobLogsQuery : gql`
        query jobLogs($_id:String!){
          jobLogs(_id:$_id){
            timestamp
            text
            type
            options
          }
        }
      `,
      playJobQuery : gql`
        mutation playJob($key:String!){
          playJob(key:$key){
            status
            message
          }
        }
      `,
      selectedJob:null
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    selectJob = key => {
      this.setState({selectedJob:key})
      this.loadJobExecutions(key);
    }
    displayLogs = (_id,ended) => {
      if(ended){
        this.setState({selectedExecution:_id})
        this.loadJobLogs(_id);
      }
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    runSelectedJob = () => {
      this.props.client.mutate({
        mutation: this.state.playJobQuery,
        variables:{
          key:this.state.selectedJob
        }
      }).then(({data})=>{
        data.playJob.map(qrm=>{
          if(qrm.status){
            this.setState({
              running:qrm.obj
            })
            this.props.toast({message:qrm.message,type:"success"});
            this.loadJobExecutions(this.state.selectedJob)
          }else{
            this.props.toast({message:qrm.message,type:"error"});
          }
        })
      })
    }
    loadJobs = () => {
      this.props.client.query({
        query: this.state.jobsQuery,
        fetchPolicy:"network-only"
      }).then(({data})=>{
        this.setState({
          jobsRaw:data.jobs
        })
      })
    }
    loadJobExecutions = key => {
      this.props.client.query({
        query: this.state.jobExecutionsQuery,
        variables:{
          key:key
        },
        fetchPolicy:"network-only"
      }).then(({data})=>{
        this.setState({
          selectedJobExecutionsRaw:data.jobExecutions.reverse()
        })
      })
    }
    loadJobLogs = _id => {
      this.props.client.query({
        query: this.state.jobLogsQuery,
        variables:{
          _id:_id
        },
        fetchPolicy:"network-only"
      }).then(({data})=>{
        this.setState({
          selectedExecutionLogsRaw:data.jobLogs.map(j=>{return({...j,options:JSON.parse(j.options)})})
        })
      })
    }
    /*CONTENT GETTERS*/
    getSideTable = () => {
      if(this.state.selectedJob == null){
        return (
          <div style={{gridRowStart:"2",gridRowEnd:"span 3",placeSelf:"stretch",gridColumnStart:"1",overflowY:"scroll",paddingRight:"16px"}}>
            <Table selectable celled style={{margin:"0"}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">Job</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Dernière execution</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.jobsRaw.map(j=>{
                  return(
                    <Table.Row style={{cursor:"pointer"}} onClick={()=>this.selectJob(j.key)}>
                      <Table.Cell>{j.name}</Table.Cell>
                      <Table.Cell textAlign="center">dd/mm/yyyy</Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>
        )
      }else{
        return (
          <Fragment>
            <Button size="big" style={{gridRowStart:"2",gridColumnStart:"1",placeSelf:"stretch"}} icon="double angle left" labelPosition="left" content="Retour à la liste des jobs" onClick={()=>this.setState({selectedJob:null})}/>
            <div style={{gridRowStart:"3",gridColumnStart:"1",gridRowEnd:"span 2",overflowY:"scroll",paddingRight:"16px"}}>
              <Table selectable celled style={{margin:"0"}}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">Date de l'execution</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row style={{cursor:"pointer"}}>
                    <Table.Cell textAlign="center">
                      <Button size="big" style={{gridRowStart:"2",gridColumnStart:"1",placeSelf:"stretch"}} icon="play" labelPosition="right" content="Executer maintenant" onClick={this.runSelectedJob}/>
                    </Table.Cell>
                  </Table.Row>
                  {this.state.selectedJobExecutionsRaw.map(e=>{
                    console.log(e.timeEnd == null)
                    return(
                      <Table.Row positive={(e.timeEnd == null)} key={e._id} style={{cursor:"pointer"}} onClick={()=>this.displayLogs(e._id,true)}>
                        <Table.Cell>
                          {moment(e.timeStart).format("DD/MM/YYYY HH:mm:ss")}
                          <Label style={{marginLeft:"16px"}}>{moment(e.timeStart).fromNow()}</Label>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </div>
          </Fragment>
        )
      }
    }
    getJobHeader = () => {
      if(this.state.selectedJob == null){
        return (
          <Header as="h1">Aucun job séléctionné</Header>
        )
      }else{
        return (
          <Header as="h1">Job : {this.state.jobsRaw.filter(j=>j.key == this.state.selectedJob)[0].name}</Header>
        )
      }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
      this.loadJobs();
    }

    render() {return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto auto auto 1fr"}}>
        <div style={{display:"grid",marginBottom:"0",gridTemplateColumns:"auto 1fr",gridColumnEnd:"span 2",gridGap:"32px"}}>
          <AdministrationMenu active="scripts"/>
        </div>
        {this.getSideTable()}
        <Segment style={{margin:"0"}}>
          {this.getJobHeader()}
        </Segment>
        <div style={{overflowY:"scroll",gridRowEnd:"span 2",paddingRight:"16px"}} className="console">
          {this.state.selectedExecutionLogsRaw.map(l=>{
            if(l.type == "br"){
              return <br/>
            }
            if(l.type == "text"){
              return(
                <Fragment>
                  <p><span style={{color:"#777"}}>{"["+moment(l.timestamp,this.state.msFormat).format("HH:mm:ss.SSS")+"]"}</span> {l.text}</p>
                </Fragment>
              )
            }
            if(l.type == "link"){
              return(
                <Fragment>
                  <p><span style={{color:"#777"}}>{"["+moment(l.timestamp,this.state.msFormat).format("HH:mm:ss.SSS")+"]"}</span>{l.text}<a style={{color:"#74b9ff"}} href="#" onClick={()=>this.props.history.push(l.options.link)}>{l.options.linkLabel}</a></p>
                </Fragment>
              )
            }
          })}
        </div>
      </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withRouter(withUserContext(Scripts));