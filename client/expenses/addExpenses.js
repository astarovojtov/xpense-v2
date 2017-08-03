Template.AddExpense.onCreated(function () {
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.AddExpense.helpers({
  expenses: () => { 
    let expensesList = Expenses.find({}, { sort: {createdAt: -1}, limit: 5 })

    return expensesList
  }
});

//AutoForm.hooks({
//  insertExpenseForm: {
//    before: {
//      insert: function (doc) {
//        
//        let sum = doc.text.match(/\d+(?:[\.,]\d+)?/)[0];
//    
//        let name_tag_arr = doc.text.split(sum);
//        let name = name_tag_arr[0].trim();
//        let tag = name_tag_arr[1].trim();
//        sum = parseFloat(sum.replace(',','.'));
//        
//        doc.name = name;
//        doc.sum = sum;
//        if (tag == '')
//          doc.tag = name;
//        else 
//          doc.tag = tag;
//        return doc;
//      }
//    }
//  }
//});