# Test de query sur google sheet

<html>
<body>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">

      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      //Requete 
      var queryString = encodeURIComponent('SELECT H, F3:F6 LIMIT 5 OFFSET 8');

      var query = new google.visualization.Query(
          'https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryString);
      query.send(handleSampleDataQueryResponse);
    }

    function handleSampleDataQueryResponse(response) {
      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
      }

      var data = response.getDataTable();
      var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
      chart.draw(data, { height: 400 });
    }
  </script>
</body>
</html>