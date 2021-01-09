import * as d3 from "d3";
import React from 'react';
import { Component } from "react";
import TableViewer from 'react-js-table-with-csv-dl';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import chunk from 'lodash/chunk';
import { selectAll, select, mouse } from 'd3-selection';

class YearSalesLineGraph extends Component {
  //function HelloWorld(){
  constructor() {
  super();
  this.state = { data: ["A", "B"], headers: ["Rank","Name","Platform","Year","Genre","Publisher","NA_Sales","EU_Sales","JP_Sales","Other_Sales","Global_Sales"], };
}

async componentWillMount() {
  const response = await fetch('vgsales.csv');
   const jsontext = await response.text();
   const csv = require('csvtojson');

     const jsonObj = await csv().fromString(jsontext)
     const parsedjdata = jsonObj;
     //console.log(jsonObj);

     var yearanpublisher = parsedjdata.map(function(item) {
     return {
       year: item.Year,
       publisher: item.Publisher,
       global_sales: item.Global_Sales
     };
   });

   var groupYear =  d3.rollup(yearanpublisher, v => d3.sum(v, d => d.global_sales), d => d.year, d => d.publisher);

   var groupYearFlat = [...groupYear].flatMap(([k1, v1]) => [...v1].map(([k2, v2]) => ({year: parseInt(k1), publisher: k2, global_sales: v2})));
  var groupY = _.groupBy(groupYearFlat, 'year');
  var groupP = _.groupBy(groupYearFlat, 'publisher');


           let totalWidth = window.innerWidth, totalHeight = window.innerHeight-40;
           let margin = {top: 20, right: 20, bottom: 50, left: 75},
               width = totalWidth - margin.left - margin.right,
               height = totalHeight - margin.top - margin.bottom;


           let svg = d3.select("#multiline")
                     .attr("width",totalWidth)
                     .attr("height",totalHeight)
                     .append("g")
                     .attr("transform","translate("+margin.left+","+margin.top+")");


           let xTime = d3.scaleLinear().domain([1978,2022]).range([0, width]);

           let yScale = d3.scaleLinear()
                          .domain([0, 220])
                          .range([height, 0]);

           let xAxis = svg.append("g")
                         .attr("transform","translate(0,"+height+ ")")
                         .call(d3.axisBottom(xTime));
           let yAxis = svg.append("g")
                         .call(d3.axisLeft(yScale));

           let idScale = d3.scaleLinear().domain([1,45]).range([45,1]);

           const tooltip = d3.select('#tooltip');
           //const tooltipLine = svg.append('line');

           let lineGenerator = d3.line()
             .x(function(d) {
               return xTime(d.year);})
             .y(function(d) {
               return yScale(d.global_sales);})

           let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

               var result = Object.values(groupP).map(function(item) {
               var a = item.map(function(i){
                 return {
                   key: i.publisher,
                   values: item,
                   pub: i.publisher,
                   yr: i.year
                 };
               })
               return a[0];
             }).slice(0,39);

             result.forEach(function (item) {

               var a = item.values.sort((a, b) => (a.year > b.year) ? 1 : -1);

        });
               svg.selectAll(".line")
                   .data(result)
                   .enter()
                   .append("path")
                   .attr("class", "line")
                   .attr("d", function(d,i) {

                     return lineGenerator(d.values);
                   })
                   .style("fill","none")
                   .style("stroke", function(d,i) {

                     return colors[i];
                   })
                   .style("opacity", .9)
                   .style("stroke-width",3)
                   .on("mouseover", function(d, i) {


                     d3.select(this).attr({
                       fill: "white"
                     });
                     var a = d3.pointer(d);
                     var xDate = Math.round(xTime.invert(a[0]));
                        var a = (i.values).filter(vendor => vendor.year === xDate);


                        label.text(function() {
                          if(a.length < 1)
                          {
                            return "Empty";
                          }
                          else{
                          return ["Publisher: " + a[0].publisher, "Sales: "+ (a[0].global_sales).toFixed(2) + "M"];
                        } // Value of the text
                        });
                          label.style("fill", "#C4A93B")

                          label.attr("opacity", 1);
                   })
                   .on("mouseout", function(d, i) {
                     label.attr("opacity", 0);
                     d3.select(this).style("stroke-width", 3)
                   });

               let legend = svg.append('g')
                 .attr("class", "legend");


               let label = legend
                 .append("text")
                 .attr("x", 10)
                 .attr("y", 60)
                 .attr("font-size", "15px")
                 .text("")
                 .attr("opacity", 0);

                 svg.append("text")
                 .attr("transform",
                 "translate(" + (width/2) + " ," +
                 (height + margin.top + 20) + ")")
                 .style("fill", "#C4A93B")
                .style("text-anchor", "middle")
                .text("Year");



    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("fill", "#C4A93B")
        .style("text-anchor", "middle")
        .text("Sales (in millions)");



}










 render(){
  return (
           <div>

<h2>Graph: Sales by Publishers by Year</h2>
<svg id="multiline" width="800" height="500">

  </svg>

 </div>
       );
}
}

  export default YearSalesLineGraph;
