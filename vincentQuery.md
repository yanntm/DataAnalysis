# Test de query sur google sheet

<html>
<body>
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
		<script type="text/javascript">

			//charge la lib google chart
			google.charts.load('current', {'packages':['corechart','table']});

			//lance la fonction drawChart une fois la librairie chargee
			google.charts.setOnLoadCallback(sendQuery1);

			var dataQuery1;
			var dataQuery2;

		//declaration
		function sendQuery1() {
			
			//Requete Google Query
			var queryString = encodeURIComponent('SELECT A, B, C, H WHERE D ="-its" LABEL H "-its Duration"');

			var query = new google.visualization.Query(
					'https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);

			//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
			query.send(sendQuery2);
		}

		function sendQuery2(response) {
			if (response.isError()) {
				alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
				return;
			}

			dataQuery1 = response.getDataTable();

			//Requete Google Query
			var queryString = encodeURIComponent('SELECT A, B, C, H WHERE D ="-its -smt -ltsminpath" LABEL H "-its -smt -ltsminpath Duration"');

			var query = new google.visualization.Query(
					'https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);

			//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
			query.send(handleSampleDataQueryResponse);	
		}


		//cette fonction a pour parametre un objet de type QueryAnswer
		function handleSampleDataQueryResponse(response) {
			if (response.isError()) {
				alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
				return;
			}

			//extraction des resultats de la requete dans une table de donnees
			var dataQuery2 = response.getDataTable();

			alert("-its Results : " + dataQuery1.getNumberOfRows() + " , " + "-its -smt -ltsminpath Results : " + dataQuery2.getNumberOfRows());
			var data = google.visualization.data.join(dataQuery1, dataQuery2, 'inner', [[1,1], [2,2]], 
				[3], [3]);

			/*AFFICHAGE DATATABLE*/

			//creation de la Table. On passe en parametre un pointeur vers l'element DOM
			//dans lequel la Table sera encapsulee dans le fichier HTML.
			var table = new google.visualization.Table(document.getElementById('table_div'));

			//affichage graphique de la table de donnees recue en reponse
			table.draw(data, {showRowNumber : true});


			/*AFFICHAGE SCATTERCHART*/

			var view = new google.visualization.DataView(data);
			view.setColumns([2, 3, {
				label: 'y=x',
				type: 'number',
				calc: function (dt, row) {return dt.getValue(row, 2)}
			}]);

			//Configuration du schema
			var options = {
					title: '[-its] VS [-its -smt -ltsminpath] Durations',
					hAxis: {title: '-its'},
					vAxis: {title: '-its -smt -ltsminpath'},
					
					seriesType: 'scatter',
					series: {
						1: {type: 'line'}
					}
			};
			
			//creation du ScatterChart. On passe en parametre un pointeur vers l'element DOM
			//dans lequel le ScatterChart sera encapsule dans le fichier HTML.
			var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));

			//affichage graphique du ScatterChart
			chart.draw(view, options);
		}
	</script>
	<div id="table_div" style="width: 600px; height: 300px;"></div>
	<div id="chart_div" style="width: 600px; height: 500px;"></div>
</body>
</html>