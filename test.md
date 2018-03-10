# test 
### (standalone .HTML)

<html>
<body>
	<select id="columns_names"></select>
	<form>
		<div>
			<label for="key">key: </label>
			<input type="text" id="key" placeholder="Spreadsheet Key" value="1Yhsm4LnZvbe-dEENoEKff-Z0Zfa2zu-GN_Aa3NJDbco" />
		</div>
		<div>
			<label for="select">SELECT </label>
			<input type="text" id="select" placeholder=" *" />
			<label for="where">WHERE </label>
			<input type="text" id="where" placeholder="no condition" />
		</div>
		<div>
			<label for="groupby">GROUP BY </label>
			<input type="text" id="groupby" />
			<label for="pivot">PIVOT </label>
			<input type="text" id="pivot" />
		</div>
		<div>
			<label for="orderby">ORDER BY </label>
			<input type="text" id="orderby" />
			<label for="limit">LIMIT </label>
			<input type="text" id="limit" placeholder="no limit" value="10" />
		</div>
		<input type="button" value="Go" onclick="testQuery()" /> 
	</form>

	<!--div ou s'affichera le graphe dataTable (javascript le generera)-->
	<div id="table_div" style="width: 600px; height: 500px;"></div>
	

	<!--chargement du loader de lib google charts (+ajax)
		Doit etre dans une balise script separee avant les autres scripts
		utilisant l'api google-->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

	<!--script principal-->
	<script>
		google.charts.load('current', {'packages':['corechart','table']});
		google.charts.setOnLoadCallback(retrieveColumnsNames);
		
		function retrieveColumnsNames(){
			var query = "LIMIT 1";
			var url = "https://docs.google.com/spreadsheets/d/"+
				document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

			var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
			queryEncoded.send(printColumnsNames);

			function printColumnsNames(response){
				if (response.isError()) {
					alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
					return;
				}

				var data = response.getDataTable();

				//var columnsMap = {};
				var fragment = document.createDocumentFragment();

				for(var i =0 ; i<data.getNumberOfColumns(); i++){
					//columnsMap[data.getColumnLabel(i)] = data.getColumnId(i);
					var opt = document.createElement('option');
					opt.innerHTML = data.getColumnLabel(i);
				    opt.value = data.getColumnId(i);
				    fragment.appendChild(opt);
				}

				document.getElementById("columns_names").appendChild(fragment);
			}
		}

		function testQuery() {
			var key = document.getElementById("key").value;
			var select = document.getElementById("select").value;
			var where = document.getElementById("where").value;
			var groupby = document.getElementById("groupby").value;
			var pivot = document.getElementById("pivot").value;
			var orderby = document.getElementById("orderby").value;
			var limit = document.getElementById("limit").value;

			var query = (select!=="") ? "SELECT "+select : "";
			query += (where!=="") ? " WHERE "+where : "";
			query += (groupby!=="") ? " GROUP BY "+groupby : "";
			query += (pivot!=="") ? " PIVOT "+pivot : "";
			query += (orderby!=="") ? " ORDER BY "+orderby : "";
			query += (limit!=="") ? " LIMIT "+limit : "";

			console.log(query);

			var url = "https://docs.google.com/spreadsheets/d/"+key+"/gviz/tq?sheet=Sheet1&headers=1&tq=";
			var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
			
			google.charts.setOnLoadCallback(sendMyQuery);
			
			function sendMyQuery(){
				queryEncoded.send(drawMyReceivedTable);
			}

			function drawMyReceivedTable(response){
				if (response.isError()) {
					alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
					return;
				}

				var data = response.getDataTable();
				console.log("numberOfRows :\ndata: " + data.getNumberOfRows());

				var table = new google.visualization.Table(document.getElementById('table_div'));
				table.draw(data, {showRowNumber : true});
			}

		}
	</script>

</body>
</html>