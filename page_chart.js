google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart1);

/*function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Age', 'Weight'],
          [ 8,      12],
          [ 4,      5.5],
          [ 11,     14],
          [ 4,      5],
          [ 3,      3.5],
          [ 6.5,    7]
        ]);

        var options = {
          title: 'Age vs. Weight comparison',
          hAxis: {title: 'Age', minValue: 0, maxValue: 15},
          vAxis: {title: 'Weight', minValue: 0, maxValue: 15},
          legend: 'none'
        };

        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

        chart.draw(data, options);
}*/
var data1;
var data2;

function drawChart1() {
  var queryString = encodeURIComponent('SELECT A, B, C, H WHERE D ="-its" LABEL H "-its Duration"');

  var query = new google.visualization.Query(
      'https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);

  query.send(drawChart2);
}
function drawChart2(response) {
			if (response.isError()) {
				alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
				return;
			}

			data1 = response.getDataTable();

			//Requete Google Query
			var queryString = encodeURIComponent('SELECT A, B, C, H WHERE D ="-its -smt -ltsminpath" LABEL H "-its -smt -ltsminpath Duration"');

			var query = new google.visualization.Query(
					'https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);

			//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
			query.send(handleSampleDataQueryResponse);	
		}

function handleSampleDataQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  var data2 = response.getDataTable();
	//var data = new google.visualization.DataTable();
	//data.addColumn('number', '-its'
  var data = google.visualization.data.join(dataQuery1, dataQuery2, 'inner', [[1,1], [2,2]], [3], [3]);
  var table = new google.visualization.Table(document.getElementById('table_div'));
  table.draw(data, {showRowNumber : true});
  
  var view = new google.visualization.DataView(data);
			view.setColumns([2, 3, {
				label: 'y=x',
				type: 'number',
				calc: function (dt, row) {return dt.getValue(row, 2)}
			}]);
  

  var options = {
      title: '[-ITS -SMT -LTSminpath] VS [-ITS] Durations',
      hAxis: {title: '-ITS -SMT -LTSminpath'},
      vAxis: {title: '-ITS'},
      legend: 'Visualisation',
      'width': 900,
      'heigth': 500,
      trendlines: {0:{}}    
    };

  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data,options);
  
}





