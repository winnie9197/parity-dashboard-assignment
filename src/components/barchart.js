import React, { Component } from 'react';

import CanvasJSReact from '../lib/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class BarChart extends Component {
    fetchData () {
        // A Dummy chart. Could fill this in with user data.
    }

    toggleDataSeries(e) {
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else{
			e.dataSeries.visible = true;
		}
		this.chart.render();
    }

    render() {
        CanvasJS.addColorSet("greenShades",
        [//colorSet Array
        "#4c4c4c",
        "#cccccc",
        "#999999",
        // "#FF8E2E",
        "#16bcc8",        
        "#dedede"]);
        
        const options = {
            colorSet:  "greenShades",
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Weekly Thermostat Usage",
                fontFamily: "roboto",
                fontColor: "#939393",
            },
            axisY: {
                title: "Number of Hours",
                includeZero: true,
                suffix: "h"
            },
            toolTip: {
                shared: true,
                reversed: true
            },
            legend: {
                verticalAlign: "center",
                horizontalAlign: "right",
                reversed: true,
                cursor: "pointer",
                fontColor: "#939393",
                itemclick: this.toggleDataSeries
            },
            data: [
            {
                type: "stackedColumn",
                name: "AutoCool",
                showInLegend: true,
                yValueFormatString: "#,###h",
                dataPoints: [
                    { label: "Sun", y: 4 },
                    { label: "Mon", y: 4 },
                    { label: "Tues", y: 2 },
                    { label: "Wed", y: 4 },
                    { label: "Thurs", y: 3 },
                    { label: "Fri", y: 3 },
                    { label: "Sat", y: 3 },
                ]
            },
            {
                type: "stackedColumn",
                name: "AutoHeat",
                showInLegend: true,
                yValueFormatString: "#,###h",
                dataPoints: [
                    { label: "Sun", y: 3 },
                    { label: "Mon", y: 3 },
                    { label: "Tues", y: 5 },
                    { label: "Wed", y: 6 },
                    { label: "Thurs", y: 7 },
                    { label: "Fri", y: 7 },
                    { label: "Sat", y: 8 },
   
                ]
            },
            {
                type: "stackedColumn",
                name: "Heat",
                showInLegend: true,
                yValueFormatString: "#,###h",
                dataPoints: [
                    { label: "Sun", y: 3 },
                    { label: "Mon", y: 3 },
                    { label: "Tues", y: 5 },
                    { label: "Wed", y: 5 },
                    { label: "Thurs", y: 5 },
                    { label: "Fri", y: 5 },
                    { label: "Sat", y: 6 },
            ]
            },
            {
                type: "stackedColumn",
                name: "Cool",
                showInLegend: true,
                yValueFormatString: "#,###h",
                dataPoints: [
                    { label: "Sun", y: 4 },
                    { label: "Mon", y: 8 },
                    { label: "Tues", y: 6 },
                    { label: "Wed", y: 6 },
                    { label: "Thurs", y: 5 },
                    { label: "Fri", y: 5 },
                    { label: "Sat", y: 6 },
                ]
            },
            {
                type: "stackedColumn",
                name: "Off",
                showInLegend: true,
                yValueFormatString: "#,###h",
                dataPoints: [
                    { label: "Sun", y: 4 },
                    { label: "Mon", y: 8 },
                    { label: "Tues", y: 6 },
                    { label: "Wed", y: 6 },
                    { label: "Thurs", y: 5 },
                    { label: "Fri", y: 5 },
                    { label: "Sat", y: 2 },
                ]
            }]
        };
    
    return (
        <div className="barchart">
            <CanvasJSChart options = {options}
                        /* onRef = {ref => this.chart = ref} */
                    />
        </div>
    );
    }
};


export default BarChart;
