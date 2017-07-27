import { ReactiveDict } from 'meteor/reactive-dict';

Template.Card.onCreated(function () {
  this.data = new ReactiveDict();
  
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.Card.helpers({
  expenses: () => {
    return Expenses.find({}).fetch()
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
    let max = -99;
    let expense = '';
    for (let i=0; i<data.length; i++) 
      if ( data[i].sum > max ) {
        max = data[i].sum
        expense = data[i].name
    }
    return [{max, expense}]
  },
  
  mostFrequentSpending: (data) => {
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
      if (x.count == maxCount) 
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
          result[j].count = maxCount
        }
      }
    }
    return result
  }
  
});

function sumDecimals(a,b) {
  return +(a + b).toFixed(2)
}