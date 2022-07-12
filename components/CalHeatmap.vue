<template>
    <v-card class="logo py-4 d-flex justify-center">
        <h4>{{name}}</h4>
        <div :id="heatmapId"></div>
        <div>
            <v-checkbox label="Smoking" v-model="enableSmoking" />
            <v-checkbox label="Mini Dose" v-model="enableMinidose" />
        </div>
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

    data() {
        return {
            call: null,
            enableSmoking: true,
            enableMinidose: false,
        }
    },

    computed: {
        heatmapId() {
            return `cal-heatmap-${this.name}`
        }
    },

    watch: {
      enableSmoking(enabled) {
        if (enabled) {
            // cal.update("user=Marc");
            // cal.options.data = "user=Marc";
            // cal.next();
            
        }
      },
    },

    mounted() {
        this.cal = calHeatMapInit(this.name, this.dataRows)
    },
}
</script>