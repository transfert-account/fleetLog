import React, { Component } from 'react';
import { Table, Button, Popup, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

class ActionsGridCell extends Component {

    state={}

    render() {
        return (
            <Table.Cell textAlign="center">
                {this.props.actions.map(a=>{
                    return(
                        <Popup key={a.tooltip} trigger={
                            <Button color={a.color} icon onClick={a.click} icon={a.icon} />
                        }>
                            {a.tooltip}
                        </Popup>
                    )
                })}
            </Table.Cell>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(ActionsGridCell);