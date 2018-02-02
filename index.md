# Test de query sur google sheet

<html>
<body>
	<!--formulaire de configuration-->
	<form name="formulaireAjout">
		<input type="text" id="url" placeholder="URL" value='https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq='/>
    <input type="text" id="query1" placeholder="query1" value='SELECT A, B, C, H WHERE D ="-its" AND F = 0 LABEL H "-its"'/>
    <input type="text" id="query2" placeholder="query2" value='SELECT A, B, C, H WHERE D ="-its -smt -ltsminpath" AND F = 0 LABEL H "-its -smt -ltsminpath"'/>
		<input type="button" value="Go" onclick="startQuerying()"/>
	</form>
	<!--div des elements graphiques qui seront ajoutes par les fonctions JS-->
	<div id="table_div" style="width: 600px; height: 300px;"></div>
	<div id="chart_div" style="width: 600px; height: 500px;"></div>
	<!--chargement du loader de lib google charts (+ajax)-->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<!--chargement de la lib google charts-->
	<script type="text/javascript">google.charts.load('current', {'packages':['corechart','table']});</script>
	<!--chargement des fonctions custom JS-->
	<script type="text/javascript" src="functions.js"></script>
</body>
</html>