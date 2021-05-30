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

import FournisseurSchema from '../api/fournisseur/Fournisseur.graphql';
import FournisseurResolvers from '../api/fournisseur/resolvers.js';

import PieceSchema from '../api/piece/Piece.graphql';
import PieceResolvers from '../api/piece/resolvers.js';

import EntretienSchema from '../api/entretien/Entretien.graphql';
import EntretienResolvers from '../api/entretien/resolvers.js';

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

import PayementTimeSchema from '../api/payementTime/PayementTime.graphql';
import PayementTimeResolvers from '../api/payementTime/resolvers.js';

import VehicleArchiveJustificationSchema from '../api/vehicleArchiveJustification/VehicleArchiveJustification.graphql';
import VehicleArchiveJustificationResolvers from '../api/vehicleArchiveJustification/resolvers.js';

import ColorSchema from '../api/color/Color.graphql';
import ColorResolvers from '../api/color/resolvers.js';

import DashboardSchema from '../api/dashboard/Dashboard.graphql';
import DashboardResolvers from '../api/dashboard/resolvers.js';

import DocumentSchema from '../api/document/Document.graphql';
import DocumentResolvers from '../api/document/resolvers.js';

import EnergySchema from '../api/energy/Energy.graphql';
import EnergyResolvers from '../api/energy/resolvers';

import BatimentSchema from '../api/batimentControl/BatimentControl.graphql';
import BatimentResolvers from '../api/batimentControl/resolvers';

import AccidentSchema from '../api/accident/Accident.graphql';
import AccidentResolvers from '../api/accident/resolvers';

import AccCharacteristicSchema from '../api/accCharacteristic/AccCharacteristic.graphql';
import AccCharacteristicResolvers from '../api/accCharacteristic/resolvers';

import AccRoadProfileSchema from '../api/accRoadProfile/AccRoadProfile.graphql';
import AccRoadProfileResolvers from '../api/accRoadProfile/resolvers';

import AccTrackStateSchema from '../api/accTrackState/AccTrackState.graphql';
import AccTrackStateResolvers from '../api/accTrackState/resolvers';

import AccWeatherSchema from '../api/accWeather/AccWeather.graphql';
import AccWeatherResolvers from '../api/accWeather/resolvers';

import AccPlaceSchema from '../api/accPlace/AccPlace.graphql';
import AccPlaceResolvers from '../api/accPlace/resolvers';

import TestSchema from '../api/test/Test.graphql';
import TestResolvers from '../api/test/resolvers.js';

import StoredObjectSchema from '../api/storedObject/StoredObject.graphql';
import StoredObjectResolvers from '../api/storedObject/resolvers.js';

import ExportTemplateSchema from '../api/exportTemplate/ExportTemplate.graphql';
import ExportTemplateResolvers from '../api/exportTemplate/resolvers.js';

import ControlSchema from '../api/control/Control.graphql';
import ControlResolvers from '../api/control/resolvers.js';

import InterventionNatureSchema from '../api/interventionNature/InterventionNature.graphql';
import InterventionNatureResolvers from '../api/interventionNature/resolvers.js';

import LogSchema from '../api/log/Log.graphql';
import LogResolvers from '../api/log/resolvers.js';

// #0531

const typeDefs = [
    UserSchema,
    SocieteSchema,
    VehicleSchema,
    LicenceSchema,
    FournisseurSchema,
    PieceSchema,
    EntretienSchema,
    PlanningSchema,
    VolumeSchema,
    LocationSchema,
    BrandSchema,
    ModelSchema,
    OrganismSchema,
    PayementTimeSchema,
    VehicleArchiveJustificationSchema,
    ColorSchema,
    DashboardSchema,
    DocumentSchema,
    EnergySchema,
    BatimentSchema,
    AccidentSchema,
    AccCharacteristicSchema,
    AccPlaceSchema,
    AccRoadProfileSchema,
    AccWeatherSchema,
    AccTrackStateSchema,
    StoredObjectSchema,
    ExportTemplateSchema,
    ControlSchema,
    InterventionNatureSchema,
    TestSchema
];

const resolvers = merge(
    UserResolvers,
    SocieteResolvers,
    VehicleResolvers,
    LicenceResolvers,
    FournisseurResolvers,
    PieceResolvers,
    EntretienResolvers,
    PlanningResolvers,
    VolumeResolvers,
    LocationResolvers,
    BrandResolvers,
    ModelResolvers,
    OrganismResolvers,
    PayementTimeResolvers,
    VehicleArchiveJustificationResolvers,
    ColorResolvers,
    DashboardResolvers,
    DocumentResolvers,
    EnergyResolvers,
    BatimentResolvers,
    AccidentResolvers,
    AccCharacteristicResolvers,
    AccPlaceResolvers,
    AccRoadProfileResolvers,
    AccWeatherResolvers,
    AccTrackStateResolvers,
    StoredObjectResolvers,
    ExportTemplateResolvers,
    ControlResolvers,
    InterventionNatureResolvers,
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