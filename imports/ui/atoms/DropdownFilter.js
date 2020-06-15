import React, { Component } from 'react';
import { Dropdown, Message } from 'semantic-ui-react';

class DropdownLabel extends Component {

    state = {
        label:""
    }

    render() {
        return (
            <Message size="big" style={{placeSelf:"stretch",marginBottom:"auto",marginTop:"auto",display:"flex",justifyContent:"center"}} color={this.props.infos.options.filter(o=>o.value == this.props.active)[0].color}>
                <Dropdown text={this.props.infos.options.filter(o=>o.value == this.props.active)[0].text} icon={this.props.infos.icon} floating labeled button className='icon'>
                    <Dropdown.Menu>
                        <Dropdown.Menu scrolling>
                            {this.props.infos.options.map(o => (
                                <Dropdown.Item key={o.value} {...o} onClick={o.click}/>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown.Menu>
                </Dropdown>
            </Message>
        )
    }
}

export default DropdownLabel
