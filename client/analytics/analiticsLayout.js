import { Lib } from '../lib/lib.js'

Template.AnalyticsLayout.onCreated(function () {
  var self = this;
  self.autorun( function() {
    self.subscribe('expenses');
  })
});

Template.AnalyticsLayout.helpers({
  expenses: () => { 
    return Expenses.find({}).fetch()
  },
  
  chart: (data) => {
    
    let filtered = [];
    data.forEach( (x) => filtered.push(x.tag) )
    
    filtered = Array.from(new Set(filtered))
    let result = []; let tags = []; let sums = [];
    
    for (let j=0; j<filtered.length; j++) {
      result[j] = {tag: '', sum: 0};
      for (let i=0; i<data.length; i++) {
        if (data[i].tag == filtered[j]) {
          result[j].tag = data[i].tag
          tags[j] = data[i].tag
          result[j].sum = Lib.sumDecimals(result[j].sum, data[i].sum)
          sums[j] = Lib.sumDecimals(result[j].sum, data[i].sum)
        }
      }
    }
    
    var ctx = document.getElementById("myChart").getContext('2d');
    
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: tags,//["вода", "сиги", "проезд", "обед", "еда",
                   //"тв", "пивас", "пятница", "вкусняшки", "катя",
                   //"холлс", "мама", "ДР", "кофе", "не помню"],
          datasets: [{
              data: sums,//[9.21, 48.88, 7.15, 62.05, 197.73,
                     //200, 34.69, 117.61, 0.99, 0.93,
                     //5.87, 150, 212.48, 9, 5],
               backgroundColor: ['#33691e', '#e65100', '#f57f17', '#ff6f00', '#827717',
                                 '#0d47a1', '#01579b', '#006064', '#004d40', '#1b5e20',
                                 '#b71c1c', '#880e4f', '#4a148c', '#311b92', '#1a237e']
          }]
      },
      options: {
        legend: {
            display: false,
            labels: {
                fontFamily: 'Roboto',
                fontSize: 14,
              // This more specific font property overrides the global property
                fontColor: 'black'
            }
        }
      }
    });
  },
  
  mostFrequentSpending: (data) => {
    
    console.time()
    
    let maxCount = 0;
    for (let j=0; j<data.length; j++) {
      data[j].count = 0
      for (let i=0; i<data.length; i++) {
        if (data[j].tag == data[i].tag) {
          data[j].count += 1
        }
      }
      if (data[j].count > maxCount)
        maxCount = data[j].count
    }
    
    let filtered = []; let i=0;
    data.forEach( (x) => {
      //if (x.count == maxCount) 
        filtered.push(x.tag)
      })
    
    filtered = Array.from(new Set(filtered))
    let result = [];
    
    for (let j=0; j<filtered.length; j++) {
      result[j] = {tag: '', sum: 0};
      for (let i=0; i<data.length; i++) {
        if (data[i].tag == filtered[j]) {
          result[j].tag = data[i].tag
          result[j].sum = Lib.sumDecimals(result[j].sum, data[i].sum)
          result[j].count = data[i].count
          //result[j].count = maxCount
        }
      }
    }
    
    console.timeEnd()

    return result
  },
  
});