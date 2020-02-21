import React, { Component } from 'react'
import { Modal, Button } from "semantic-ui-react";
import { SketchPicker } from 'react-color'

export class HexColorPicker extends Component {
    
    state={
        open : this.props.open,
        hex : this.props.hex
    }

    onSelect = () => {
        this.props.onSelect(this.state.hex)
    }

    handleChange = (color, event) => {
        this.setState({
            hex:color.hex
        })
      }

    handleChangeComplete = (color) => {
        this.setState({ background: color.hex });
    };

    render() {
        return (
            <Modal size="mini" open={this.props.open}>
                <Modal.Header>
                    {this.props.header}
                </Modal.Header>
                <Modal.Content style={{display:"grid"}}>
                    <div style={{placeSelf:"center"}}>
                        <SketchPicker style={{placeSelf:"center"}} color={this.state.hex} onChange={this.handleChange} onChangeComplete={this.handleChangeComplete} />
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={this.props.close}>Annuler</Button>
                    <Button color="green" onClick={this.onSelect}>Choisir</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default HexColorPicker
