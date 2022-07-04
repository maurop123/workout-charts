import CalHeatMap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'
  
  export function calHeatMapInit(context) {
    const cal = new CalHeatMap();
    console.log('context.hours', context.hours)
    cal.init({
      data: context.hours,
      itemSelector: '#cal-heatmap',
      start: new Date(2022, 1, 0),
      domain: "month",
      displayLegend: true,
      legend: [0,1,2,3,4,5],
      legendColors: {
        empty: "#ffffff",
        min: "#dae289",
        max: "#3b6427",
      }
    })
  }
  

  /* Workout Data Transform Methods */

  export function workoutDataTransforms(data) {
    const dates = data.body.filter(row => row.date).map(row => row.date)

    // consolidate rows and fill in dates
    const rows = data.body.reduce(({acc,date}, row) => {
        if (row.date) {
          date = row.date
        } else {
          row.date = date
          acc.push(row)
        }
        return {acc, date}
      }, {acc: [], date: null})
      .acc // take only the accumulated rows

    return { dates, rows }
  }
  
  function addQty(qtyString) {
    return qtyString.split(',')
      .filter(q => q !== '?')
      .reduce((acc, q) => {
        if (q == '')
          return acc
        else
          return acc + parseInt(q)
        //doesn't handle when q cant be parsed
      }, 0)
  }
  
  export function getMuscleGroupChartData(muscleGroupName, rows, dates) {
    const data = rows.filter(r => r.muscle == muscleGroupName)
  
    const chartData = dates.map(date => {
      let res = [date, 0] //default
      const rows = data.filter(row => row.date == date)
      // only do work if rows > 0
      if (rows.length > 0) {
        res = [
          date,
          rows.reduce((acc,row) => {
            return acc + addQty(row.qty)
          }, 0)
        ]
      }
      return res
    })
  
    return chartData
  }