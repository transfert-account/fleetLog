import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Header, Dimmer, Loader } from 'semantic-ui-react';
import DashboardUnit from '../molecules/DashboardUnit';
import { gql } from 'apollo-server-express';

export class BUDashboards extends Component {

    state={
        dataLoaded:false,
        societeLoaded:false,
        societeFull:{},
        dashboardRaw:[],
        societeQuery : gql`
            query societe($_id:String!){
                societe(_id:$_id){
                    _id
                    trikey
                    name
                }
            }
        `,
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
                    controlsTotal
                    controlsOk
                    controlsUrgent
                    controlsLate
                    licences
                    licencesEndSoon
                    licencesOver
                    entretiensNotReady
                    entretiensReadyAffected
                    entretiensReadyUnaffected
                    entretiensTotalNotArchived
                    commandesToDo
                    commandesDone
                    commandesReceived
                    commandesTotalNotArchived
                    avgKm
                    nbOwned
                    nbCRB
                    nbCRC
                    licenceAffected
                    licenceFree
                    vehiclesVolumeRepartition{
                        key
                        label
                        value
                    }
                    vehiclesModelRepartition{
                        key
                        label
                        value
                    }
                }
            }
        `,
        dashboard : () => {
            return <DashboardUnit dashboard={this.state.dashboardRaw}/>
        }
    }

    loadDashboard = () => {
        this.props.client.query({
            query:this.state.dashboardQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                dashboardRaw:data.dashboard,
                dataLoaded:true
            })
        })
    }

    loadSociete = () => {
        this.props.client.query({
            query:this.state.societeQuery,
            variables:{
                _id:this.props.societeFilter
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                societeFull:data.societe,
                societeLoaded:true
            })
        })
    }

    componentDidMount = () => {
        this.loadSociete()
        this.loadDashboard()
    }

    render() {
        if(this.state.dataLoaded && this.state.societeLoaded){
            return (
                <div style={{height:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"32px 48px",gridTemplateRows:"minmax(0,1fr)",paddingRight:"16px"}}>
                    {this.state.dashboard()}
                </div>
            )
        }else{
            return (
                <Dimmer inverted active>
                    <Loader size='massive'>Chargement du tableaud de bord ...</Loader>
                </Dimmer>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(BUDashboards);