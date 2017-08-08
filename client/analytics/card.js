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
  },
  chart: (data) => {
    
    let filtered = [];
    data.forEach( (x) => filtered.push(x.tag) )
    
    filtered = Array.from(new Set(filtered))
    let result = []; let tags = []; let sums = [];
    
    for (let j=0; j<filtered.length; j++) {
      result[j] = {tag: '', sum: 0};
      for (let i=0; i<data.length; i++) {
        if (data[i].tag == filtered[j]) {
          result[j].tag = data[i].tag
          tags[j] = data[i].tag
          result[j].sum = sumDecimals(result[j].sum, data[i].sum)
          sums[j] = sumDecimals(result[j].sum, data[i].sum)
        }
      }
    }
    
    var ctx = document.getElementById("myChart").getContext('2d');
    
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: tags,//["вода", "сиги", "проезд", "обед", "еда",
                   //"тв", "пивас", "пятница", "вкусняшки", "катя",
                   //"холлс", "мама", "ДР", "кофе", "не помню"],
          datasets: [{
              data: sums,//[9.21, 48.88, 7.15, 62.05, 197.73,
                     //200, 34.69, 117.61, 0.99, 0.93,
                     //5.87, 150, 212.48, 9, 5],
               backgroundColor: ['#33691e', '#e65100', '#f57f17', '#ff6f00', '#827717',
                                 '#0d47a1', '#01579b', '#006064', '#004d40', '#1b5e20',
                                 '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#1a237e']
          }]
      },
      options: {
        legend: {
            display: false,
            labels: {
                fontFamily: 'Roboto',
                fontSize: 14,
              // This more specific font property overrides the global property
                fontColor: 'black'
            }
        }
      }
    });
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

    return result.sort( (a,b) => b.sum - a.sum)
  },
  
  today: (data) => {
    let sum = 0; 
    let today = moment().hours(0).minutes(0)  
      
      //console.log(data[25].createdAt.toString().split(' ')[4])
    for (let i=0; i<data.length; i++) {
      
      if (moment(data[i].createdAt).isAfter(today) ) {
//        console.log(data[i])
        sum = sumDecimals(sum, data[i].sum)  
      }
    }
    return sum
  },
  
  yesterday: (data) => {
    let sum = 0; 
    let today = moment().hours(0).minutes(0)
    let yesterday = moment().hours(0).minutes(0).days(1)
    
    for (let i=0; i<data.length; i++) {  
      if (moment(data[i].createdAt).isBefore(today) && moment(data[i].createdAt).isAfter(yesterday)) {
        sum = sumDecimals(sum, data[i].sum)  
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