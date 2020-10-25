import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Card, Icon, Label, Popup } from 'semantic-ui-react';
import { gql } from 'apollo-server-express';
import { map } from 'lodash';

class DashboardCard extends Component {

    render() {
        return (
            <Card style={{margin:"8px"}}>
                <Card.Content>
                    <Card.Header>{this.props.title}</Card.Header>
                </Card.Content>
                <Card.Content extra style={{display:"flex",justifyContent:"space-around"}}>
                    {this.props.kpis.map(kpi=>{
                        return (
                            <Popup key={kpi.data + kpi.tooltip} position='bottom center' content={kpi.data + kpi.tooltip} trigger={
                                <Label size="big" onClick={kpi.click} style={{marginLeft:"4px",cursor:"pointer"}} color={kpi.color} image>
                                    <Icon style={{margin:"0"}} name={kpi.icon}/>
                                    <Label.Detail>{kpi.data}</Label.Detail>
                                </Label>
                            }/>
                        )
                    })}
                </Card.Content>
            </Card>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(DashboardCard);