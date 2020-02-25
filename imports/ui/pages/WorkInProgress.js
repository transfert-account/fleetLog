import React, { Component } from 'react'
import { GridRow } from 'semantic-ui-react';

class WorkInProgress extends Component {
    render() {
        return (
            <div style={{display:"grid",gridTemplateColumns:"1fr 256px 1fr",gridTemplateRows:"256px 256px 1fr"}}>
                <img style={{placeSelf:"center",gridColumnStart:"2",gridRowStart:"2",width:"256px",height:"256px"}} src ="/res/geometric.png"/>
                <h1 style={{placeSelf:"center",gridColumnStart:"1",gridColumnEnd:"span 3",gridRowStart:"3"}}>Cette section est encore en travaux et sera bientôt disponible</h1>
            </div>
        )
    }
}

export default WorkInProgress
