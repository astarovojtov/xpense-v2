Template.NewExpense.events({
  'submit .add-expense'(event) {
    event.preventDefault();

    let text = event.target.text.value;

// RegExp matches either single integer or decimal digits either math operation on them     
    let sum = text.match(/\d+(?:[\.,]\d+)?(?:\s?[\+\-\*\/]\s?\d+(?:[\.,]\d+)?)*/)[0];
        
        //let sum = text.match(/\d+(?:[\.,]\d+)?/)[0];
    
    let name_tag_arr = text.split(sum);
    let name = name_tag_arr[0].trim();
    let tag = name_tag_arr[1].trim();
    tag = tag == '' ? name : tag // if there is no tag create tag with provided name

    if (sum.match(/[\+\-\*\/]/)) {
        sum = sum.toString().replace(/,/g,'.')
        sum = parseFloat(eval(sum).toFixed(2))
      if (typeof(sum) !== 'number')
        sum = 0 
    } else {
      sum = parseFloat(sum.toString().replace(',','.'));
    }
    
    Meteor.call('expenses.add', text, name, sum, tag,
      function (error, result) {
        if (error) console.log(error.message)
    })
    
    event.target.text.value = ''
  }
  
  //TO DO add form validation to show user what is he doing wrong if any
});