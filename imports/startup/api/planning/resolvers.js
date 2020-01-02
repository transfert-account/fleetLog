import Entretiens from '../entretien/entretiens';
import Vehicles from '../vehicle/vehicles';
import Pieces from '../piece/pieces';
import Societes from '../societe/societes';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        entretiensPopulatedMonth(obj,{year,month},{user}){
            month=month-1;
            let todayDate = new Date();
            let date = new Date(year, month, 1);
            let days = [];
            let today = null;
            const entretiens = Entretiens.find({occurenceYear:year,occurenceMonth:month}).fetch()
            while (date.getMonth() === month) {
                (date.getDate() == todayDate.getDate() && date.getMonth() == todayDate.getMonth() && date.getFullYear() == todayDate.getFullYear() ? today = true : today = false)
                let day = {
                    entretiens:entretiens.filter(p => p.occurenceDay == date.getDate()),
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
            console.log(user)
            month=month-1;
            let todayDate = new Date();
            let date = new Date(year, month, 1);
            let days = [];
            let today = null;
            const entretiens = Entretiens.find({occurenceYear:year,occurenceMonth:month,user:user._id}).fetch()
            while (date.getMonth() === month) {
                (date.getDate() == todayDate.getDate() && date.getMonth() == todayDate.getMonth() && date.getFullYear() == todayDate.getFullYear() ? today = true : today = false)
                let day = {
                    entretiens:entretiens.filter(p => p.occurenceDay == date.getDate()),
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