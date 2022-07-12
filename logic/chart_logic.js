//use ts

//functional library

import CalHeatMap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'

// smoke and mini dose data
export function calHeatMapInit(name, _data) {
  // new heatmap instance
  const cal = new CalHeatMap();

  // data transforms
  const calheatmapData = heatmapDataTransforms(name, _data)

  cal.init({
    data: calheatmapData,
    itemSelector: `#cal-heatmap-${name}`,
    start: new Date(2022, 6, 0),
    domain: "month",
    subDomain: "x_day",
    displayLegend: true,
    legend: [0,1,2,3,4],
    legendColors: {
      empty: "#ffffff",
      min: "#dae289",
      max: "#3b6427",
    },
    range: 2,
    verticalOrientation: true,
    label: {
      position: "right",
    },
  })

  return cal
}

export function updateCalHeatmap(cal, name, data) {
  heatmapDataTransforms(name, data)
  cal.update()
}

function heatmapDataTransforms (name, _data) {
    // data transforms
    console.log(name, '_data', _data)
    const data = consolidateRowsAndFillInDates(_data)
      .filter(row => row.what.includes( dataRules(name) ))
    console.log(name, 'data', data)
    const calheatmapData = convertToCalheatmapData(data)
    console.log('calheatmapData', calheatmapData)
    return calheatmapData
}

/* Workout Data Transform Methods */

export function consolidateRowsAndFillInDates(data) {
  console.log('data', data)
    // consolidate rows and fill in dates
    return data.reduce( ({acc, date}, row) => {
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
  const dates = data.filter(row => row.date).map(row => row.date)

  const rows = consolidateRowsAndFillInDates(data)

  return { dates, rows }
}

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

function dataRules (name) {
  return {
    smoking: 'smoke',
    minidose: 'mini dose',
  }[name]
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