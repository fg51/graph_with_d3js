/// <reference path="../typings/index.d.ts" />


import * as d3 from "d3";
import * as nv from "nvd3";

const TARGET_DIV = '#chart1';

window.onload = () => {
    d3.json("/data/data.json", (error, data) => {
        console.log(data);

        nv.addGraph(() => {
            let ploter = new PlotGraph();
            ploter.set_xaxis();
            ploter.set_yaxis();

            ploter.data(data);
            let chart = ploter.get_chart();
            nv.utils.windowResize(chart.update);
            return chart;
            });

    });
}


namespace axis_labels {
    export const X = "Time [s]";
    export const Y = "Height [m]";
}


class PlotGraph {
    private chart;
    constructor() {
        this.chart = nv.models.lineChart()
            .options({
                transitionDuration: 300,
                useInteractiveGuideline: true
            });
    }

    set_xaxis() {
        this.chart.xAxis
            .axisLabel(axis_labels.X)
            .tickFormat(d3.format(',.1f'))
            .staggerLabels(true);
    }

    set_yaxis() {
        this.chart.yAxis
        .axisLabel(axis_labels.Y)
        .tickFormat(function(d) {
            if (d == null) {
                return 'N/A';
            }
            return d3.format(',.2f')(d);
        });
    }

    get_chart() {
        return this.chart;
    }

    data(data) {
        let values: Position_t [] = [];
        for (let i of data) {
            values.push({x: i.time, y: i.height});
        }

        console.log(values);


        d3.select(TARGET_DIV).append('svg')
            .datum([{
                values: values,
                key: "ball 1",
            }])
            .call(this.chart);
    }
}


interface Position_t {
    x?: number;
    y?: number;
}

