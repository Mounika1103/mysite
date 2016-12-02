(function( $ ){
   $.fn.weighted_tree = function(options) {            
      
      // Default options.
      var settings = $.extend({
          // These are the defaults.
          configurationPath: "config_matrix.json",
          treePath: "tree.json"
      }, options );
      
      var treeGraphDiv = $('<div class="tree-graph"></div>');
      
      var pieChartDiv = $('<div class="piechart-container"></div>')
      var tableDiv = $('<div class="table-container"></div>')   
      var dataTable = $('<table class="table"></table>');   
      
      tableDiv.append(dataTable);      

      this.append(treeGraphDiv);
      this.append(tableDiv);
      this.append(pieChartDiv);

      var margin = {top: 20, right: 50, bottom: 20, left: 50},
          width = 1000 - margin.right - margin.left,
          height = 500 - margin.top - margin.bottom;

      var scale = 1, translation = [50, 0];

      var i = 0,
          duration = 750,
          root;

      var tree = d3.layout.tree()
          .size([height, width]);

      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });

      var svg = d3.select(treeGraphDiv.get(0)).append("svg")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
          .on("click", function(e) {     
              if (d3.event.target.nodeName == 'svg') {            
                  circles = d3.selectAll(".selected").classed("selected", false);
                  pieChartDiv.hide();         
                  tableDiv.hide();
              }
          })   
          .append("g")
          .attr("class","drawarea")           
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var configMatrix = [];
    
      weight = function(node) {          
          if (node != undefined || node != null) {
              var conf = $.grep(configMatrix, function (e) { return e.Nodes == node.name; });
          
              if (conf[0] != undefined && conf[0].size != undefined && conf[0].size != "") {
                  return conf[0].size;    
              }
          }
          // Default weight
          return 6;  
      }

      $.getJSON(settings.configurationPath, function(configJson) {

          configMatrix = configJson;

          d3.json(settings.treePath, function(error, flare) {
              if (error) throw error;

              root = flare;
              root.x0 = height / 2;
              root.y0 = 0;

              function collapse(d) {
                  if (d.children) {
                      d._children = d.children;
                      d.weight = weight(d);
                      d._children.forEach(collapse);
                      d.children = null;
                  }
                  else {
                      d.weight = weight();
                  }
              }
              
              root.weight = weight(root);
              root.children.forEach(collapse);
              update(root);
          });
      });

      d3.select(self.frameElement).style("height", "500px");
      
      function update(source) {

          duration = d3.event && d3.event.altKey ? 5000 : 500;

          var datatip='<div class="node-tooltip" style="width: 200px; background-opacity:.5">' +
              '<div class="header1">HEADER1</div>' +
              'AGGREGATES' +     
              '</div>';

          function onMouseOut(e,d,i) {
              d3.selectAll(".vz-weighted_tree-tip").remove();
          }

          // This function uses the above html template to replace values and then creates a new <div> that it appends to the
          // document.body.  This is just one way you could implement a data tip.
          function createDataTip(node) {

              var html = datatip.replace("HEADER1", node.name);
              
              var aggregates = '';
              
              var ignored_properties = ['parent','_children','children','id','x', 'x0', 'y','y0', 'depth', 'weight', 'name'];      
              for (var key in node) {
                if (!(ignored_properties.includes(key))) {
                  aggregates += '<div class="header2">' + key + ": " + node[key] + '</div><div class="header-rule"></div>';
                }
              }
              
              html = html.replace("AGGREGATES", aggregates);

              d3.select(treeGraphDiv.get(0))
                  .append("div")
                  .attr("class", "vz-weighted_tree-tip")
                  .style("position", "absolute")
                  .style("top", (node.x + translation[1]) * scale + "px")
                  .style("left", node.y > 200 ? (node.y + 30 + translation[0]) * scale + "px" : (node.y + 30 + translation[0]) * scale + "px" )
                  .style("opacity",0)
                  .html(html)
                  .transition().style("opacity",1);
          }

          // Compute the new tree layout.
          var nodes = tree.nodes(root).reverse(),
              links = tree.links(nodes);

          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 140; });

          // Update the nodes…
          var node = svg.selectAll("g.node")
              .data(nodes, function(d) { return d.id || (d.id = ++i); });

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
              .on("mouseover", createDataTip)
              .on("mouseout", onMouseOut)
              .on("click", click);

          nodeEnter.append("circle")
              .attr("r", 1e-6)
              .style("fill", function(d) { return d.children || d._children ? getNodeColor(d) : "#fff"; });

          nodeEnter.append("text")
              .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
              .attr("dy", ".35em")
              .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text(function(d) { return d.name; })
              .style("fill-opacity", 1e-6);

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

          nodeUpdate.select("circle")
              .attr("class", function(d) { return d == selected ? "selected" : "" })
              .style("stroke", function(d) { return getNodeColor(d) })               
              .attr("r", function(d) { return d.weight })
              .style("fill", function(d) { 
                  return d.children || d._children ? getNodeColor(d) : "#fff"; 
              });

          nodeUpdate.select("text")
              .style("fill-opacity", 1);

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
              .remove();

          nodeExit.select("circle")
              .attr("r", 1e-6);

          nodeExit.select("text")
              .style("fill-opacity", 1e-6);

          // Update the links…
          var link = svg.selectAll("path.link")
              .data(links, function(d) { return d.target.id; });

          function getNodeColor(node) {
              var type = $.grep(configMatrix, function (e) { return e.Nodes == node.name; });
              if (type[0] != undefined && type[0].color != undefined && type[0].color != "") {
                  return type[0].color;    
              }
              else  {
                  if (node.parent) {
                      return getNodeColor(node.parent);
                  }
                  else {
                      return "#ccc";
                  }
              }                              
          } 

          // Enter any new links at the parent's previous position.
          link.enter().insert("path", "g")
              .attr("class", "link")   
              .style("stroke-width", function(d) { return weight(d.target)*2 })
              .style("stroke", function(d) { return getNodeColor(d.target) })         
              .attr("d", function(d) {
                  var o = {x: source.x0, y: source.y0};
                  return diagonal({source: o, target: o});
              });

          // Transition links to their new position.
          link.transition()
              .duration(duration)
              .attr("d", diagonal);

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
              .duration(duration)
              .attr("d", function(d) {
                  var o = {x: source.x, y: source.y};
                  return diagonal({source: o, target: o});
              })
              .remove();

          // Stash the old positions for transition.
          nodes.forEach(function(d) {
              d.x0 = d.x;
              d.y0 = d.y;
          });

          d3.select("svg")
              .call(d3.behavior.zoom()
                  .scaleExtent([1, 1])
                  .on("zoom", zoom));
      }


      function zoom() {
          scale = d3.event.scale;
          translation = d3.event.translate;
          var tbound = -height * scale,
              bbound = height * scale,
              lbound = (-width + margin.right) * scale,
              rbound = (width - margin.left) * scale;

          // limit translation to thresholds
          translation = [
              Math.max(Math.min(translation[0], rbound), lbound),
              Math.max(Math.min(translation[1], bbound), tbound)
          ];
          d3.select(".drawarea")
              .attr("transform", "translate(" + translation + ")" +
                    " scale(" + scale + ")");
      }

      var table;

      // Toggle table or chart on click
      function toggleDetails(d) {    

          var type = $.grep(configMatrix, function (e) { return e.Nodes == d.name; });         

          pieChartDiv.hide();         
          tableDiv.hide();      
          
          if (typeof type[0] !== 'undefined' && type[0] !== null) {
              config = type[0];    
                  
              if (config.hasOwnProperty("Display item")) {
                  if (config["Display item"] == "Tabular grid" ) {  
                        
                      $.getJSON(config["Source object"], function (dataSet) {                                                         
                          tableDiv.show();
                  
                          if (table != undefined || table != null) {
                              table.destroy();
                              dataTable.empty();
                          }                        
                  
                      columns = [];
                  
                      for (var key in dataSet[0]) {
                          columns.push({ data: key, title: key });
                      }
                     
                  table = dataTable.DataTable( {            
                    data: dataSet,
                    columns: columns,
                    responsive: true,
                    "scrollX": true,
                    dom: 'Bfrtip',
                    buttons: [
                        'csv', 'pdf', 'print', 
                        {
                            text: 'Email',
                            action: function ( e, dt, node, config ) {
                                data = dt.buttons.exportData();
                                htmltable = "<table><tr>"
                                for (var col in data.header) {
                                    htmltable += "<th>" + data.header[col] + "</th>";
                                }
                                htmltable += "</tr>";
                                for (var row in data.body) {
                                    tablerow = "";
                                    for (cell in data.body[row]) {
                                        tablerow += "<td>" + data.body[row][cell] + "</td>";
                                    }
                                    htmltable += tablerow;
                                }

                                $('#email-modal').on('show.bs.modal', function (event) {
                                    var button = $(event.relatedTarget) // Button that triggered the modal
                                    //var recipient = button.data('whatever') // Extract info from data-* attributes
                                    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                                    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                                    var modal = $(this)
                                    modal.find('.modal-title').text('Send table data via email')
                                    modal.find('#recipient-name').val('')                            
                                    modal.find('#subject').val('')                                                        
                                    modal.find('#table-data').val(htmltable)
                                })
                                
                                $('#email-modal').modal();
                                
                                $('#email-form').submit(function(e){
                                    e.preventDefault(); // avoid to execute the actual submit of the form.
                                    
                                    var url = $(this).attr('action'); // the script where you handle the form input.

                                    $.ajax({
                                        type: "POST",
                                        url: url,
                                        data: $(this).serialize(), // serializes the form's elements.
                                        success: function(data)
                                        {
                                            $('#email-modal').modal('hide');
                                        },
                                        error: function(data)
                                        {
                                            alert('Not implemented');
                                        }
                                    });                            
                                });
                                
                                $('#btn-submit').click(function(){
                                    $('#email-form').submit();
                                });
                            }
                        }
                    ]
                  });                                  
                });
              }                                    
            }
          }  
      }

      var selected = null;

      // Toggle children on click.
      function click(d) {
          if (d.children) {
              d._children = d.children;
              d.children = null;        
          } else {
              d.children = d._children;
              d._children = null;
          }      

          selected = d;

          update(d);
          
          toggleDetails(d);
      }
      
      return this;
   }; 
})( jQuery );

    
    
    

    

    
