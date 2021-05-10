
import React, { Component } from 'react'
import { Segment, Button, Popup, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class CustomSegmentFilter extends Component {

    getEntryLoaded = () => {
        if(this.props.entryLoaded){
            return(
                <Button size="big" color="blue" loading={!this.props.fullLoaded}>
                    {this.props.entryLoaded} {this.props.entryLoadedText}
                </Button>
            )
        }
    }

    render() {
        return (
            <Segment style={Object.assign({display:"grid",gridTemplateColumns:"1fr auto auto",margin:"0"},this.props.style)}>
                <div style={{display:"flex",justifyContent:"start",placeSelf:"stretch"}}>
                    {this.props.children}
                </div>
                <Popup position="bottom center" trigger={
                    <Button onClick={this.props.resetAll} size="big" color="red" icon="cancel"/>
                }>
                    Rénitialiser les filtres
                </Popup>
                {this.getEntryLoaded()}
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