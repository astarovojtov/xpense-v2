Meteor.publish('expenses', function() {
  return Expenses.find({author: this.userId});
})

Meteor.publish('something', function() {
  return 'I came from the server'
})