# Test de query sur google sheet

<html>
<body>

	<!--formulaire de configuration-->
	<form name="formulaireAjout">
		<!--URL-->
		<input type="text" id="url" placeholder="URL" value='https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=' />
    <br />
    <!--type de la comparaison-->
    <label for="comparedType">comparer sur</label>
    <select id="comparedType">
	  	<option value="duration" selected="selected">duration(ms)</option>
		</select>
    <br />
		<!--technique en abscisse dans le graphe-->
    <label for="techX">technique en abscisse</label>
    <select id="techX">
	  	<option value="-its" selected="selected">-its</option>
	  	<option value="-its -smt -ltsminpath">-its -smt -ltsminpath</option>
		</select>
    <br />
    <!--technique en ordonnee dans le graphe-->
    <label for="techY">technique en ordonnée</label>
    <select id="techY">
	  	<option value="-its">-its</option>
	  	<option value="-its -smt -ltsminpath" selected="selected">-its -smt -ltsminpath</option>
		</select>
    <br />
    <!--booleen pour enlever les tests failed-->
		<label for="removeFailed">enlever tests failed</label>
    <input type="checkbox" id="removeFailed" />
		<br />
		<!--bouton pour lancer la recherche-->
		<input type="button" value="Go" onclick="startQuerying()" />
		<input type="button" value="chronogramme" onclick="startChrono()" />
	</form>

	<!--div des elements graphiques qui seront ajoutes par les fonctions JS-->
	<div id="table_div" style="width: 600px; height: 200px;"></div>
	<div id="chart_div" style="width: 600px; height: 500px;"></div>
	<div id="chrono_div" style="width: 600px; height: 500px;"></div>

	<!--chargement du loader de lib google charts (+ajax)-->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<!--chargement de la lib google charts-->
	<script type="text/javascript">google.charts.load('current', {'packages':['corechart','table']});</script>
	<script type="text/javascript">
		google.charts.load('current', {'packages':['line']});
		google.charts.setOnLoadCallback(drawChrono);
    </script>
	<!--chargement des fonctions custom JS-->
	<script type="text/javascript" src="functions.js"></script>

</body>
</html>
