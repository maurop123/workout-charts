<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <CalHeatmap name="smoking" :dataRows="meds" />
      <BarChart :chartData="chartData" />
    </v-col>
  </v-row>
</template>

<script>
import _omit from 'lodash/omit'

import { getMuscleGroupChartData, workoutDataTransforms } from '~/logic/chart_logic'

import CalHeatmap from '@/components/CalHeatmap.vue'
import BarChart from '@/components/BarChart.vue'


export default {
  name: 'HomePage',
  components: { BarChart, CalHeatmap },
  async asyncData({ $content }) {
    const medsFetch = await $content('meds').fetch()
    const meds = medsFetch.body

    const data = await $content('workouts').fetch()
    const { dates, rows } = workoutDataTransforms(data.body)

    // hours.json
    const hoursFetch = await $content('hours').fetch()
    const hours = _omit(hoursFetch, ['slug','dir','path','extension','createdAt','updatedAt'])


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
}
</script>
