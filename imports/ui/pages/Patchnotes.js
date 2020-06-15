import React, { Component } from 'react'
import { Segment, Header, List, Menu, Icon } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

export class Patchnotes extends Component {

    render() {
        return (
            <div style={{height:"100%",display:"grid",gridTemplateRows:'auto 1fr auto'}}>
                <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                    <AdministrationMenu active="patchnotes"/>
                </div>
                <div style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Segment>
                        <Header color='blue' as="h2">15/06/2020 - v1.2.06</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Intégration</List.Header>
                                    <List.Description>Intégration du component filtres dans les pages de la section parc</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Component filtre</List.Header>
                                    <List.Description>Création d'un nouveau component de filtrage en dropdown à largeur fixe et indépendante du nombre d'option du filtre</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='bug' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Edition des licences</List.Header>
                                    <List.Description>Résolution d'un bug empéchant la modification des licences</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">14/06/2020 - v1.2.05</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='bug' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modifications des finances</List.Header>
                                    <List.Description>Ajout de la fonctionalité pour les comptes user qui n'y avait pas accès jusque là</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">02/06/2020 - v1.2.04</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='double angle up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modifications des finances</List.Header>
                                    <List.Description>Modification du calcul des finances d'un véhicule : le financement mensuel est maintenant calculé par rapport au prix du véhicule et sa durée de financement</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='double angle up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modifications de la page véhicule</List.Header>
                                    <List.Description>Modification de l'interface d'édition d'un véhicule, séparation de l'édition de la partie technique et de la partie finances</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Ajout d'un élément de contenu</List.Header>
                                    <List.Description>Ajout des durées de financement dans l'onglet contenu du menu administration</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">28/05/2020 - v1.2.03</Header>
                        <List divided relaxed>
                        <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Télechargement des fichiers</List.Header>
                                    <List.Description>Il est maintenant possible de télécharger les documents depuis leur liste dans le menu d'administration</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">27/05/2020 - v1.2.02</Header>
                        <List divided relaxed>
                        <List.Item>
                                <List.Icon name='double angle up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Amélioration du dashboard</List.Header>
                                    <List.Description>Le nouveau dashboard maintenant comprend des indicateurs sur le nombre de documents manquants</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Archivage des accidents</List.Header>
                                    <List.Description>Ajout de la fonction d'archivage des accidents</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">20/05/2020 - v1.2.01</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='double angle up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Amélioration du dashboard</List.Header>
                                    <List.Description>Le nouveau dashboard comprend de nouvelles statistiques et de nouveau indicateurs (répartition des véhicules par volumes et marques, etc...)</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">19/05/2020 - v1.2.00</Header>
                        <List divided relaxed>
                        <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Nouvel écran de connexion</List.Header>
                                    <List.Description>Changement de design de l'écran de connexion</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='cog' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modifications des routes</List.Header>
                                    <List.Description>Changement de la gestion interne des routes pour éviter un rechargement de la page lors de l'affichage du dashboard</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='bug' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Correction de bug : Création de compte</List.Header>
                                    <List.Description>Correction de bug concernant la création de compte, lors d'une création rien ne se passait bien que le compte soit créé</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='bug' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Correction de bug : Suppression de compte</List.Header>
                                    <List.Description>Correction de bug concernant la suppression de compte, lors d'une suppression, le compte était supprimé mais il fallait recharger la page pour le constater</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">18/05/2020 - v1.1.07</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Nouvelle barre de menu laterale</List.Header>
                                    <List.Description>Le dynamisme de la barre précedente était géré en JS, celui de la nouvelle par pur CSS par soucis de performance, amélioration de design, corp de la page élargi</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Visualisation des documents</List.Header>
                                    <List.Description>Ajout d'un onglet administration : "Documents S3" permettant la visualisation des document présent dans le bucket Amazon S3</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
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
                            <List.Item>
                                <List.Icon name='cog' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Déplacement des notes de version</List.Header>
                                    <List.Description>Les notes de versions sont déplacées dans le menu d'administration</List.Description>
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
                                    <List.Description>Ajout d'une fonction d'export du parc de vehicules au format Excel .xlsx (fonction administrateur), actuellement sans filtres ni formatage du fichier en sortie</List.Description>
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
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
  export default wrappedInUserContext = withUserContext(withRouter(Patchnotes));
  