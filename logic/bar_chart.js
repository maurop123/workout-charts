

export function workoutDataTransforms(data) {
    const dates = data.filter(row => row.date).map(row => row.date)
    // consolidateRowsAndFillInDates' is not defined  no-undef
    // const rows = consolidateRowsAndFillInDates(data)
    const rows = null
    return { dates, rows }
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
  
