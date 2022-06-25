<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="logo py-4 d-flex justify-center">
        <div id="cal-heatmap"></div>
      </v-card>
      <v-card>
        <!-- start date selector -->
        <v-input type="text"
          v-model="calMapStartDate"
          placeholder="20220630" />
        <!-- data set -->
      </v-card>
      <v-card class="logo py-4 d-flex justify-center">
        <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
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

import CalHeatMap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'

import _omit from 'lodash/omit'

function calHeatMapInit(context) {
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

    const hoursFetch = await $content('hours').fetch()

    const hours = _omit(hoursFetch, ['slug','dir','path','extension','createdAt','updatedAt'])

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
      hours,
    }
    return result
  },
  data() {
    return {
      // calMap vars
      calMapStartDate: "",
      // cal-heatmap chart options
      chartOptions: {
        responsive: true
      },
      chartId: 'bar-chart',
      datasetIdKey: 'label',
      width: 600,
      height: 400,
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
  },
  mounted() {
    calHeatMapInit(this)
  },
}
</script>
