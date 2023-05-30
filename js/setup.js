onload = function () {
    let curr_data,V,src,dst;
  
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    const temptext2 = document.getElementById('temptext2');
    const cities = ['Delhi', 'Mumbai', 'Ahmedabad', 'Goa', 'Jammu',
    'Hyderabad', 'Bangalore', 'Chennai', 'Mangaluru','Bhopal','Shimla','Shillong','Lucknow','Kolkata'];
  
    // initialise graph options
    const options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 12
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'image',
            image: 'location.webp',
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
          [0, 1, 24.00],
          [0, 10, 11.07],
          [0, 12, 7.83],
          [1, 2, 8.88],
          [1, 3, 26.43],
          [1, 13, 22.42],
          [2, 3, 23.25],
          [2, 4, 20.93],
          [2, 12, 11.67],
          [2, 13, 15.48],
          [3, 5, 26.50],
          [3, 10, 25.45],
          [3, 12, 27.42],
          [4, 5, 24.65],
          [4, 9, 15.63],
          [4, 10, 15.85],
          [5, 6, 8.02],
          [5, 7, 12.03],
          [5, 8, 16.95],
          [5, 9, 14.98],
          [5, 13, 9.93],
          [6, 7, 6.18],
          [6, 8, 10.35],
          [6, 9, 7.68],
          [6, 10, 48.70],
          [13, 11, 23.42],
          [6, 13, 18.77],
          [7, 8, 3.40],
          [7, 9, 22.68],
          [8, 9, 23.23],
          [8, 10, 21.32],
          [9, 13, 16.42],
          [10, 12, 21.58],
          [12, 13, 17.53]
        ];
        F=
        [
            [0, 1, 2.5],
            [0, 5, 2.0],
            [0, 6, 2.5],
            [0, 7, 2.5],
            [0, 13, 2.5],
            [1, 5, 1.5],
            [1, 6, 2.0],
            [1, 7, 2.0],
            [1, 13, 2.5],
            [5, 13, 2.5],
            [6, 7, 1.5],
            [6, 13, 2.5],
            [7, 13, 2.5],
            ]
        V = 14; 
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
        for(let i=0;i<F.length;i++){
            edges.push({type: 1,from: F[i][0], to: F[i][1], color: 'green',label: String(F[i][2])});
        }
  
        
  
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
            {
                continue;
            }

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