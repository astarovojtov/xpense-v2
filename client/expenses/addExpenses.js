Template.AddExpense.onCreated(function () {
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.AddExpense.helpers({
  expenses: () => { 
    return Expenses.find({}, {sort: {createdAt: -1}, limit: 3});
  }
});

AutoForm.hooks({
  insertExpenseForm: {
    before: {
      insert: function (doc) {
        
        let sum = doc.text.match(/\d+(?:[\.,]\d+)?/)[0];
    
        let name_tag_arr = doc.text.split(sum);
        let name = name_tag_arr[0].trim();
        let tag = name_tag_arr[1].trim();
        sum = parseFloat(sum.replace(',','.'));
        
        doc.name = name;
        doc.sum = sum;
        doc.tag = tag;
        return doc;
      }
    }
  }
});