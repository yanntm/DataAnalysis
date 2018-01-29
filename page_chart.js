google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/*function drawChart() {
	var data = google.visualization.DataTable();
	data.addColumn('string','Topping');
	data.addColumn('number','Slices');

	var options = {
		title: 'Age vs. Weight comparison',
		hAxis: {title: 'Age', minValue: 0, maxValue: 15},
		Axis: {title: 'Weight', minValue: 0, maxValue: 15},
		legend: 'none'
	};
	var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

	chart.draw(data, options);
} */

function drawSheetName() {
	var queryString = encodeURIComponent('SELECT A, H, O, Q, R, U LIMIT 5 OFFSET 8');
	var query = new google.visualization.Query(
          'https://docs.google.com/spreadsheets/d/1XWJLkAwch5GXAt_7zOFDcg8Wm8Xv29_8PWuuW15qmAE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
    query.send(handleSampleDataQueryResponse);
}
function handleSampleDataQueryResponse(response) {
	if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
    }
    var options = {
		title: 'Age vs. Weight comparison',
		hAxis: {title: 'Age', minValue: 0, maxValue: 15},
		Axis: {title: 'Weight', minValue: 0, maxValue: 15},
		legend: 'none'
	};
    var data = response.getDataTable();
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    chart.draw(data,options);
}

