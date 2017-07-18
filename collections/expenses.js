Expenses = new Mongo.Collection('expenses');

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
    autoValue: function () {
      return new Date();
    },
    autoform: { type:"hidden" }
  },
  lastUpdatedAt: {
    type: Date,
    label: 'Last Updated At',
    autoValue: function () {
      return new Date();
    },
    autoform: { type:"hidden" }
  }
});

Meteor.methods({
  'expenses.update'(_id, name, sum, tag) {
    const expense = Expenses.findOne(_id);
    let res = Expenses.update(_id, { $set: { name: name, sum: sum, tag: tag } });
    return res
  },
  
  'expenses.remove'(_id) {

    const expense = Expenses.findOne(_id);
      Expenses.remove(_id);
  },
  
})

Expenses.attachSchema( ExpenseSchema );