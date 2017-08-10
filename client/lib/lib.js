const Lib = { 
  
  sumDecimals: function (a,b) {
    return +(a + b).toFixed(2)
  },
  
  arraySum: (data, condition) => {
    condition = condition || true
    let sum = 0; 
    for (let i=0; i<data.length; i++)
      if (condition)
      sum = Lib.sumDecimals(sum, data[i].sum)
    return sum
  },

  daysRange: function (month) {
    
    let date = new Date();
    let y = date.getFullYear();
    let m = month;
    let currentMonth = m < 10 ? '0' + (m+1) : m+1;
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    firstDay = moment(firstDay).format('DD');
    lastDay = moment(lastDay).format('DD');

    firstDay = '2017-' + currentMonth + '-' + firstDay + 'T00:00:00.000Z'
    lastDay = '2017-' + currentMonth + '-' + lastDay + 'T23:59:59.000Z'
    return { currentMonth, firstDay, lastDay }
  },
  
  resize: function(el, ruler) {
    ruler.innerText = el.value
    let width = getComputedStyle(ruler).width
    el.style.width =  Math.ceil(width.replace('px','')) + 'px';
  },

  checkChanges: function(obj1, obj2) {
    let arr = []
    for (prop in obj1) {    
        arr.push(obj2.hasOwnProperty(prop) && obj1[prop] != obj2[prop])
    }
  
    return arr.some( (x) => { return x == true }) 
  },

  momentDate: function(dateTime) {
    let humanizedDate = moment(dateTime).fromNow();
    if ( moment().diff(moment(dateTime)) > 1000 * 60 * 60 * 24 * 7)
      return moment(dateTime).format('DD MMM YYYY')
    else 
      return humanizedDate
  }
}

export { Lib }