import React, { Component } from 'react';
import { Segment, Form, Dimmer, Loader } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import QuestionField from '../atoms/QuestionField';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class QuestionsPanel extends Component {

    state={
        index:this.props.index
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    onChange = (index,value) => {
        this.props.onChange(this.props.questions.page-1,index,value)
    }
    cancel = (index) => {
        this.props.cancel(this.props.questions.page-1,index)
    }
    validate = (index) => {
        this.props.validate(this.props.questions.page-1,index)
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {
        if(this.props.needToReset){
            return (
                <Segment style={{placeSelf:"stretch"}}>
                    <Dimmer inverted active>
                        <Loader size="massive">Initialisation du champ</Loader>
                    </Dimmer>
                </Segment>
            )
        }else{
            return(
                <Segment.Group raised style={{placeSelf:"stretch"}}>
                    <Segment>
                        <h2>{this.props.index+1 + ") " + this.props.questions.title}</h2>
                    </Segment>
                    <Segment>
                        <Form>
                            {this.props.questions.fields.map(f=>{
                                return(
                                    <QuestionField key={f.index} validate={this.validate} cancel={this.cancel} page={this.props.questions.page} onChange={this.onChange} field={f}/>
                                )
                            })}
                        </Form>
                    </Segment>
                </Segment.Group>
            )
        }
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(QuestionsPanel);