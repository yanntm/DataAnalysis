var url;

var comparedType;
var techX;
var techY;
var removeFailed;

function startScatterChart() {

	//creation des Queries selon les variables extraites
	var query1 = createQueryScatterChart("X");
	var query2 = createQueryScatterChart("Y");

	console.log("url: "+url+"\ncomparedType: "+comparedType+"\ntechX: "+techX+
		"\ntechY: "+techY+"\nremoveFailed: "+removeFailed+"\nquery1: "+query1+"\nquery2: "+query2);
	
	//envoie la 1e requete url+query1 a Google
	sendQuery(url, query1, onReceiveQuery1);

	function onReceiveQuery1(response) {

		//extrait une DataTable declaree globale de la 1e reponse recue.
		dataQuery1 = extractDataTableFromAnswer(response);

		//envoie la 2e requete url+query2 a Google
		sendQuery(url, query2, onReceiveQuery2);
	}

	function onReceiveQuery2(response) {

		//extrait une DataTable declaree globale de la 2e reponse recue.
		dataQuery2 = extractDataTableFromAnswer(response);

		//fusionne les deux tables avec Join
		var data = google.visualization.data.join(
			dataQuery1, 
			dataQuery2, 
			'inner', 
			[[1,1], [2,2]],
			[0,3], 
			[0,3]);
		
		console.log("numberOfRows :\ndataQuery1: " + dataQuery1.getNumberOfRows() + " , dataQuery2: " + dataQuery2.getNumberOfRows() + " , dataJoined: " + data.getNumberOfRows());

		//Configuration du schema
		var opt = {
			title: '['+techX+'] VS ['+techY+'] '+comparedType,
			hAxis: {title: techX},
			vAxis: {title: techY},

			seriesType: 'scatter',
			series: {
				1: {type: 'line'}
			},

			explorer: { 
            actions: ['dragToZoom', 'rightClickToReset'],
            keepInBounds: true,
            maxZoomIn: 20.0}
		};

		var wrapper = new google.visualization.ChartWrapper({
		  'chartType' : 'ComboChart',
		  'dataTable' : data,
		  'view' : {"columns" : [3,5,3]},
		  'options' : opt,
		  'containerId' : 'chart_div'
		});

		wrapper.draw();
	}
}

function createQueryScatterChart(axe){
	//extraction des variables du formulaire HTML
	url = "https://docs.google.com/spreadsheets/d/"+
	document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";
	
	var techniqueName;
	var version;
	if(axe=="X"){
		techniqueName = document.getElementById("techX").value;
		version = document.getElementById("versionX").value;
	}
	if(axe=="Y"){
		techniqueName = document.getElementById("techY").value;
		version = document.getElementById("versionY").value;
	}
	comparedType = document.getElementById("comparedType").value;
	removeFailed = document.getElementById("removeFailed").checked;

	//var locale pour construire la requete
	var query;

	//clause SELECT : colonnes log, model, examination, [comparedType]
	query = 'SELECT '+sheetColumns['log']+', '+
			sheetColumns['Model']+', '+
			sheetColumns['Examination']+', '+
			comparedType ;
	//clause WHERE : technique = [techniqueName] AND (optionnel) testFail = 0
	query += ' WHERE '+sheetColumns['Techniques']+' ="'+techniqueName+'"'+
			 ' AND '+sheetColumns['version']+' = '+version;
	
	if(removeFailed){
		query += ' AND '+sheetColumns['Test fail']+' = 0';
	}

	return query;
}

function createQueryChronogramme(){
	/*on extrait les parametres utiles renseignes dans le formulaire*/
	var model = document.getElementById("model").value;
	var examination = document.getElementById("examination").value;
	var isRegex = document.getElementById("regex").checked;
	var comparedColumn = document.getElementById("comparedColumn").value;
	var aggreg = document.getElementById("aggreg").value;
	var removeFailed = document.getElementById("removeFailedChrono").checked;

	/*la colonne a comparer, <=> axe Y*/
	var selectField = aggreg+"("+comparedColumn+")";

	var BEqualOrRegexModel;
	if (isRegex) {
		BEqualOrRegexModel = sheetColumns['Model']+" matches \'.*" +model+ ".*\'";
	} else {
		BEqualOrRegexModel = sheetColumns['Model']+"=\'" +model+ "\'";
	}

	/*creation de la requete*/

	//SELECT
	var query = "SELECT "+sheetColumns['version']+","+selectField;

	//WHERE
	query += " WHERE "+BEqualOrRegexModel+" and "+
		sheetColumns['Examination']+"=\'" +examination+ "\'";

	/*suppression ou non des testFailed*/
	if(removeFailed){
		query += " AND "+sheetColumns['Test fail']+"=0";
	}

	//GROUP BY PIVOT ORDER BY
	query += " GROUP BY "+sheetColumns['version']+
		" PIVOT "+sheetColumns['Techniques']+
		" ORDER BY "+sheetColumns['version'];

	return query;
}

function sendQuery(url, queryString, handleQueryResponse) {
	
	//Requete Google Query
	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(queryString));

	//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
	queryEncoded.send(handleQueryResponse);
}

function extractDataTableFromAnswer(response) {
	/*response est un objet QueryResponse passee par la methode send.
		https://developers.google.com/chart/interactive/docs/reference#methods_12*/

	/*Erreur si requete fausse*/
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

	/*donnees utiles dans l'objet QueryResponse*/
	return response.getDataTable();
}

function sendQuery(url, queryString, handleQueryResponse) {
	
	//Requete Google Query
	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(queryString));

	//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
	queryEncoded.send(handleQueryResponse);
}

function extractDataTableFromAnswer(response) {
	/*response est un objet QueryResponse passee par la methode send.
		https://developers.google.com/chart/interactive/docs/reference#methods_12*/

	/*Erreur si requete fausse*/
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

	/*donnees utiles dans l'objet QueryResponse*/
	return response.getDataTable();
}





// traitement du chronogramme

function drawChronoAffiche(){
	url = "https://docs.google.com/spreadsheets/d/"+
	document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	/*Quand le ChartWrapper traitera cette requete, il produira un objet DataTable avec:
	- colonne 0 : version du log
	- colonne 1..i..Nombre de techniques differentes -1 : 
			fonctiondAggregation(chose a comparer) des valeurs pour la technique i*/
	var query = createQueryChronogramme();

	console.log(query);
	
	sendQuery(url,query,RecevoirQuery);

	function RecevoirQuery(reponse){
		var data = extractDataTableFromAnswer(reponse);
		
		var view = new google.visualization.DataView(data);
		console.log(view);
		/*creation de la liste des colonnes a afficher*/
		var columns = [];
		for (var i = 1; i <= view.getNumberOfColumns()-1; i++) {columns.push(i);}
		/*creation d'une colonne dynamique qui change les Number en String de l'axe X
		pour que les valeurs X soient des valeurs discretes*/
		var dateStringColumn = {
	    	'type': 'string',
	    	'calc': function (dt, row) {return dt.getFormattedValue(row, 0);}
	    };
	    columns.unshift(dateStringColumn);
	   	/*indique a la DataView quelles colonnes afficher*/
		view.setColumns(columns);

		var options = {
			chart: {
				title: 'Chronogramme'
			},
			lineWidth: 1.5,
			pointSize: 2,
			/*interpolateNulls: true,*/

			explorer: { 
				/*permet le zoom sur l'axe Y. Le zoom ne marche pas sur les axes discrets(X)*/
	            actions: ['dragToZoom', 'rightClickToReset'],
	            keepInBounds: true,
	            maxZoomIn: 20.0}
		};


		/*Dans l'appel au constructeur ChartWrapper, l'option 'view' est différente de ce qu'offre
		une DataView sans ChartWrapper : 
		  Pour 'calc': function (dt, row) {return dt.getFormattedValue(row, 0);}
			-avec la DataView normale, le graphe affiche bien un axe X de valeurs discretes
			 correspondant a la String de l'int version.
			-avec l'option 'view' du ChartWrapper, le graphe affiche un axe X de valeurs discretes
			 mais les valeurs sont de la forme "General20170000000" (arrondi a l'annee la plus proche ?
			 soulignant une erreur de formatage Int -> String ... 
			 Cela fausse totalement le graphe.
		=> On contournera donc ce probleme en utilisant une DataView normale 
		en tant que DataTable du ChartWrapper. */

		var wrapper = new google.visualization.ChartWrapper({
			/* si preference pour LineChart, ajouter interpolateNulls:true dans les options*/
			'chartType' : 'ColumnChart',
			'dataTable' : view,
			'options': options,
			'containerId':'chrono_div'
		});

		wrapper.draw();	

		//affichage graphique de la table de donnees 
		var table = new google.visualization.Table(document.getElementById('table_div'));
		table.draw(view, {showRowNumber : true});
	}
}

function drawDashBoardAffiche(){
	google.charts.load('current', {'packages':['corechart', 'controls']});

      // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawDashboard);

    function drawDashboard() {
    	url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";
		var queryD = createQueryChronogramme();
		console.log(queryD);	
		sendQuery(url,queryD,RecevoirQueryDashboard);
		function RecevoirQueryDashboard(reponse){
			var dataD = extractDataTableFromAnswer(reponse);
			/*var a = 0;
			for(var i=0; i<dataD.getNumberOfRows(); i++ ){
				for(var j=0; j<dataD.getNumberOfColumns(); j++ ){
					if (!dataD.getValue(i,j)) {
						dataD.setValue(i,j,a); 
					}
				}
			}*/

			var columnsTable = new google.visualization.DataTable();
		    columnsTable.addColumn('number', 'colIndex');
		    columnsTable.addColumn('string', 'colLabel');
		    var initState= {selectedValues: []};
		    // put the columns into this data table (skip column 0)
		    for (var i = 1; i < dataD.getNumberOfColumns(); i++) {
		        columnsTable.addRow([i, dataD.getColumnLabel(i)]);
		        // you can comment out this next line if you want to have a default selection other than the whole list
		        initState.selectedValues.push(dataD.getColumnLabel(i));
		    }
		    // you can set individual columns to be the default columns (instead of populating via the loop above) like this:
		    // initState.selectedValues.push(data.getColumnLabel(4));
		    
		    var chart = new google.visualization.ChartWrapper({
		        chartType: 'ColumnChart',
		        containerId: 'chart_div',
		        dataTable: dataD,
		        options: {
		            title: 'Chronogramme',
		            width: 600,
		            height: 400
		        }
		    });
    
		    var columnFilter = new google.visualization.ControlWrapper({
		        controlType: 'CategoryFilter',
		        containerId: 'colFilter_div',
		        dataTable: columnsTable,
		        options: {
		            filterColumnLabel: 'colLabel',
		            ui: {
		                label: 'Techniques',
		                allowTyping: false,
		                allowMultiple: true,
		                allowNone: false,
		                selectedValuesLayout: 'belowStacked'
		            }
		        },
		        state: initState
		    });
    
		    function setChartView () {
		        var state = columnFilter.getState();
		        var row;
		        var dateStringColumn = {
	    			'type': 'string',
	    			'calc': function (dt, row) {return dataD.getFormattedValue(row, 0);}
	    		};
		        var view = {
		            columns: [dateStringColumn]
		        };
		        for (var i = 0; i < state.selectedValues.length; i++) {
		            row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[i]}])[0];
		            view.columns.push(columnsTable.getValue(row, 0));
		        }
		        // sort the indices into their original order
		        view.columns.sort(function (a, b) {
		            return (a - b);
		        });
		        chart.setView(view);
		        chart.draw();
		    }
		    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
		    
		    setChartView();
		    columnFilter.draw();			
			/*var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard_div'));
    			// Create a range slider, passing some options
	        var donutRangeSlider = new google.visualization.ControlWrapper({
	          'controlType': 'NumberRangeFilter',
	          'containerId': 'Cardinality_div',
	          'options': {
	            'filterColumnLabel': '-its'
	          }
	        });

	        var donutRangeSlider1 = new google.visualization.ControlWrapper({
	          'controlType': 'NumberRangeFilter',
	          'containerId': 'Reachability_div',
	          'options': {
	            'filterColumnLabel': '-its -smt -ltsminpath'
	          }
	        });

    		// Create a com chart, passing some options
	        var ColumnChart = new google.visualization.ChartWrapper({
	          'chartType': 'ColumnChart',
	          'containerId': 'chart_div',
	          'options': {
	            'width': 1200,
	            'height': 500,
	            'pieSliceText': 'value',
	            'legend': 'right'
	          }
	        });

    		dashboard.bind(donutRangeSlider, ColumnChart);

    		// Draw the dashboard.
   			 dashboard.draw(dataD);*/


		       		
	    }
    }
}