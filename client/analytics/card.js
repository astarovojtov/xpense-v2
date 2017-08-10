import { ReactiveDict } from 'meteor/reactive-dict';
import { Lib } from '../lib/lib.js';

Template.Card.onCreated(function () {
  this.state = new ReactiveDict();
  
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.Card.helpers({
  expenses: () => {
    
    const instance = Template.instance();
    
    if ( instance.state.get('month') ) { 
      let month = moment().month(instance.state.get('month')).format('M')-1 
      let firstDay = new Date( Lib.daysRange(month).firstDay )
      let lastDay = new Date( Lib.daysRange(month).lastDay )
  
      return Expenses.find({ createdAt : { $gt: firstDay, $lt: lastDay } }, 
                           { sort: {createdAt: -1}}).fetch()
    
    } else {
    let month = moment().month() + 1;
    month = month < 10 ? '0' + month : month
    let firstDayOfMonth = '2017-' + month + '-01T00:00:00.000Z'

    return Expenses.find({ createdAt : { $gt: new Date(firstDayOfMonth) } }, { sort: {createdAt: -1}}).fetch()
    }
  },
  
  monthList: () => {

    let data = Expenses.find({}, {fields: {createdAt:1} }).fetch()        
    let allMonthsInDB = data.map( (x) => moment( x.createdAt ).format('MMMM') )
      
    allMonthsInDB = Array.from(new Set(allMonthsInDB)).reverse()
    return allMonthsInDB

  },
  
  totalSpendings: (data) => {
    let sum = Lib.arraySum(data)
    
    let daysPassed = moment().date()
    let daily = (sum/daysPassed).toFixed(2)
    let balance = (971 - sum).toFixed(2)
    
    return { overall: sum, daily: daily, balance: balance }
  },
  
  
  highestSpending: (data) => {
    let max = 0;
    let expense = '';
    for (let i=0; i<data.length; i++) 
      if ( data[i].sum > max ) {
        max = data[i].sum
        expense = data[i].name
    }
    return [{max, expense}]
  },
  
  today: (data) => {
    let sum = 0; 
    let today = moment().hours(0).minutes(0)  
      
    for (let i=0; i<data.length; i++) {
      if (moment(data[i].createdAt).isAfter(today) ) {
        sum = Lib.sumDecimals(sum, data[i].sum)  
      }
    }
    return sum
  },
  
  yesterday: (data) => {
    let sum = 0; 
    let today = moment().hours(0).minutes(0)
    let yesterday = moment().hours(0).minutes(0).subtract(1, "days");
    
    for (let i=0; i<data.length; i++) {  
      if (moment(data[i].createdAt).isBefore(today) && moment(data[i].createdAt).isAfter(yesterday)) {
        sum = Lib.sumDecimals(sum, data[i].sum)  
      }
    }
    return sum
  }
  
});

Template.Card.events({ 
  'change #month'(event, instance) {
    let pickedMonth = event.target.value;
    instance.state.set('month', pickedMonth)
  }
});