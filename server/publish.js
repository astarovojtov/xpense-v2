Meteor.publish('expenses', function() {
  return Expenses.find({author: this.userId});
})