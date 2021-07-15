import { Mongo } from 'meteor/mongo';

const JobLogs = new Mongo.Collection("jobLogs");

export default JobLogs;
