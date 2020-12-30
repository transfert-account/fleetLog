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
                <div className="patchnote-block" style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                <Segment>
                        <Header color='blue' as="h2">13/12/2020 - v1.3.0.2</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='bug' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Correction Export Excel</List.Header>
                                    <List.Description>Correction d'un bug empéchant le chargement des véhicules du parc dans la section Export Excel</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">13/12/2020 - v1.3.0.1</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='angle double up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Chargement du tableau des véhicules</List.Header>
                                    <List.Description>La page des véhicules charge les 16 premiers véhicules avant de charger le reste de manière à ne pas bloquer le client le temps du chargement de la liste complète</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">25/10/2020 - v1.3.0</Header>
                        <List divided relaxed>
                        <List.Item>
                                <List.Icon name='angle double up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Vignettes d'aperçu sur planning</List.Header>
                                    <List.Description>Ajout de label indiquant le nombre de lignes dans les tableau même lorsqu'il ne sont pas visible. Ajout de vignette identique sur les case de chaque date indiquant les entretiens plannifié par soi même et au total</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Refonte graphique du planning</List.Header>
                                    <List.Description>Refonte graphique en flat du planning, plus compact, tableau des entretiens plus large.</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Export Excel paramétrables</List.Header>
                                    <List.Description>Les filtres disponibles sur les tableaux des véhicules et des entretiens sont désormais également disponible pour filtrer le contenu des exports Excel</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Export Excel des entretiens</List.Header>
                                    <List.Description>Il est maintenant possible d'exporter les entretiens du parc au format .xlsx dans la section Administration/Exports.</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Génération automatique des entretiens préventifs</List.Header>
                                    <List.Description>Les contrôles obligatoire étant dépassé leur seuil d'alerte génère un entretien préventif. Cette opération récurente s'execute toute les 24 heures à 03:00 du matin</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Différenciation des entretiens curatif et préventif</List.Header>
                                    <List.Description>Les entretiens créés à partir un d'un contrôle sont considéré comme préventifs, ceux créés manuellement sont considéré comme curatif, la distinction est affiché dans le tableau des entretiens</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Création d'entretien sur la base d'un contrôle obligatoire</List.Header>
                                    <List.Description>Il est maintenant possible de créer un entretiens depuis un contrôle obligatoire, l'entretien crée reste lié au contrôle et est accessible depuis le tableau des contrôles</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='wrench' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modification des filtres</List.Header>
                                    <List.Description>Les filtres ont été modifié sur toute l'application de manière à pouvoir en accumuler plus, de plus un bouton permetant leur réinitialisation à été ajouté</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Ajout de contrôles obligatoire sur un véhicule</List.Header>
                                    <List.Description>Il est maintenant possible d'ajouter un équipements à contrôle obligatoire sur un véhicule sans qu'il soit présent dans la liste</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='double angle up' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Affichage des contrôles obligatoire</List.Header>
                                    <List.Description>Seul les véhicules ayant des équipements à contrôles obligatoires équipés sont visibles</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modification graphique du menu latéral</List.Header>
                                    <List.Description>Les liens sont moins haut, la capacité totale du menu est augmenté</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='bug' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modification des conditions de suppréssion d'un contrôle</List.Header>
                                    <List.Description>Les contrôles ne peuvent plus être supprimés si ils sont rattaché à un ou plusieurs véhicules</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='wrench' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Formulaire de création d'un contrôle plus restrictif</List.Header>
                                    <List.Description>Le bouton créer est désormais désactivé lorsque les informations du contrôle sont incomplètes ou incohérentes</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Ajout de la modal de mise à jour de contrôle d'équipement</List.Header>
                                    <List.Description>La fonction était inaccessible jusque là</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Ajout de la modal de suppression de contrôle d'équipement</List.Header>
                                    <List.Description>La fonction était inaccessible jusque là</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Status de véhicule "En panne" et "En vente"</List.Header>
                                    <List.Description>Il est maintenant possible de noter les véhicules comme étant "en panne" et "en vente"</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Ajout de labels pour la vente, la panne et le prêt dans le tableau véhicules</List.Header>
                                    <List.Description>Ajout de 3 labels dans une nouvelle colone "Spécificité" indiquant si le véhicule est en vente, en panne ou en prêt (la société cible du prêt est visible au survol de la souris)</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Fusion des colones "Modèle", "Marque" et "Energie"</List.Header>
                                    <List.Description>Les colones "Modèle", "Marque" et "Energie" ont fusionner en une seule pour un gain de place</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Changement graphique des actions de véhicules, de locations et d'entretiens</List.Header>
                                    <List.Description>Dans les pages de details d'un véhicule, d'une location, et d'un entretien, les bouttons d'actions en haut à droite de la page ont été modifié pour une présentation plus intuitive et agréable</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Refonte complète du Dashboard</List.Header>
                                    <List.Description>Le dashboard à été repensé pour pouvoir gagner en lisibilité. A l'exception des KPI principaux, les données dont maintenant disponibles dans des onglets plus aéré que précedement, (tous les chiffres dans les labels colorés indiquent leur signification au survol de la souris)</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">19/06/2020 - v1.2.07</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Refonte de la page locations</List.Header>
                                    <List.Description>La page locations répartie désormais les differentes catégories d'informations en onglets, differentes améliorations graphique et d'érgonomie ont également été apportées</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Refonte de la page véhicule</List.Header>
                                    <List.Description>La page véhicule répartie désormais les differentes catégories d'informations en onglets, differentes améliorations graphique et d'érgonomie ont également été apportées</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='plus' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Véhicules : informations de financement manquantes</List.Header>
                                    <List.Description>L'absence ou l'incomplétude des données de financement d'un véhicule est affiché dans le tableau des véhicules, il est possible de filter selon ce critère</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='wrench' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Modification : Création de véhicule</List.Header>
                                    <List.Description>Les informations relative au financement d'un véhicule ne sont plus nécessaire à la création d'un véhicule</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Intégration</List.Header>
                                    <List.Description>Intégration du component filtre dans les pages Entretiens, Batiments et Accidentologie</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Segment>
                    <Segment>
                        <Header color='blue' as="h2">15/06/2020 - v1.2.06</Header>
                        <List divided relaxed>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Intégration</List.Header>
                                    <List.Description>Intégration du component filtre dans les pages de la section parc</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='paint brush' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>Intégration</List.Header>
                                    <List.Description>La taille de certain élément graphique à été légérement revue à la baisse pour s'adapter à de plus petites résolutions d'écran</List.Description>
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
  