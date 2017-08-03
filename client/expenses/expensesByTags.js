import { ReactiveDict } from 'meteor/reactive-dict';

Template.ExpensesByTags.onCreated(function () {
  this.state = new ReactiveDict();
  
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.ExpensesByTags.helpers({
  expenses: () => {
    
//    let month = moment().month() + 1;
//    month = month < 10 ? '0' + month : month
//    
//    let firstDayOfMonth = '2017-' + month + '-01T00:00:00.000Z'
    //return Expenses.find({}, { sort: {createdAt: -1}}).fetch()

    const instance = Template.instance();
    
    if (instance.state.get('sortByDate')) {
      return Expenses.find({}, {sort: {createdAt: -1} }).fetch();  
    } else if (instance.state.get('sortBySum')) {
      let data = Expenses.find({}, {sort: {sum: 1} }).fetch();  
      return data.sort( (a, b) => a.sum - b.sum)
    } else if ( instance.state.get('month') == 'Jul' ) {
      
      let month = moment().month()-1;
      let firstDay = new Date( daysRange(month).firstDay )
      let lastDay = new Date( daysRange(month).lastDay )
      

      return Expenses.find({ createdAt : { $gt: firstDay, $lt: lastDay } }, 
                           { sort: {createdAt: -1}}).fetch()
    
    } else {
      let month = moment().month();
      let firstDay = new Date( daysRange(month).firstDay )
      
      return Expenses.find({ createdAt : { $gt: firstDay} }, 
                           { sort: {createdAt: -1}}).fetch()
      //return Expenses.find({}).fetch();
    }
  },
  
  humanizeDate: function (dateTime) {
    return momentDate(dateTime)
  },
  
  tagsList: (data) => {
   
    let tagsArray = []
    data.forEach( (x) => tagsArray.push(x.tag) )
    
    return tagsArray = Array.from(new Set(tagsArray))  
  },
  
  tagsSummary: (data) => {
    const instance = Template.instance();
    let userInput = instance.state.get('tag') || 'all'
    let sortedByTags = {}
    
    if (userInput =='all') {
     sortedByTags[userInput] = data;
    } else {
      
      for (let i=0; i<data.length; i++) {
        if (!sortedByTags.hasOwnProperty(data[i].tag)) {
          sortedByTags[data[i].tag] = []  
        }
        sortedByTags[data[i].tag].push({_id: data[i]._id,
                                        name: data[i].name,
                                        tag: data[i].tag,
                                        sum: data[i].sum,
                                        createdAt: data[i].createdAt,
                                        text: data[i].text,
                                        author: data[i].author,
                                        lastUpdatedAt: data[i].lastUpdatedAt
                                       });
      }
      
    } 
    
    let sum = sortedByTags[userInput].map( (x) => x.sum )
    sum = sum.reduce( (sum, current ) => sumDecimals(sum,current) );
    
    let count = sortedByTags[userInput].length;
    
    let average = (sum/count).toFixed(2)
    return {array: sortedByTags[userInput], sum: sum, average: average, count: count}
  }

});

Template.ExpensesByTags.events({ 
  'click .date'(event, instance) {
    instance.state.get('sortByDate') ? instance.state.set('sortByDate', false) : instance.state.set('sortByDate', true)  
  },
  
  'click .sum'(event, instance) {
    instance.state.get('sortBySum') ? instance.state.set('sortBySum', false) : instance.state.set('sortBySum', true) 
  },
  
  'change #tag'(event, instance) {
    event.preventDefault();
    var userInput = event.target.value;
    instance.state.set('tag', userInput)
  },
  
  'click .month'(event, instance) {
    event.preventDefault();
    var userInput = event.target.value;
    instance.state.set('month', 'Jul')
  }
});

function sumDecimals(a,b) {
  return +(a + b).toFixed(2)
};

function daysRange(month) {
  //let month = moment().month() + 1;

  
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