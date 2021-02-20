import React, { Component } from 'react';
import { Loader, Dimmer, Segment } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';

import moment from 'moment';
import _ from 'lodash';

export class TextareaControlled extends Component {

    state={
        currentInput:""
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }
    onChange = e => {
        this.setState({currentInput:e.target.value})
        this.change()
    }
    change = _.debounce(()=>{
        this.props.onChange(this.state.currentInput);
    },100);

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
            return <textarea name={this.props.name} className={this.props.className} style={this.props.style} onChange={this.onChange} defaultValue={this.props.defaultValue}/>
        }
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(TextareaControlled);