onload = function () {
    let curr_data,V,src,dst;
  
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    const temptext2 = document.getElementById('temptext2');
    const cities = ['Delhi', 'Mumbai', 'Gujarat', 'Goa', 'Kanpur', 'Jammu',
     'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya', 'Chennai', 'Mangaluru',
     'Palakkad','Bhopal','Patna','Shimla','Ranchi','Shillong','Lucknow','Kolkata'];
  
    // initialise graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                size: 40,
                color: '#991133',
            }
        }
    };
  
    // Initialize your network!
    // Network for question graph
    const network = new vis.Network(container);
    network.setOptions(options);
    // Network for result graph
    const network2 = new vis.Network(container2);
    network2.setOptions(options);
    
    function createData(){
      const E = [
          [0, 1, 1421],
          [0, 2, 930],
          [0, 3, 1926],
          [0, 4, 486],
          [0, 5, 588],
          [0, 6, 1502],
          [0, 7, 2174],
          [0, 8, 1542],
          [0, 9, 2141],
          [0, 10, 2182],
          [0, 11, 2172],
          [0, 12, 2615],
          [0, 13, 777],
          [0, 14, 1020],
          [0, 15, 344],
          [0, 16, 1161],
          [0, 17, 1844],
          [0, 18, 554],
          [0, 19, 1448],
          [1, 7, 2174], // Mumbai-Bangalore
          [2, 3, 1926], // Gujarat-Goa
          [3, 7, 1926], // Goa-Bangalore
          [10, 7, 371], // Chennai-Bangalore
          [10, 11, 717], // Chennai-Mangaluru
          [10, 12, 606], // Chennai-Palakkad
          [11, 7, 372], // Mangaluru-Bangalore
          [11, 12, 342], // Mangaluru-Palakkad
          [12, 7, 650], // Palakkad-Bangalore
          [13, 18, 378], // Bhopal - Lucknow
          [13, 4, 591], // Bhopal - Kanpur
          [13, 14, 591], // Bhopal - Patna
          [13, 16, 965], // Bhopal - Ranchi
          [13, 17, 1607], // Bhopal - Shillong
          [18, 4, 478], // Lucknow - Kanpur
          [18, 14, 682], // Lucknow - Patna
          [18, 16, 926], // Lucknow - Ranchi
          [18, 17, 1526], // Lucknow - Shillong
          [4, 14, 1151], // Kanpur - Patna
          [4, 16, 974], // Kanpur - Ranchi
          [4, 17, 1662], // Kanpur - Shillong
          [14, 16, 523], // Patna - Ranchi
          [14, 17, 1285], // Patna - Shillong
          [16, 17, 818], // Ranchi - Shillong,
          [5, 8, 1730], // Jammu - Gangtok
          [5, 17, 1844], // Jammu - Shillong
          [5, 19, 1448], // Jammu - Kolkata
          [15, 8, 1490], // Shimla - Gangtok
          [15, 17, 1594], // Shimla - Shillong
          [15, 19, 1512], // Shimla - Kolkata
          [8, 17, 157], // Gangtok - Shillong
          [8, 19, 706], // Gangtok - Kolkata
          [17, 19, 881] // Shillong - Kolkata
          ];
        V = 20; // Ensures V is between 3 and 10
        let nodes = [];
        for(let i=0;i<V;i++){
            nodes.push({id:i, label: cities[i]})
        }
        // Prepares vis.js style nodes for our data
        nodes = new vis.DataSet(nodes);
  
        // Creating a tree like underlying graph structure
        let edges = [];
        for(let i=0;i<E.length;i++){
            edges.push({type: 0,from: E[i][0], to: E[i][1], color: 'orange',label: String(E[i][2])});
        }
        edges.push({type: 1,from: 0, to: 19, color: 'green',label: String(15)});
  
        
  
        // Setting the new values of global variables
        var src, dst;
        solve.onclick = async function () {
            src = (document.getElementById('source').value);
            dst = (document.getElementById('destination').value);
            console.log(src,dst);
            solved(src,dst);
        }
        console.log(src,dst);
        
        curr_data = {
            nodes: nodes,
            edges: edges
        };
    }
  
    genNew.onclick = function () {
        // Create new data and display the data
        createData();
        network.setData(curr_data);
        temptext2.innerText = 'Find least time path from '+cities[src]+' to '+cities[dst];
        temptext.style.display = "inline";
        temptext2.style.display = "inline";
        container2.style.display = "none";
  
    };
  
    function solved(src,dst){
        // Create graph from data and set to display
        temptext.style.display  = "none";
        temptext2.style.display  = "none";
        container2.style.display = "inline";
        network2.setData(solveData(src,dst));
    };
  
    function djikstra(graph, sz, src) {
        let vis = Array(sz).fill(0);
        let dist = [];
        for(let i=0;i<sz;i++)
            dist.push([10000,-1]);
        dist[src][0] = 0;
  
        for(let i=0;i<sz-1;i++){
            let mn = -1;
            for(let j=0;j<sz;j++){
                if(vis[j]===0){
                    if(mn===-1 || dist[j][0]<dist[mn][0])
                        mn = j;
                }
            }
  
            vis[mn] = 1;
            for(let j in graph[mn]){
                let edge = graph[mn][j];
                if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
                    dist[edge[0]][0] = dist[mn][0]+edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }
  
        return dist;
    }
  
    function createGraph(data){
        let graph = [];
        for(let i=0;i<V;i++){
            graph.push([]);
        }
  
        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            if(edge['type']===1)
                continue;
            graph[edge['to']].push([edge['from'],parseInt(edge['label'])]);
            graph[edge['from']].push([edge['to'],parseInt(edge['label'])]);
        }

        return graph;
    }
  
    function shouldTakePlane(edges, dist1, dist2, mn_dist) {
        let plane = 0;
        let p1=-1, p2=-1;
        for(let pos in edges){
            let edge = edges[pos];
            if(edge['type']===1){
                let to = edge['to'];
                let from = edge['from'];
                let wght = parseInt(edge['label']);
                if(dist1[to][0]+wght+dist2[from][0] < mn_dist){
                    plane = wght;
                    p1 = to;
                    p2 = from;
                    mn_dist = dist1[to][0]+wght+dist2[from][0];
                }
                if(dist2[to][0]+wght+dist1[from][0] < mn_dist){
                    plane = wght;
                    p2 = to;
                    p1 = from;
                    mn_dist = dist2[to][0]+wght+dist1[from][0];
                }
            }
        }
        return {plane, p1, p2};
    }
  
    function solveData(src,dst) {
  
        const data = curr_data;
  
        // Creating adjacency list matrix graph from question data
        const graph = createGraph(data);
  
        // Applying djikstra from src and dst
        let dist1 = djikstra(graph,V,src);
        let dist2 = djikstra(graph,V,dst);
  
        // Initialise min_dist to min distance via bus from src to dst
        let mn_dist = dist1[dst][0];
  
        // See if plane should be used
        let {plane, p1, p2} = shouldTakePlane(data['edges'], dist1, dist2, mn_dist);
  
        let new_edges = [];
        if(plane!==0){
            new_edges.push({arrows: { to: { enabled: true}}, from: p1, to: p2, color: 'green',label: String(plane)});
            // Using spread operator to push elements of result of pushEdges to new_edges
            new_edges.push(...pushEdges(dist1, p1, false));
            console.log(p1,p2);
            new_edges.push(...pushEdges(dist2, p2, true));
        } else{
        new_edges.push(...pushEdges(dist1, dst, false));
        }
        const ans_data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return ans_data;
    }
  
    function pushEdges(dist, curr, reverse) {
        let tmp_edges = [];
        while(dist[curr][0]!==0){
            let fm = dist[curr][1];
            if(reverse)
                tmp_edges.push({arrows: { to: { enabled: true}},from: curr, to: fm, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            else
                tmp_edges.push({arrows: { to: { enabled: true}},from: fm, to: curr, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return tmp_edges;
    }
  
    genNew.click();
  };