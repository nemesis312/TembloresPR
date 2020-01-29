<template>
<div class="container">
    <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
    <hr />
    <v-client-table :data="tableData" :columns="columns" :options="options"></v-client-table>
</div>
</template>

<script>
import LineChart from './Chart.vue'
import axios from 'axios'
import moment from 'moment'
import {
    _
} from 'vue-underscore';

const unique = (value, index, self) => {
    return self.indexOf(value) === index
}

export default {
    name: 'Temblores',
    components: {
        LineChart
    },
    props: {
        msg: String
    },
    methods: {
        getData() {
            var _records = []
			var _this = this
			var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' + this.startdate + '&endtime=' + this.enddate + '&latitude=18.220&longitude=-66.590&maxradiuskm=150';
			
            axios.get(url)
                .then(response => {
                    response.data.features.forEach(function (item) {
                        item.properties.time = _this.formatDate(item.properties.time)
                        item.properties.updated = _this.formatDate(item.properties.updated)
                        item.properties.tsunami = _this.formatTsunami(item.properties.tsunami)
                        _records.push(item.properties)
                    });

                    this.tableData = _records
                    this.getChart(_records);

                })
                .catch(e => console.log(e))
        },

        formatDate(date) {
            return moment(date).format('YYYY-MM-DD hh:mm:ss');
        },
        formatTsunami(data) {
            return data == 0 ? 'No' : 'Yes'
        },
        random_rgba() {
            var o = Math.round,
                r = Math.random,
                s = 255;
            return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
        },
        getChart(data) {
            this.loaded = false
            var _this = this;
            var _labels = []
            var _data = []
            var _rgba = []

            var sortedDate = _.sortBy(data, 'time');

            sortedDate.forEach(function (item) {
                _labels.push(moment(item.time).format("YYYY-MM-DD h:mm:ss A"))
                _data.push(item.mag)
                _rgba.push(_this.random_rgba())
            });
            try {

                var mda = JSON.parse(JSON.stringify(_labels, null, 0))
                _this.chartdata = {
                        labels: mda,
                        datasets: [{
                            label: 'Magnitudes',
                            data: _data,
                            backgroundColor: _rgba,
                            fill: false

                        }],
                        options: {
                            responsive: true
                        }
                    },

                    _this.loaded = true
            } catch (e) {
                console.error(e)
            }
		},
		getDates(x){
			
			var date = new Date(), y = date.getFullYear(), m = date.getMonth();
			if(x == 'F')
			{
				var firstday = new Date(y, m, 1);
				
				return  moment(firstday).format("YYYY-MM-DD")
			}
			else if(x == 'F5'){
				var today = new Date();				
				var last5 = new Date().setDate(today.getDate()-5)				
				return  moment(last5).format("YYYY-MM-DD")
			}
			else if(x == 'L5'){
				var today = new Date();
				var today1 = new Date().setDate(today.getDate()+1)			
				return  moment(today1).format("YYYY-MM-DD")
			}		
			else
			{
				var lastday = new Date(y, m + 1, 0);				
				return  moment(lastday).format("YYYY-MM-DD")
			}

			
		}
    },
    data() {
        return {
			startdate: this.getDates("F5"),
			enddate: this.getDates("L5"),
			loaded: false,
            chartdata: null,
            records: null,
            columns: ['mag', 'place', 'time', 'tsunami'],
            tableData: [],
            options: {
                headings: {
                    mag: 'Mag',
                    place: 'Lugares',
                    time: 'Fecha',
                    tsunami: 'Alerta de Tsunami'
                },
                texts: {
                    filterPlaceholder: "Por Magnitud"
                },
                sortable: ['mag', 'time'],
                filterable: ['mag']
            },
        }
    },
    async mounted() {
        this.getData();
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
