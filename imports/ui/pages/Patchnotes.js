import React, { Component } from 'react'
import { Segment, Header, List } from 'semantic-ui-react';

export class Patchnotes extends Component {
    render() {
        return (
            <div>
                <Segment>
                    <Header color='blue' as="h2">17/05/2020 - v1.1.06</Header>
                    <List divided relaxed>
                    <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Stockage document : Contrôles de batiment</List.Header>
                                <List.Description>Ajout de la fonction de stockage de documents pour les contrôles des batiments (fiche d'intervention)</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Stockage document : Entretiens</List.Header>
                                <List.Description>Ajout de la fonction de stockage de documents pour les entretiens (fiche d'intervention)</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='double angle up' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Nouveau filtre : Accidentologie</List.Header>
                                <List.Description>Ajout du filtrage des accidents selon l'etat de l'envoi du constat</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
                <Segment>
                    <Header color='blue' as="h2">16/05/2020 - v1.1.05</Header>
                    <List divided relaxed>
                        <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Stockage document : Accidentologie</List.Header>
                                <List.Description>Ajout de la fonction de stockage de documents pour les accidents (constats, rapports d'expert et factures)</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Changement d'interface : Gestion des fichiers</List.Header>
                                <List.Description>Ajustements mineurs concernant l'UI du module de gestion de fichiers</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
                <Segment>
                    <Header color='blue' as="h2">13/05/2020 - v1.1.04</Header>
                    <List divided relaxed>
                        <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Stockage document : Licences</List.Header>
                                <List.Description>Ajout de la fonction de stockage de documents pour les licences</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
                <Segment>
                    <Header color='blue' as="h2">05/05/2020 - v1.1.03</Header>
                    <List divided relaxed>
                        <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Export Excel</List.Header>
                                <List.Description>Ajout d'une fonction d'export du parc de vehicules au format Excel .xlsx (fonction administrateur), actuellement sans filtres ni formatage du fichiers en sortie</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
                <Segment>
                    <Header color='blue' as="h2">03/05/2020 - v1.1.02</Header>
                    <List divided relaxed>
                        <List.Item>
                            <List.Icon name='bug' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Correction Payement de Véhicule</List.Header>
                                <List.Description>Correction d'un bug affichant un nombre de mois négatif restant à payer</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='cog' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Nouveau DatePicker</List.Header>
                                <List.Description>Le DatePicker "react-infinite-calendar" était trop instable et a été remplacé par un autre DatePicker développé from scratch</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='plus' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Prêt entre societé</List.Header>
                                <List.Description>Ajout des fonctions de partage/rappel des véhicules entre societés (fonction propriétaire) + options de filtrage</List.Description>
                            </List.Content>
                        </List.Item>
                    </List>
                </Segment>
                <Segment>
                    <Header color='blue' as="h2">29/04/2020 - v1.1.01</Header>
                    <List divided relaxed>
                        <List.Item>
                            <List.Icon name='bug' size='large' verticalAlign='middle' />
                            <List.Content>
                                <List.Header>Correction dashbord</List.Header>
                                <List.Description>Correction d'un bug empanchant l'affichage du dashboard lorsque un filtre de société est déjà renseigné</List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name='double angle up' size='large' verticalAlign='middle' />
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
