
import React, { Component } from 'react'
import { Segment, Button, Popup, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class CustomSegmentFilter extends Component {

    render() {
        return (
            <Segment raised style={Object.assign({display:"grid",gridTemplateColumns:"1fr auto"},this.props.style)}>
                <div style={{display:"flex",justifyContent:"start",placeSelf:"stretch"}}>
                    {this.props.children}
                </div>
                <Popup position="bottom center" trigger={
                    <Button onClick={this.props.resetAll} size="big" color="red" icon="cancel"/>
                }>
                    Rénitialiser les filtres
                </Popup>
            </Segment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(CustomSegmentFilter);