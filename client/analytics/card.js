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
    let month = moment().month() + 1;
    month = month < 10 ? '0' + month : month
    let firstDayOfMonth = '2017-' + month + '-01T00:00:00.000Z'
    //return Expenses.find({}, { sort: {createdAt: -1}}).fetch()
    return Expenses.find({ createdAt : { $gt: new Date(firstDayOfMonth) } }, { sort: {createdAt: -1}}).fetch()
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
  
  mostFrequentSpending: (data) => {
    
    console.time()
    
    let maxCount = 0;
    for (let j=0; j<data.length; j++) {
      data[j].count = 0
      for (let i=0; i<data.length; i++) {
        if (data[j].tag == data[i].tag) {
          data[j].count += 1
        }
      }
      if (data[j].count > maxCount)
        maxCount = data[j].count
    }
    
    let filtered = []; let i=0;
    data.forEach( (x) => {
      //if (x.count == maxCount) 
        filtered.push(x.tag)
      })
    
    filtered = Array.from(new Set(filtered))
    let result = [];
    
    for (let j=0; j<filtered.length; j++) {
      result[j] = {tag: '', sum: 0};
      for (let i=0; i<data.length; i++) {
        if (data[i].tag == filtered[j]) {
          result[j].tag = data[i].tag
          result[j].sum = sumDecimals(result[j].sum, data[i].sum)
          result[j].count = data[i].count
          //result[j].count = maxCount
        }
      }
    }
    
    console.timeEnd()
    
    return result
  },
  
  balance: (data) => {
    let sum = 0; 
    for (let i=0; i<data.length; i++)
      sum = sumDecimals(sum, data[i].sum)  
    return (971 - sum).toFixed(2)
  }
  
});

Template.Card.events({ 

});

function sumDecimals(a,b) {
  return +(a + b).toFixed(2)
};

function momentDate (dateTime) {
  let humanizedDate = moment(dateTime).fromNow();
  if ( moment().diff(moment(dateTime)) > 1000 * 60 * 60 * 24 * 7)
    return moment(dateTime).format('DD MMM YYYY')
  else 
    return humanizedDate
};