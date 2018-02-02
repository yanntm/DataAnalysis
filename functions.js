function sendQuery(url, queryString, handleQueryResponse) {
	
	//Requete Google Query
	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(queryString));

	//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
	queryEncoded.send(handleQueryResponse);
}

function extractDataTableFromAnswer(queryResponse) {
	if (queryResponse.isError()) {
		alert('Error in query: ' + queryResponse.getMessage() + ' ' + queryResponse.getDetailedMessage());
		return;
	}
	return queryResponse.getDataTable();
}

function drawChart(data) {

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
		calc: function (dt, row) {return dt.getValue(row, 2);}
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