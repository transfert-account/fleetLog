import React, { Component } from 'react';
import { List, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';

class LogItem extends Component {

    render(){
        return(
            <List.Item className="log-item" as='a'>
                <Icon name='right triangle' />
                <List.Content>
                    <List.Header>
                        <div style={{display:"grid",gridTemplateColumns:"56px 1fr",marginBottom:"4px"}}>
                            <div className="log-number">
                                [{this.props.log.number}]
                            </div>
                            <div>
                                {this.props.log.date} à {this.props.log.time}
                            </div>
                        </div>
                    </List.Header>
                    <List.Description>
                        {this.props.log.message}
                    </List.Description>
                </List.Content>
            </List.Item>
        )
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(LogItem));
