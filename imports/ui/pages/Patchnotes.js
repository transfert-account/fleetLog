import React, { Component } from 'react'
import { Segment, Header, List } from 'semantic-ui-react';

export class Patchnotes extends Component {
    render() {
        return (
            <div>
                <Segment>
                    <Header color='blue' as="h2">29/04/04 - v1.1.0</Header>
                    <List divided relaxed>
                        <List.Item>
                            <List.Icon name='bug' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Correction dashbord</List.Header>
                                <List.Description>Correction d'un bug empanchant l'affichage du dashboard lorsque un filtre de société est déjà renseigné</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='edit' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Sociétés</List.Header>
                                <List.Description>Il est maintenant possible de modifier le nom d'une societé sans la re-créer</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Patchnotes</List.Header>
                                <List.Description>Ajout de la page des notes de versions</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
            </div>
        )
    }
}

export default Patchnotes
