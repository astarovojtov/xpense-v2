import { ReactiveDict } from 'meteor/reactive-dict';

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
//Luckily moment().month('Current') returns current month number 
//it works like moment().month() returning current month number       
//so there is no need to do anything with it
      let firstDay = new Date( daysRange(month).firstDay )
      let lastDay = new Date( daysRange(month).lastDay )
  
      return Expenses.find({ createdAt : { $gt: firstDay, $lt: lastDay } }, 
                           { sort: {createdAt: -1}}).fetch()
    
    } else {
    let month = moment().month() + 1;
    month = month < 10 ? '0' + month : month
    let firstDayOfMonth = '2017-' + month + '-01T00:00:00.000Z'
    //return Expenses.find({}, { sort: {createdAt: -1}}).fetch()
    return Expenses.find({ createdAt : { $gt: new Date(firstDayOfMonth) } }, { sort: {createdAt: -1}}).fetch()
    }
  },
  
  monthList: () => {

      let data = Expenses.find({}, {fields: {createdAt:1} }).fetch()
            
      let allMonthsInDB = data.map( (x) => moment( x.createdAt ).format('MMMM') )
      
      allMonthsInDB = Array.from(new Set(allMonthsInDB)).reverse()
      return allMonthsInDB

  },
  
  humanizeDate: function (dateTime) {
    return momentDate(dateTime)
  },
  
  totalSpendings: (data) => {
    let sum = 0; 
    for (let i=0; i<data.length; i++)
      sum = sumDecimals(sum, data[i].sum)
    return sum
  },
  
  dailySpendings: (data) => {
    let sum = 0; 
    let daysPassed = moment().date();
    for (let i=0; i<data.length; i++)
      sum = sumDecimals(sum, data[i].sum)
    return (sum/daysPassed).toFixed(2)
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
  
  mostFrequentSpending: () => {},
  
  balance: (data) => {
    let sum = 0; 
    for (let i=0; i<data.length; i++)
      sum = sumDecimals(sum, data[i].sum)  
    return (971 - sum).toFixed(2)
  }
  
});

Template.Card.events({ 
  'change #month'(event, instance) {
    let pickedMonth = event.target.value;
    instance.state.set('month', pickedMonth)
  }
});

function sumDecimals(a,b) {
  return +(a + b).toFixed(2)
};

function daysRange(month) {

  let date = new Date();
  let y = date.getFullYear();
  let m = month;
  let currentMonth = m < 10 ? '0' + (m+1) : m+1;
  let firstDay = new Date(y, m, 1);
  let lastDay = new Date(y, m + 1, 0);
  
  firstDay = moment(firstDay).format('DD');
  lastDay = moment(lastDay).format('DD');
  
  firstDay = '2017-' + currentMonth + '-' + firstDay + 'T00:00:00.000Z'
  lastDay = '2017-' + currentMonth + '-' + lastDay + 'T23:59:59.000Z'
  return { currentMonth, firstDay, lastDay }
}