import { Lib } from '../lib/lib.js';

Template.ExpensesByTags.onCreated(function () {
  let ruler = document.getElementById('ruler')
  this.state = new ReactiveDict();
  
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  });      
});

Template.ExpensesByTags.onRendered( function () {
  
})

Template.ExpensesByTags.helpers({
  
  expenses: () => {
    const instance = Template.instance();
    
//    if (instance.state.get('sortByDate')) {
//      return Expenses.find({}, {sort: {createdAt: -1} }).fetch();  
//    } else if (instance.state.get('sortBySum')) {
//      let data = Expenses.find({}, {sort: {sum: 1} }).fetch();  
//      return data.sort( (a, b) => a.sum - b.sum)
    //} else 
    if ( instance.state.get('month') ) {
      
      let month = moment().month(instance.state.get('month')).format('M')-1 
//Luckily moment().month('Current') returns current month number 
//it works like moment().month() returning current month number       
//so there is no need to do anything with it
      let firstDay = new Date( Lib.daysRange(month).firstDay )
      let lastDay = new Date( Lib.daysRange(month).lastDay )
  
      data = Expenses.find({ createdAt : { $gt: firstDay, $lt: lastDay } }, 
                           { sort: {createdAt: -1}}).fetch()
      return data
          
    } else {
      let month = moment().month();
      let firstDay = new Date( Lib.daysRange(month).firstDay )
      
      return Expenses.find({ createdAt : { $gt: firstDay} }, 
                           { sort: {createdAt: -1}}).fetch()
    }
  },
  
  humanizeDate: function (dateTime) {
    return momentDate(dateTime)
  },
  
  tagsList: (data) => {
   
    let tagsArray = []
    data.forEach( (x) => tagsArray.push( x.tag.toLowerCase() ))
    
    return tagsArray = Array.from(new Set(tagsArray))  
  },
//---------------------------------
//  tagsList and monthList are implemented differently. 
//  The First one takes data from DB query that has already been made
//  Not sure if this method is not making it's own query to DB as data
//  specified from Blaze template as {{#each tag in tagList expenses}}
//  Anyways
//  The Second one makes it's own query to return just months from DB
//---------------------------------
  monthList: () => {

      let data = Expenses.find({}, {fields: {createdAt:1} }).fetch()
            
      let allMonthsInDB = data.map( (x) => moment( x.createdAt ).format('MMMM') )
      
      allMonthsInDB = Array.from(new Set(allMonthsInDB)).reverse()
      return allMonthsInDB

  },
  
  tagsSummary: (data) => {
    const instance = Template.instance();
    let userInput = instance.state.get('tag') || 'all'
    let sortedByTags = {}
    
    if (userInput =='all') {
     sortedByTags[userInput] = data;
    } else {
      
      for (let i=0; i<data.length; i++) {
        let tags = []
        tags[i] = data[i].tag.toLowerCase();
        
        if (!sortedByTags.hasOwnProperty(tags[i])) {
          sortedByTags[tags[i]] = []  
        }
        sortedByTags[tags[i]].push({_id: data[i]._id,
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
    sum = sum.reduce( (sum, current ) => Lib.sumDecimals(sum,current), 0 );
    
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
    let pickedTag = event.target.value;
    instance.state.set('tag', pickedTag)
  },
  
  'change #month'(event, instance) {
    let pickedMonth = event.target.value;
    instance.state.set('month', pickedMonth)
  }
});