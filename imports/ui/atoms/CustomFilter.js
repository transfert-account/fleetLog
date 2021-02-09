import React, { Component } from 'react';
import { Popup, Button, Grid, Icon } from 'semantic-ui-react';

export default class CustomFilter extends Component {

    state = {
        open:false
    }

    handleClick = callback => {
        this.handleClose();
        callback();
    }

    handleOpen = () => {
        this.setState({ open: true })
    }
    
    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        return(
            <Popup position="bottom center" on='click' pinned={"true"} open={this.state.open} onClose={this.handleClose} onOpen={this.handleOpen} flowing trigger={
                    <Button size="big" style={{marginLeft:(this.props.spaced ? "16px" : "")}} color={this.props.infos.options.filter(o=>o.value == this.props.active)[0].color} icon={this.props.infos.icon}/>
                }>
                <Grid centered divided columns={this.props.infos.options.length}>
                    {this.props.infos.options.map(o => (
                        <Grid.Column key={o.value} textAlign='center'>
                            <div style={{height:"100%",display:"grid",gridGap:"16px",gridTemplateRows:"1fr auto"}}>
                                <div>
                                    <p>{o.text}</p>
                                </div>
                                <Button color={o.color} onClick={()=>{this.handleClick(o.click)}}>Définir</Button>
                            </div>
                        </Grid.Column>
                    ))}
                </Grid>
            </Popup>
        )
    }
}
