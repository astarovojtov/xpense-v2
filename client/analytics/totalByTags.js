import { Lib } from '../lib/lib.js';

Template.TotalByTags.helpers({
  total: () => {
    data = Template.currentData()
    
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

    return result.sort( (a,b) => b.sum - a.sum)
  }
})