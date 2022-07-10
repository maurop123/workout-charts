<template>
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
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    components: {
        Bar,
    },
    
    props: {
        chartData: {
            type: Object,
        },
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
        }
    },
}
</script>