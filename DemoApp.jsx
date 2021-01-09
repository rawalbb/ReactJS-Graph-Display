import React from 'react';
import TableChart from './TableChart';
import SalesBarGraph from './SalesBarGraph';
import YearSalesLineGraph from './YearSalesLineGraph';
import './DemoApp.css';

export default class DemoApp extends React.Component {

	render() {
		return (
			<div className="DemoApp-header">
      <p className="DemoApp-title">
        IBM GRAPH DEMO PROJECT
        </p>
				<TableChart />
        <hr color="black" />
        <SalesBarGraph />
        <hr color="black" />
        <YearSalesLineGraph />
			</div>
		);
	}
}
