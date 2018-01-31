# Test de query sur google sheet

<html>
<body>
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
		<script type="text/javascript">

			//charge la lib google chart
			google.charts.load('current', {'packages':['corechart','table']});

			//lance la fonction drawChart une fois la librairie chargee
			google.charts.setOnLoadCallback(drawChart);

		//declaration
		function drawChart() {
			
			//Requete Google Query
			var queryString = encodeURIComponent('SELECT H, I WHERE D ="-its" OR D ="-its -smt -ltsminpath" LIMIT 30');

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
			var data = response.getDataTable();

			console.log(data);

			/*AFFICHAGE DATATABLE*/

			//creation de la Table. On passe en parametre un pointeur vers l'element DOM
			//dans lequel la Table sera encapsulee dans le fichier HTML.
			var table = new google.visualization.Table(document.getElementById('table_div'));

			//affichage graphique du ScatterChart
			table.draw(data);

			/*AFFICHAGE SCATTERCHART*/

			//Configuration du schema
			var options = {
					title: '[-its] VS [-its -smt -ltsminpath] Durations',
					hAxis: {title: '-its'},
					vAxis: {title: '-its -smt -ltsminpath'},
					legend: 'none',
					trendlines: { 0: {} }    // Trendline (fonction x=y)
				}; 
			
			//creation du ScatterChart. On passe en parametre un pointeur vers l'element DOM
			//dans lequel le ScatterChart sera encapsule dans le fichier HTML.
			var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

			//affichage graphique du ScatterChart
			chart.draw(data);
		}
	</script>
	<div id="table_div" style="width: 600px; height: 300px;"></div>
	<div id="chart_div" style="width: 600px; height: 500px;"></div>
</body>
</html>