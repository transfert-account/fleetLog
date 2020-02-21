
import { ApolloServer, gql } from 'apollo-server-express'
import { WebApp } from 'meteor/webapp'
import { getUser } from 'meteor/apollo'
import merge from 'lodash/merge';

import UserSchema from '../api/user/User.graphql';
import UserResolvers from '../api/user/resolvers.js';

import SocieteSchema from '../api/societe/Societe.graphql';
import SocieteResolvers from '../api/societe/resolvers.js';

import VehicleSchema from '../api/vehicle/Vehicle.graphql';
import VehicleResolvers from '../api/vehicle/resolvers.js';

import LicenceSchema from '../api/licence/Licence.graphql';
import LicenceResolvers from '../api/licence/resolvers.js';

import EquipementDescriptionSchema from '../api/equipementDescription/EquipementDescription.graphql';
import EquipementDescriptionResolvers from '../api/equipementDescription/resolvers.js';

import EquipementSchema from '../api/equipement/Equipement.graphql';
import EquipementResolvers from '../api/equipement/resolvers.js';

import FournisseurSchema from '../api/fournisseur/Fournisseur.graphql';
import FournisseurResolvers from '../api/fournisseur/resolvers.js';

import PieceSchema from '../api/piece/Piece.graphql';
import PieceResolvers from '../api/piece/resolvers.js';

import EntretienSchema from '../api/entretien/Entretien.graphql';
import EntretienResolvers from '../api/entretien/resolvers.js';

import CommandeSchema from '../api/commande/Commande.graphql';
import CommandeResolvers from '../api/commande/resolvers.js';

import PlanningSchema from '../api/planning/Planning.graphql';
import PlanningResolvers from '../api/planning/resolvers.js';

import VolumeSchema from '../api/volume/Volume.graphql';
import VolumeResolvers from '../api/volume/resolvers.js';

import LocationSchema from '../api/location/Location.graphql';
import LocationResolvers from '../api/location/resolvers.js';

import BrandSchema from '../api/brand/Brand.graphql';
import BrandResolvers from '../api/brand/resolvers.js';

import ModelSchema from '../api/model/Model.graphql';
import ModelResolvers from '../api/model/resolvers.js';

import OrganismSchema from '../api/organism/Organism.graphql';
import OrganismResolvers from '../api/organism/resolvers.js';

import ColorSchema from '../api/color/Color.graphql';
import ColorResolvers from '../api/color/resolvers.js';

import TestSchema from '../api/test/Test.graphql';
import TestResolvers from '../api/test/resolvers.js';

// #0240

const typeDefs = [
    UserSchema,
    SocieteSchema,
    VehicleSchema,
    EquipementDescriptionSchema,
    EquipementSchema,
    LicenceSchema,
    FournisseurSchema,
    PieceSchema,
    EntretienSchema,
    CommandeSchema,
    PlanningSchema,
    VolumeSchema,
    LocationSchema,
    BrandSchema,
    ModelSchema,
    OrganismSchema,
    ColorSchema,
    TestSchema
];

const resolvers = merge(
    UserResolvers,
    SocieteResolvers,
    VehicleResolvers,
    EquipementDescriptionResolvers,
    EquipementResolvers,
    LicenceResolvers,
    FournisseurResolvers,
    PieceResolvers,
    EntretienResolvers,
    CommandeResolvers,
    PlanningResolvers,
    VolumeResolvers,
    LocationResolvers,
    BrandResolvers,
    ModelResolvers,
    OrganismResolvers,
    ColorResolvers,
    TestResolvers
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers["meteor-login-token"] || '';
        const user = await getUser(token);
        return { user };
    }
})

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

server.applyMiddleware({
    app: WebApp.connectHandlers,
    path: '/graphql',
    cors: corsOptions
})

WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    return next();
});
  
WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
        res.end()
    }
})