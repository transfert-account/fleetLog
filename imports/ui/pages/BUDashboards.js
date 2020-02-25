import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';

export class Dashboard extends Component {
    render() {
        return (
            <div>
                BUDashboard
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Dashboard);