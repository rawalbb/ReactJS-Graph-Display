import React from 'react';
import ReactDataTablePagination from 'react-datatable-pagination'
import ReactDOM from "react-dom";
import { useState, useEffect } from 'react';
import { Component } from "react";
import TableViewer from 'react-js-table-with-csv-dl';
import {Bar} from 'react-chartjs-2';

class SalesBarGraph extends Component {
  constructor() {
  super();
  this.state = { labels: [], datasets: [],  };
}

async componentWillMount() {
    const response = await fetch('vgsales.csv');
    const jsontext = await response.text();
    const csv = require('csvtojson');

    const jsonObj = await csv().fromString(jsontext)
    var salesByPlatform = jsonObj.map(function(item) {
      return {
          plat: item.Platform,
          sal: item.Global_Sales,
      };
    });

    var map = salesByPlatform.reduce(function(map, item) {
        var name = item.plat
        var price = +item.sal
        map[name] = (map[name] || 0) + price
        return map
    }, {})

    var mapEntry = [];
    for (var x in map) {
      mapEntry.push([x, map[x]]);
}

 mapEntry.sort(function(a, b) {
   //console.log(a[1]);
   return b[1] - a[1];
});

const finalBarData = mapEntry.slice(0,10);
  //this.setState({ data: parsedjdata });
  //console.log(this.state.data)

  const finalBarObj = Object.fromEntries(finalBarData);
  var inputa = Object.keys(finalBarObj)
  var inputb = [
    {
      label: "Sum of Sales by Platform",
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: Object.values(finalBarObj)
    },
  ]

   this.setState({ labels: inputa, datasets: inputb });
}

 render(){
  return (
           <div className="DemoApp-header">
           <h2>Graph: Sum of Sales by Platforms</h2>
           <Bar
             data={this.state}
             width={100}
             height={40}
             options={{
               maintainAspectRatio: true,
               scales: {
                   yAxes: [{
                       ticks: {
                           // Include a dollar sign in the ticks
                           callback: function(value, index, values) {
                               return + value + 'M';
                           }
                       }
                   }]
               }
             }}
           />
 </div>
       );
}
}

  export default SalesBarGraph;
