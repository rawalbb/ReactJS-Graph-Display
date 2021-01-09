import React from 'react';
import ReactDataTablePagination from 'react-datatable-pagination'
import ReactDOM from "react-dom";
import { useState, useEffect } from 'react';
import { Component } from "react";
import TableViewer from 'react-js-table-with-csv-dl';

class TableChart extends Component {
  constructor() {
  super();
  this.state = { data: ["A", "B"], headers: ["Rank","Name","Platform","Year","Genre","Publisher","NA_Sales","EU_Sales","JP_Sales","Other_Sales","Global_Sales"], };
}

async componentWillMount() {
    const response = await fetch('vgsales.csv');
    const jsontext = await response.text();
    const csv = require('csvtojson');

    const jsonObj = await csv().fromString(jsontext)
    const sortedJsonData = jsonObj.sort((a, b) => parseFloat(b.Global_Sales) - parseFloat(b.Global_Sales));

    this.setState({ data: sortedJsonData });
}

 render(){
  return (
           <div className="DemoApp-title">
            <TableViewer
  title="Table: Video Games with Sales over 100,000"
  titleStyle={{color:"khaki"}}
  activePageBoxStyle={{backgroundColor:"#66B5B8", color: "white"}}
  pageBoxStyle = {{backgroundColor:"#66B5B8"}}
  content={this.state.data}
  headers={this.state.headers}
  minHeight={0}
  maxHeight={400}
  activateDownloadButton={this.state.activateDownloadButton}
  pagination={10}
  searchEnabled={true}
  bodyCss={{color: "blue", backgroundColor:"#fff"}}
/>

 </div>
       );
}
}

  export default TableChart;
