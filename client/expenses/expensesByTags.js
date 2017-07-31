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
    const instance = Template.instance();
    if (instance.state.get('sortByDate')) {
      return Expenses.find({}, {sort: {createdAt: -1} }).fetch();  
    } else if (instance.state.get('sortBySum')) {
      return Expenses.find({}, {sort: {tag: -1} }).fetch();  
    } else {
      return Expenses.find({}).fetch();
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

    let average = (sum/sortedByTags[userInput].length).toFixed(2)
    
    return {array: sortedByTags[userInput], sum: sum, average: average}
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
  }
});

function sumDecimals(a,b) {
  return +(a + b).toFixed(2)
};