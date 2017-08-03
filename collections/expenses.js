Expenses = new Mongo.Collection('expenses');
SimpleSchema.debug = true;

Expenses.allow({
  insert: function (userId, doc) {
    return !!userId;
  },
  update: function (userId, doc) {
    return !!userId;
  },
});

ExpenseSchema = new SimpleSchema({
  text: {
    type: String,
    label: 'Text'
  },
  name: {
    type: String,
    label: 'Name',
    optional: true,
    autoform: { type:"hidden" }
  },
  sum: {
    type: Number,
    decimal: true,
    label: 'Sum',
    optional: true,
    autoform: { type:"hidden" }
  },
  tag: {
    type: String,
    label: 'Tag',
    optional: true,
    autoform: { type:"hidden" }
  },
  author: {
    type: String,
    label: 'Author',
    autoValue: function() {
      return this.userId
    },
    autoform: { type:"hidden" }
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
//      } else if (this.isUpsert) {
//        return {$setOnInsert: new Date()};
//      } else {
//        this.unset();  // Prevent user from supplying their own value
      }
    },
    autoform: { type:"hidden" },
  }
});

Meteor.methods({
  'expenses.add'(text, name, sum, tag) {
//        let sum = text.match(/\d+(?:[\.,]\d+)?(?:[\+\-\*\/]\d+(?:[\.,]\d+)?)*/)[0];
//        
//        //let sum = text.match(/\d+(?:[\.,]\d+)?/)[0];
//    
//        let name_tag_arr = text.split(sum);
//        let name = name_tag_arr[0].trim();
//        let tag = name_tag_arr[1].trim();
//        tag = tag == '' ? name : tag
//
//        if (sum.match(/[\+\-\*\/]/)) {
//            sum.toString().replace(/,/g,'.')
//            sum = parseFloat(eval(sum).toFixed(2))
//          if (typeof(sum) !== 'number')
//            sum = 0 
//        } 
//        sum = parseFloat(sum.toString().replace(',','.'));
            
    Expenses.insert({
      text, name, sum, tag,
      author: Meteor.userId(),
      createdAt: new Date(),
    })
  },
  
  'expenses.update'(_id, name, sum, tag, createdAt, author) {
    const expense = Expenses.findOne(_id);
    let res = Expenses.update(_id, { $set: { name: name, sum: sum, tag: tag, createdAt: createdAt, author: author } });
    return res
  },
  'expenses.update-date-and-author'(_id, createdAt, author) {
    const expense = Expenses.findOne(_id);
    let res = Expenses.update(_id, { $set: { createdAt: createdAt, author: author } });
    return res
  },
  'expenses.remove'(_id) {

    const expense = Expenses.findOne(_id);
      Expenses.remove(_id);
  },
  
})

Expenses.attachSchema( ExpenseSchema );