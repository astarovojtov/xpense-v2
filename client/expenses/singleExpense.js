
Template.SingleExpense.helpers({
  humanizeDate: function (dateTime) {
    let humanizedDate = moment(dateTime).fromNow();
    if ( moment().diff(moment(dateTime)) > 1000 * 60 * 60 * 24 * 7)
      return moment(dateTime).format('dddd, MMMM Do YYYY')
    else 
      return humanizedDate
  },
  
  humanizeAuthor: function (_id) {
    let mail = Meteor.user().emails[0].address;
    return mail.slice(0, mail.indexOf(mail.match('@')))
  }
})

Template.SingleExpense.events({
  'blur .update-expense'(event) {
    event.preventDefault();
    let unchangedDoc = Expenses.findOne(this._id);
    
    const target = event.target.parentNode.children;
    let changedDoc = {
      name: target.name.value,
      sum: parseFloat(target.sum.value.replace(',','.')),
      tag: target.tag.value,
      createdAt: target.ass.value
    }
    
    console.log(' singleExpense.js reporting ' + changedDoc.createdAt)
    
    if (checkChanges(changedDoc, unchangedDoc)) {
      Meteor.call('expenses.update', this._id, changedDoc.name, changedDoc.sum, changedDoc.tag, changedDoc.createdAt,
        function (error, result) {
          if (error) console.log(error.message)
      })
    }
  },
  
  'click .delete-expense'() {
    Meteor.call('expenses.remove', this._id);
  }
  
  // TO DO edit dates
});

function checkChanges (obj1, obj2) {
  let arr = []
  for (prop in obj1) {    
      arr.push(obj2.hasOwnProperty(prop) && obj1[prop] != obj2[prop])
  }
  
  return arr.some( (x) => { return x == true }) 
}