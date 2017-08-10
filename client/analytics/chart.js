import { Lib } from '../lib/lib.js'
Template.Chart.helpers({
  chart: () => {
    
    data = Template.currentData()
    
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
          labels: tags,
          datasets: [{
              data: sums,
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
})