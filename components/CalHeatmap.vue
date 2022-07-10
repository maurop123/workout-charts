<template>
    <v-card class="logo py-4 d-flex justify-center">
        <h4>{{name}}</h4>
        <div :id="heatmapId"></div>
    </v-card>
</template>

<script>
import { calHeatMapInit } from '~/logic/chart_logic'

export default {
    props: {
        name: {
            type: String
        },
        dataRows: {
            type: Array
        },
    },

    computed: {
        heatmapId() {
            return `cal-heatmap-${this.name}`
        }
    },

    mounted() {
        calHeatMapInit(this.name, this.dataRows)
    },
}
</script>