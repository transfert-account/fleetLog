import React, { Component, Fragment } from 'react';
import { Modal } from 'semantic-ui-react';

export class AvatarPicker extends Component {

    chooseAvatar = id => {
        this.props.saveAvatar(id);
        this.props.close();
    }

    render() {
        let avatars = [];
        for(let i = 1; i <= 260; i++) {
            avatars.push(i);
        }
        return (
            <Fragment>
                <Modal size="large" closeIcon open={this.props.open} onClose={this.props.close} >
                    <Modal.Header>
                        Choisir un avatar :
                    </Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description style={{display:"flex",flexWrap:"wrap",justifyContent:"space-around"}}>
                            {avatars.map(avatar=>(
                                <img onClick={() => {this.chooseAvatar(avatar)}} key={avatar} style={{cursor:"pointer",width:"80px",height:"80px",margin:"16px"}} src={"/res/avatar/"+ ('000'+avatar).slice(-3) +".png"} alt="active-client-avatar"/>
                            ))}
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </Fragment>
        )
    }
}

export default AvatarPicker
