Template.NewExpense.events({
  'submit .add-expense'(event) {
    event.preventDefault();
    
      Meteor.call('expenses.add', event.target.text.value,
        function (error, result) {
          if (error) console.log(error.message)
      })
    
    event.target.text.value = ''
  },
});