import { ReactiveDict } from 'meteor/reactive-dict';

Template.ExpensesList.onCreated(function () {
  this.state = new ReactiveDict();
  
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
  

});

Template.ExpensesList.helpers({
  expenses: () => { 
    const instance = Template.instance();
    
    if (instance.state.get('sortByDate')) {
      return Expenses.find({}, {sort: {createdAt: -1} });  
    } else if (instance.state.get('sortByTag')) {
      return Expenses.find({}, {sort: {tag: 1} });  
    } else if (instance.state.get('sortBySum')) {
      return Expenses.find({}, {sort: {tag: -1} });  
    } else {
      return Expenses.find({});
    }
  }
});

Template.ExpensesList.events({
  'click .date'(event, instance) {
    instance.state.get('sortByDate') ? instance.state.set('sortByDate', false) : instance.state.set('sortByDate', true)  
  },
  
   'click .tag'(event, instance) {
    instance.state.get('sortByTag') ? instance.state.set('sortByTag', false) : instance.state.set('sortByTag', true) 
  },
  
   'click .sum'(event, instance) {
    instance.state.get('sortBySum') ? instance.state.set('sortBySum', false) : instance.state.set('sortBySum', true) 
  }
});