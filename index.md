# Index

[DIY test a Query](test.html){:target="_blank"}
| 
[upload page](uploadLogs/upload.html){:target="_blank"}

<html>
<body>
	<div style="
	            width: auto;
	            height: auto;
	            padding: 10px;
	            border-radius: 8px;
	            background: #E4E0EF;
	            box-shadow: 0 0 10px rgba( 0, 0, 0, 0.5),0 -1px 0 rgba( 255, 255, 255, 0.4);
                ">
		<!--URL-->
		<h1 style="
				font-family: Arial,sans-serif;
				font-size: 2em;
				color: #000;
				text-shadow: 0px 1px 0px white;
				text-shadow: 0px 1px 0px rgba( 255, 255, 255, 0.2);
                ">Chargement des données</h1>
		<label for="key">Spreadsheet à analyser :</label>
		<input type="text" id="key" placeholder="Spreadsheet Key" value="197-GlM8Lqk_ozBFgyoObUq7CnM03EIyEKMDK9DuMrNk" />
		<!--choix de keyss preremplies-->
		<label for="keysChoice"> ou </label>
		<select id="keysChoice" onclick='document.getElementById("key").value = document.getElementById("keysChoice").value ;'>
			<option value="1ZLSqWxT4YT8zhg84WeoeGjCxDbuOWO_BVvS9J3IBKgo">csv001-100</option>
			<option value="1k1vyrsKs8A8aXDs4HkwkgHPCWvW-41h_F6PS93GHjbo">csv101-200</option>
			<option value="1MCmsdKAIQKuC9amV3V2XeKL6GpCxNG5aeU0byjt8agg">csv201-300</option>
			<option value="1FxiAz3-yENo_WQyM9_g8m9r_7BTYlu1Isqe5iuWcPUo">csv301-400</option>
			<option value="1Yhsm4LnZvbe-dEENoEKff-Z0Zfa2zu-GN_Aa3NJDbco">csv401-500</option>
			<option value="197-GlM8Lqk_ozBFgyoObUq7CnM03EIyEKMDK9DuMrNk" selected>logBig0304</option>
		</select>
		<!--reload menu button-->
		<input type="button" value="Load Menu" onclick="initialisation()" />
	</div>
		<br />
		<br />	
	<!--formulaire de configuration-->
	<div style="
	            width: auto;
	            height: auto;
	            padding: 10px;
	            margin-bottom: 20px;
	            border-radius: 6px;
	            background: #E4E0EF;
	            box-shadow: 0 0 10px rgba( 0, 0, 0, 0.5),0 -1px 0 rgba( 255, 255, 255, 0.4); 
	            " >

	    <h1>Comparaison de deux Techniques dans un Scatter Chart</h1>
		<form id="formConfig" name="monformScatter">
		<table>
		   <tr>
		       <td><label for="comparedType">comparer sur </label></td>
		       <td><select id="comparedType" style="display:none"></select></td>
		   </tr>
		   <tr>
		       <td><label for="techX">technique en abscisse :</label></td>
		       <td><select id="techX" style="display:none" onchange="retrieveVersionsNames('X')"></select></td>
		   </tr>
		   <tr>
		       <td><label for="versionX">Version en X:</label></td>
		       <td><select id="versionX" style="display:none"></select></td>
		   </tr>
		   <tr>
		       <td><label for="techY">technique en ordonnée :</label></td>
		       <td><select id="techY" style="display:none" onchange="retrieveVersionsNames('Y')"></select></td>
		   </tr>
		   <tr>
		       <td><label for="versionY">Version en Y:</label></td>
		       <td><select id="versionY" style="display:none"></select></td>
		   </tr>
		   <tr>
		       <td><label for="removeFailed">enlever les tests failed</label></td>
		       <td><input type="checkbox" id="removeFailed" checked /></td>
		   </tr>
		   <tr>
		       <td></td>
		       <td><input type="button" value="Scatter Chart" onclick="google.charts.setOnLoadCallback(startScatterChart)" /></td>
		   </tr>
        </table>
		<!--plage de builds-		
			<!--technique en abscisse dans le graphe-->	
			<!--version de la technique en abscisse-->			
			<!--technique en ordonnee dans le graphe-->		
			
			<!--version de la technique en ordonnee-->	

			<!--booleen pour enlever les tests failed-->		
			
			<!--bouton pour lancer la recherche ScatterChart
				setOnLoadCallBack prend le nom d'une fonction en argument, et la lance
				(seulement si les librairies JS de google ont fini de charger)-->

		</form>
		<div id="dashboard_div1">
      		<!--Divs that will hold each control and chart-->
      		<div id="filter_div"></div>
      		<div id="chart_div"></div>
   		</div>
	</div>
	<!-- dvi pour le chronogramme -->
	<div  style="
	            width: auto;
	            height: auto;
	            padding: 10px;
	            border-radius: 6px 6px 0px 0px;
	            background: #E4E0EF;
	            box-shadow: 0 0 10px rgba( 0, 0, 0, 0.5),0 -1px 0 rgba( 255, 255, 255, 0.4); 
	            ">
		<h1>Visualisation des Models dans un Chronogramme </h1>
		<form id="formConfig" name="monformChrono">
		<table>
   			<tr>
		       <td><label for="comparedColumn"> comparer sur :</label></td>
		       <td><select id="comparedColumn" style="display:none"></select></td>
		   	</tr>
		   	<tr>
		       	<td><label for="aggreg"> aggréger sur </label></td>
		       	<td>
		       		<select id="aggreg">
						<option value="avg">average</option>
						<option value="count">count</option>
						<option value="max">max</option>
						<option value="min">min</option>
						<option value="sum" selected>sum</option>
					</select>
		       	</td>
		   	</tr>
		   	<tr>
		       	<td><label for="techChrono">Technique :</label></td>
		       	<td>
		       		<select id="techChrono" onchange="funExa(this.value)" style="display:none"></select>
				</td>
		   	</tr>
		   	<tr>
		       	<td><label for="examination"> examination :</label></td>
		       	<td><select id="examination" name="examination" style="display:none"></select></td>
		   	</tr>
		   	<tr>
		   		<td><label for="model">modèle :</label></td>
				<td><input type="text" id="model" placeholder=".*" value="AirplaneLD-COL-0010" /></td>
		   	</tr>
		   	<tr>
		       	<td><label for="regex">Regex ?</label></td>
		       	<td><input type="checkbox" id="regex" checked /></td>
		   	</tr>
		   	<tr>
		       	<td><label for="removeFailedChrono">enlever les tests failed</label></td>
		       	<td><input type="checkbox" id="removeFailedChrono" checked /></td>
		   </tr>
		   <tr>
		       <td></td>
		       <td><input type="button" value="Chronogramme" onclick="google.charts.setOnLoadCallback(drawChronoAffiche())" /></td>
		   </tr>
        </table>
    </form>
    <div id="chrono_div"></div>
	<div id="table_div"></div>
	<div id="dashboard_div">
      <!--Divs that will hold each control and chart-->
      <div id="colFilter_div"></div>
      <div id="chart_div"></div>
      <div id="Reachability_div"></div>
      <div id="Cardinality_div"></div>
    </div>
	</div>
	

	<!--chargement du loader de lib google charts (+ajax)-->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	
	<!--chargement de la lib google charts-->
	<script type="text/javascript">google.charts.load('current', {'packages':['corechart','table']}); google.charts.load('current');</script>

	<!--chargement des fonctions custom JS-->
	<script type="text/javascript" src="functions.js"></script>
	<script type="text/javascript" src="init.js"></script>
	<script type="text/javascript">initialisation();</script>

</body>
</html>