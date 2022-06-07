<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="logo py-4 d-flex justify-center">
        <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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

function getMuscleGroupChartData(muscleGroupName, rows, dates) {
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

export default {
  name: 'BarChart',
  components: { Bar },
  async asyncData({ $content }) {
    const data = await $content('workouts').fetch()

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

    const result = {
      dateLabels: dates,
      rows,
      absData: getMuscleGroupChartData('abs', rows, dates),
      chestData: getMuscleGroupChartData('chest', rows, dates),
      legsData: getMuscleGroupChartData('legs', rows, dates),
    }
    return result
  },
  data() {
    return {
      chartOptions: {
        responsive: true
      },
      chartId: 'bar-chart',
      datasetIdKey: 'label',
      width: 600,
      height: 400,
      cssClasses: '',
      styles: {},
      plugins: {}
    }
  },
  computed: {
    chartData() {
      return {
          labels: this.dateLabels,
          datasets: [
            {
              label: 'Abs',
              data: this.absData.map(c => c[1]),
              backgroundColor: ['rgba(255, 99, 132, 0.2)']
            },
            {
              label: 'Chest',
              data: this.chestData.map(c => c[1]),
              backgroundColor: ['rgba(255, 205, 86, 0.2)']
            },
            {
              label: 'Legs',
              data: this.legsData.map(c => c[1]),
              backgroundColor: ['rgba(54, 162, 235, 0.2)']
            },
          ]
        }
    }
  }
}
</script>
