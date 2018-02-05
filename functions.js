var url;

var comparedType;
var techX;
var techY;
var removeFailed;

var query1;
var query2;

var col = {
		'log': 'A',
		'model': 'B',
		'examination': 'C',
		'technique': 'D',
		'testStarted': 'E',
		'testFail': 'F',
		'testFinished': 'G',
		'duration': 'H',
		'initial': 'I',
		'tautology': 'J',
		'ITS': 'K',
		'BMC': 'L',
		'induction': 'M',
		'PINS': 'N',
		'PINSPOR': 'O',
		'version': 'P'
};

function startQuerying() {

	//extraction des variables du formulaire HTML
	extractClientSettings();

	//creation des Queries selon les variables extraites
	query1 = createQuery(techX);
	query2 = createQuery(techY);

	console.log("url: "+url+"\ncomparedType: "+comparedType+"\ntechX: "+techX+
		"\ntechY: "+techY+"\nremoveFailed: "+removeFailed+"\nquery1: "+query1+"\nquery2: "+query2);

	//Script qui interroge 2 fois la google Spreadsheet et affiche le résultat graphiquement.
	google.charts.setOnLoadCallback(
		function() {
			//envoie la 1e requete url+query1 a Google
			sendQuery(url, query1, function(response) {

				//extrait une DataTable declaree globale de la 1e reponse recue.
				dataQuery1 = extractDataTableFromAnswer(response);

				//envoie la 2e requete url+query2 a Google
				sendQuery(url, query2, function(response) {

					//extrait une DataTable declaree globale de la 2e reponse recue.
					dataQuery2 = extractDataTableFromAnswer(response);

					//fusionne les deux tables avec Join
					var data = google.visualization.data.join(dataQuery1, dataQuery2, 'inner', [[1,1], [2,2]], [3], [3]);
					console.log("numberOfRows :\ndataQuery1: " + dataQuery1.getNumberOfRows() + " , dataQuery2: " + dataQuery2.getNumberOfRows() + " , dataJoined: " + data.getNumberOfRows());

					//genere les graphiques Google Charts et les affiche
					drawChart(data);
				});
			}); 
		}
	);
}

function extractClientSettings(){
	url = document.getElementById("url").value;
	removeFailed = document.getElementById("removeFailed").checked;
	techX = document.getElementById("techX").value;
	techY = document.getElementById("techY").value;
	comparedType = document.getElementById("comparedType").value;
}

function createQuery(techniqueName){
	//var locale pour construire la requete
	var query;

	//clause SELECT : colonnes log, model, examination, [comparedType]
	query = 'SELECT '+col.log+', '+col.model+', '+col.examination+', ';
	query += col[comparedType];

	//clause WHERE : technique = [techniqueName] AND (optionnel) testFail = 0
	query += ' WHERE '+col.technique+' ="'+techniqueName+'"';
	
	if(removeFailed){
		query += ' AND '+col.testFail+' = 0';
	}

	//clause LABEL : colonne comparedType renomme en "techniqueName comparedType"
	query += ' LABEL '+col[comparedType]+' "'+techniqueName+' '+comparedType+'"';

	return query;
}

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

google.charts.setOnLoadCallback(drawChrono);
function drawChrono() {
      var data = new google.visualization.DataTable(document.getElementById('chrono_div'));
      data.addColumn('number', 'Date');
      data.addColumn('number', 'CTLFireability');
      data.addColumn('number', 'LTLCardinality');
      data.addColumn('number', 'ReachabilityDeadlock');
      data.addColumn('number', 'ReachabilityFireability');

      data.addRows([
        [1,  37.8, 80.8, 41.8, 50.9],
        [2,  30.9, 69.5, 32.4, 47.5],
        [3,  25.4,   57, 25.7, 68.8],
        [4,  11.7, 18.8, 10.5, 25.5],
        [5,  11.9, 17.6, 10.4, 78.9],
        [6,   8.8, 13.6,  7.7, 18.9],
        [7,  32.8, 75.8, 36.8, 45.9],
        [8,  25.9, 64.5, 27.4, 42.5],
        [9,  20.4,   52, 20.7, 63.8],
        [10,  6.7, 13.8, 5.5, 20.5],
        [11,  6.9, 12.6, 5.4, 73.9],
        [12,   3.8, 8.6,  2.7, 13.9]
      ]);

      var options = {
        chart: {
          title: 'Chronogramme de la Technique ITS',
          subtitle: 'Pour un model donne et les examinations disponibles'
        },
        width: 600,
        height: 300
      };

      var chart = new google.charts.Line(document.getElementById('chrono_div'));

      chart.draw(data, google.charts.Line.convertOptions(options));
}
