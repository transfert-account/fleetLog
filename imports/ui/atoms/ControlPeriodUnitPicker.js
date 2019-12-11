import React, { Component,Fragment } from 'react'
import { Dropdown,Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

class ControlPeriodUnitPicker extends Component {

    state={
        units:[
            {text:"Kilomètres",key:"km",value:"km"},
            {text:"Mois",key:"m",value:"m"},
            {text:"Ans",key:"y",value:"y"},
        ]
    }

    setUnit = (e, { value }) => {
        this.props.onChange(this.props.target,value);
    }

    render() {
        return (
            <Dropdown style={{marginLeft:"8px"}} inline options={this.state.units} placeholder=' [Unité] ' onChange={this.setUnit} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(ControlPeriodUnitPicker);