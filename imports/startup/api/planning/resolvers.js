import Entretiens from '../entretien/entretiens';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        entretiensPopulatedMonth(obj,{year,month},{user}){
            month=month-1;
            let todayDate = new Date();
            let date = new Date(year, month, 1);
            let days = [];
            let today = null;
            let entretiens = Entretiens.find().fetch().filter(e=>moment(e.occurenceDate,"DD/MM/YYYY").isSame(date, 'month'))
            entretiens.forEach((e,i) => {
                if(e.user != null && e.user.length > 0){
                    e.user = Meteor.users.findOne({_id:e.user});
                }else{
                    e.user = {_id:"",firstname:"",lastname:""};
                }
            });
            while (date.getMonth() === month) {
                (date.getDate() == todayDate.getDate() && date.getMonth() == todayDate.getMonth() && date.getFullYear() == todayDate.getFullYear() ? today = true : today = false)
                let day = {
                    entretiens:entretiens.filter(p => moment(p.occurenceDate,"DD/MM/YYYY").date() == date.getDate()),
                    day:date.getDate(),
                    month:date.getMonth(),
                    year:date.getFullYear(),
                    dow: date.getDay() === 0 ? 7 : date.getDay(),
                    today:today
                }
                days.push(day);
                date.setDate(date.getDate() + 1);
            }
            return days;
        },
        entretiensPopulatedMonthByUser(obj,{year,month},{user}){
            month=month-1;
            let todayDate = new Date();
            let date = new Date(year, month, 1);
            let days = [];
            let today = null;
            let userFull = Meteor.users.findOne({_id:user._id});
            let entretiens = Entretiens.find({societe:userFull.settings.visibility}).fetch().filter(e=>moment(e.occurenceDate,"DD/MM/YYYY").isSame(date, 'month'))
            entretiens.forEach((e,i) => {
                if(e.user != null && e.user.length > 0){
                    e.user = Meteor.users.findOne({_id:e.user});
                }else{
                    e.user = {_id:"",firstname:"",lastname:""};
                }
            });
            while (date.getMonth() === month) {
                (date.getDate() == todayDate.getDate() && date.getMonth() == todayDate.getMonth() && date.getFullYear() == todayDate.getFullYear() ? today = true : today = false)
                let day = {
                    entretiens:entretiens.filter(p => moment(p.occurenceDate,"DD/MM/YYYY").date() == date.getDate()),
                    day:date.getDate(),
                    month:date.getMonth(),
                    year:date.getFullYear(),
                    dow: date.getDay() === 0 ? 7 : date.getDay(),
                    today:today
                }
                days.push(day);
                date.setDate(date.getDate() + 1);
            }
            return days;
        }
    }
}