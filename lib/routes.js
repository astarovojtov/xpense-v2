Accounts.onLogin(function() {
  FlowRouter.go('add-expense');
});

Accounts.onLogout(function() {
  FlowRouter.go('home');
}); 

FlowRouter.triggers.enter([function(context, redirect) {
  if (!Meteor.userId()) {
    FlowRouter.go('home');
  }
}])

FlowRouter.route('/', {
  name: 'home',
  action() {
    if (Meteor.userId()) {
      FlowRouter.go('add-expense')
    }
    GAnalytics.pageview();
    BlazeLayout.render('HomeLayout');
  }
});

FlowRouter.route('/add-expense', {
  name: 'add-expense',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('MainLayout', {main: 'AddExpense'});
  }
});

FlowRouter.route('/list', {
  name: 'expenses-list',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('MainLayout', {main: 'ExpensesList'});
  }
});