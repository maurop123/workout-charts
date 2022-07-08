<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="logo py-4 d-flex justify-center">
        <h4>Smoking</h4>
        <div id="cal-heatmap-smoking"></div>
      </v-card>
      <v-card>
        <!-- imagine if we could select the start date and some
             other info and dynamically update cal-heatmaps -->
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


import _omit from 'lodash/omit'

import { calHeatMapInit, calHeatMapInitSmoking, getMuscleGroupChartData, medsDataTransform, workoutDataTransforms } from '~/logic/chart_logic'


export default {
  name: 'BarChart',
  components: { Bar },
  async asyncData({ $content }) {

    const data = await $content('workouts').fetch()

    const { dates, rows } = workoutDataTransforms(data)

    // hours.json
    const hoursFetch = await $content('hours').fetch()
    const hours = _omit(hoursFetch, ['slug','dir','path','extension','createdAt','updatedAt'])

    // meds.csv
    const medsFetch = await $content('meds').fetch()
    const meds = medsDataTransform(medsFetch)


    const result = {
      dateLabels: dates,
      rows,
      absData: getMuscleGroupChartData('abs', rows, dates),
      chestData: getMuscleGroupChartData('chest', rows, dates),
      legsData: getMuscleGroupChartData('legs', rows, dates),
      hours,
      meds,
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
    // calHeatMapInit(this) //got error when passed just hours
    calHeatMapInitSmoking(this)
  },
}
</script>
