//use ts

import CalHeatMap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'

  function convertToCalheatmapData(rows) {
    return rows.reduce((acc,row) => {
      //expect date in '6/19' format
      const date = row.date.concat('/22')
      // turn date to unix seconds
      const unixDate = Math.floor(new Date(date).getTime() / 1000)
      // add unixDate key if doesn't exist. else inc by 1
      if (acc[unixDate]) {
        acc[unixDate] += 1
      } else {
        acc[unixDate] = 1
      }

      return acc
    }, {})
  }
  
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

  // smoke and mini dose data
  export function calHeatMapInitSmoking(context) {
    const cal = new CalHeatMap();
    console.log('context.meds', context.meds)
    const smoking = context.meds.filter(row => row.what.includes('smoke'))
    console.log('smoking', smoking)
    const smokingCalheatmapData = convertToCalheatmapData(smoking)
    console.log('smokingCalhetmapData', smokingCalheatmapData)
    cal.init({
      data: smokingCalheatmapData,
      itemSelector: '#cal-heatmap',
      start: new Date(2022, 6, 0),
      domain: "month",
      displayLegend: true,
      legend: [0,1,2,3,4],
      legendColors: {
        empty: "#ffffff",
        min: "#dae289",
        max: "#3b6427",
      }
    })
  }
  
  export function medsDataTransform(data) {
    const rows = consolidateRowsAndFillInDates(data)

    return rows
  }

  /* Workout Data Transform Methods */

  function consolidateRowsAndFillInDates(data) {
      // consolidate rows and fill in dates
      return data.body.reduce( ({acc, date}, row) => {
        // save date for filling in following rows
        if (row.date) {
          date = row.date
        } else {
          row.date = date
        }

        // check if rest of row has data
        const nonEmptyValues = Object.values(row).filter(v => v)
        if (nonEmptyValues.length > 0) {
          acc.push(row)
        }

        return {acc, date}
      }, {acc: [], date: null})
      .acc // take only the accumulated rows
  }

  export function workoutDataTransforms(data) {
    const dates = data.body.filter(row => row.date).map(row => row.date)

    const rows = consolidateRowsAndFillInDates(data)

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