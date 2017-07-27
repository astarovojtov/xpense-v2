Template.AnalyticsLayout.onCreated(function () {
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.AnalyticsLayout.helpers({
  expenses: () => { 
    return Expenses.find({})
  }
});