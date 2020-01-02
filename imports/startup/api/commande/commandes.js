import { Mongo } from 'meteor/mongo';

const Commandes = new Mongo.Collection("commandes");

export default Commandes;
