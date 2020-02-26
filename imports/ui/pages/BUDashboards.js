import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import DashboardUnit from '../molecules/DashboardUnit';
import { gql } from 'apollo-server-express';

export class BUDashboard extends Component {

    state={
        dashboardRaw:[],
        dashboardQuery : gql`
            query dashboard{
                dashboard{
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

    loadDashboard = () => {
        this.props.client.query({
            query:this.state.dashboardQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                dashboardRaw:[data.dashboard]
            })
        })
    }

    componentDidMount = () => {
        this.loadDashboard()
    }

    render() {
        return (
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gridTemplateRows:"128px auto",gridGap:"16px"}}>
                <div style={{gridRowStart:"2",gridColumnStart:"2",justifySelf:"stretch"}}>
                    {this.state.dashboardRaw.map(d=>{
                        return <DashboardUnit key={"dash"+d.societe._id} dashboard={d}/>
                    })}
                </div>
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(BUDashboard);