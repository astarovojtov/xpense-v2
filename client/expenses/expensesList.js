Template.ExpensesList.onCreated(function () {
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.ExpensesList.helpers({
  expenses: () => { 
    return Expenses.find({});
  }
});