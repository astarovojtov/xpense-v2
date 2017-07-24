Template.SingleExpense.helpers({
  humanizeDate: function (dateTime) {
    return momentDate(dateTime)
  },
  
  humanizeAuthor: function (_id) {
    let mail = Meteor.user().emails[0].address;
    return mail.slice(0, mail.indexOf(mail.match('@')))
  },
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
    }
    
    if (checkChanges(changedDoc, unchangedDoc)) {
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
    event.preventDefault();
    
    const target = event.target;
    const date = Expenses.findOne(this._id).createdAt;
    target.value = moment(date).format("DD MMM YYYY");
  },
  
  'blur .update-date-and-author'(event){
    event.preventDefault();
    let unchangedDoc = Expenses.findOne(this._id);
    
    const target = event.target.parentNode.children;
    const userDate = new Date(target.createdAt.value)
    
    let changedDoc = {
      createdAt: userDate == 'Invalid Date' ? unchangedDoc.createdAt : userDate,
      author: target.author.value,
    }
    
    if (checkChanges(changedDoc, unchangedDoc)) {
      Meteor.call('expenses.update-date-and-author', this._id, changedDoc.createdAt, changedDoc.author,
        function (error, result) {
          if (error) console.log(error.message)
      })
    }
    
   target.createdAt.value = momentDate(changedDoc.createdAt)
  }
  
});

Template.SingleExpense.onRendered( function () {
  let resizableElements = document.querySelectorAll('.resizable');
  
  resizableElements.forEach( (item) => { resizable(item, 6) })  
    
})

function checkChanges (obj1, obj2) {
  let arr = []
  for (prop in obj1) {    
      arr.push(obj2.hasOwnProperty(prop) && obj1[prop] != obj2[prop])
  }
  
  return arr.some( (x) => { return x == true }) 
}

function momentDate (dateTime) {
  let humanizedDate = moment(dateTime).fromNow();
  if ( moment().diff(moment(dateTime)) > 1000 * 60 * 60 * 24 * 7)
    return moment(dateTime).format('DD MMM YYYY')
  else 
    return humanizedDate
}

function resizable (el, factor) {
  var int = Number(factor) || 7.7;
  
  function resize() {
    el.style.width = (2 + (el.value.length+1) * int) + 'px'; 
  }
  
  var e = 'keyup,keypress,focus,blur,change'.split(',');
  for (var i in e) 
    el.addEventListener(e[i], resize, false);
  resize();
}