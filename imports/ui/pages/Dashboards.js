import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import DashboardUnit from '../molecules/DashboardUnit';
import { gql } from 'apollo-server-express';

export class Dashboard extends Component {

    state={
        dashboardsRaw:[],
        dashboardsQuery : gql`
            query dashboards{
                dashboards{
                    societe{
                        _id
                        name
                        trikey
                    }
                    vehicles
                    vehiclesLate
                    vehiclesVeryLate
                    locations
                    locationsLate
                    locationsVeryLate
                    controlsOk
                    controlsUrgent
                    controlsLate
                    licences
                    licencesEndSoon
                    licencesOver
                    entretiensNotReady
                    entretiensReadyAffected
                    entretiensReadyUnaffected
                    commandesToDo
                    commandesDone
                    commandesReceived
                }
            }
        `
    }

    loadDashboards = () => {
        this.props.client.query({
            query:this.state.dashboardsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                dashboardsRaw:data.dashboards
            })
        })
    }

    componentDidMount = () => {
        this.loadDashboards()
    }

    render() {
        return (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                <div style={{gridColumnEnd:"span 2"}}></div>
                {this.state.dashboardsRaw.map(d=>{
                    return <DashboardUnit key={"dash"+d.societe._id} dashboard={d}/>
                })}
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