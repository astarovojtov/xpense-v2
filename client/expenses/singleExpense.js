import { Lib } from '../lib/lib.js'

Template.SingleExpense.helpers({
  humanizeDate: function(dateTime) {
    return Lib.momentDate(dateTime)
  },
  
  humanizeAuthor: function (_id) {
    let mail = Meteor.user().emails[0].address;
    return mail.slice(0, mail.indexOf(mail.match('@')))
  },
})

Template.SingleExpense.events({
  'blur .update-expense'(event) {
    //event.preventDefault();
    let unchangedDoc = Expenses.findOne(this._id);
    
    const target = event.target.parentNode.children;
    let changedDoc = {
      name: target.name.value,
      sum: parseFloat(target.sum.value.replace(',','.')),
      tag: target.tag.value,
    }
    
    if (Lib.checkChanges(changedDoc, unchangedDoc)) {
      Meteor.call('expenses.update', this._id, changedDoc.name, changedDoc.sum, changedDoc.tag,
        function (error, result) {
          if (error) console.log(error.message)
      })
    }
  },
  
  'click .delete-expense'() {
    Meteor.call('expenses.remove', this._id);
  },
  
  'click .edit-date'(event){
    //event.preventDefault();
    
    const target = event.target;
    const date = Expenses.findOne(this._id).createdAt;
    target.value = moment(date).format("DD MMM YYYY");
    
   // Lib.resize(target, ruler);
    
  },
  
//  'click .edit-author'(event) {
//    Lib.resize(event.target, ruler)
//  },
//  
  'blur .update-date-and-author'(event){

    let unchangedDoc = Expenses.findOne(this._id);
    let initialHours = moment(unchangedDoc.createdAt).hours() <10 ? 
        '0' + moment(unchangedDoc.createdAt).hours() :
        moment(unchangedDoc.createdAt).hours()
    
    initialHours = initialHours < '03' ? '03' : initialHours //timezone offset compensation
    
    let initialMinutes = moment(unchangedDoc.createdAt).minutes() <10 ?
        '0' + moment(unchangedDoc.createdAt).minutes() 
        : moment(unchangedDoc.createdAt).minutes()

    initialMinutes = initialMinutes == '00' ? '01' : initialMinutes
    
    let initialTime = initialHours + ':' + initialMinutes
    
    const target = event.target.parentNode.children;    

    //Local Time Zones poses some difficulties as DB is operating UTC 
    let userDate = new Date(target.createdAt.value + ' ' + initialTime) 
    let changedDoc = {
      createdAt: userDate == 'Invalid Date' ? unchangedDoc.createdAt : userDate,
      author: target.author.value,
    }
    
    if (Lib.checkChanges(changedDoc, unchangedDoc)) {
      Meteor.call('expenses.update-date-and-author', this._id, changedDoc.createdAt, changedDoc.author,
        function (error, result) {
          if (error) console.log(error.message)
      })
    }
    
    target.createdAt.value = Lib.momentDate(changedDoc.createdAt)
  }
  
});

Template.SingleExpense.onRendered( function () {
//  let ruler = ruler || document.getElementById('ruler')
//  this.firstNode.querySelectorAll('.resizable').forEach( (item) => Lib.resize(item, ruler))
//  
})