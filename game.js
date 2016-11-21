var first_click = null;
var second_click = null;

var nb_rows = 9;
var nb_cols = 11;

var pipe_names = [
    "horizontal",
    "vertical",
    "cross",
    "corner_top_right",
    "corner_top_left",
    "corner_bottom_right",
    "corner_bottom_left",
    "sink_right",
    "source_left",
    "empty"
];

var static_pipe_names = [
    "sink_right",
    "source_left"
];

var play_pipe_names = [
    "horizontal",
    "vertical",
    "cross",
    "corner_top_right",
    "corner_top_left",
    "corner_bottom_right",
    "corner_bottom_left"
];

function add_score(partial){
  var e = document.getElementById("score")
  e.innerHTML = "" + (parseInt(e.innerHTML) + partial);
}

function set_score(partial){
  var e = document.getElementById("score");
  e.innerHTML = "" + partial;
}

function get_pipe_url(pipe_name, ext){
  if(!ext){
    ext = "png";
  }
  return "url(\"Images/pipe_" + pipe_name + "." + ext + "\")"
}

function get_pipe_index(element){
  var id = element.id;
  var re = /idx_(\d+)_(\d+)/;
  var match = re.exec(id);
  return [parseInt(match[1]), parseInt(match[2])];
}

function get_pipe_name(element){
  var url = element.style.background;
  var re = /url\(\"?.*\/?Images\/pipe_(.*)\....\"?\).*/
  var match = re.exec(url);
  if(match){
    return match[1];
  }
}

function set_pipe(element, pipe_name){
    var pipe_url = get_pipe_url(pipe_name);
    element.style.background = pipe_url;
    element.style.backgroundSize = "100%";
    element.style.backgroundRepeat = "no-repeat";
}

function random_pipe_name(){
  var random_idx = Math.floor(Math.random()*play_pipe_names.length);
  return play_pipe_names[random_idx];
}

function index_to_pipe(idx1, idx2){
  return document.getElementById("idx_"+idx1+"_"+idx2);
}

function new_game(){

  set_score(0);

  //first column are the sources
  for(var i=0; i<nb_rows; ++i){
    set_pipe(index_to_pipe(i, 0), "source_left");
  }
  //last column are the sources
  for(var i=0; i<nb_rows; ++i){
    set_pipe(index_to_pipe(i, nb_cols-1), "sink_right");
  }
  //rest is random
  for(var i=0; i<nb_rows; ++i){
    for(var j=1; j<nb_cols-1; ++j){
      set_pipe(index_to_pipe(i, j), random_pipe_name());
    }
  }

  reset_water();
}

function rotate(element){
  var name = get_pipe_name(element);
  if (name == "corner_top_right"){
    set_pipe(element, "corner_bottom_right");
    reset_water();
    return;
  }
  if (name == "corner_top_left"){
    set_pipe(element, "corner_top_right");
    reset_water();
    return;
  }
  if (name == "corner_bottom_right"){
    set_pipe(element, "corner_bottom_left");
    reset_water();
    return;
  }
  if (name == "corner_bottom_left"){
    set_pipe(element, "corner_top_left");
    reset_water();
    return;
  }
  if (name == "horizontal"){
    set_pipe(element, "vertical");
    reset_water();
    return;
  }
  if (name == "vertical"){
    set_pipe(element, "horizontal");
    reset_water();
    return;
  }
}

function destroy_pipes(elements, callback){
  //Make an explosion!
  elements.forEach(function(e){
    var pipe_url = "url(\"Images/explosion.gif\")";
    e.style.background = pipe_url;
  });
  //Set elements to empty
  setTimeout(function(){
    elements.forEach(function(e){
      set_pipe(e, "empty");
    });
    callback();
  }, 450);
}

function are_pipes_adjacent(e1, e2){
  var idx1 = get_pipe_index(e1);
  var idx2 = get_pipe_index(e2);
  return ((idx1[1] == idx2[1]) && (Math.abs(idx1[0] - idx2[0])==1))
       ||((idx1[0] == idx2[0]) && (Math.abs(idx1[1] - idx2[1])==1))
}

function swap_pipes(e1, e2){
    var name1 = get_pipe_name(e1);
    var name2 = get_pipe_name(e2);
    set_pipe(e1, name2);
    set_pipe(e2, name1);
}

function get_pipe_connections(e){

  var name = get_pipe_name(e);

  if(name == "horizontal"){
    return {top:false, bottom:false, left:true, right:true};
  }

  if(name == "vertical"){
    return {top:true , bottom:true, left:false, right:false};
  }

  if(name == "cross"){
    return {top:true , bottom:true, left:true, right:true};
  }

  if(name == "corner_top_right"){
    return {top:true , bottom:false, left:false, right:true};
  }

  if(name == "corner_top_left"){
    return {top:true , bottom:false, left:true, right:false};
  }

  if(name == "corner_bottom_right"){
    return {top:false, bottom:true, left:false, right:true};
  }

  if(name == "corner_bottom_left"){
    return {top:false, bottom:true, left:true, right:false};
  }

  if(name == "sink_right"){
    return {top:true, bottom:true, left:true, right:false};
  }

  if(name == "source_left"){
    return {top:true, bottom:true, left:false, right:true};
  }
    
  return {top:false, bottom:false, left:false, right:true};
}

function are_pipes_connected(e1, e2){
  if (!e1 || !e2 || !are_pipes_adjacent) return false;

  var idx1 = get_pipe_index(e1);
  var idx2 = get_pipe_index(e2);

  if (idx1[0] == idx2[0]){ // horizontal
    var rightmost = (idx1[1]>idx2[1]) ? e1 : e2;
    var leftmost = (idx1[1]>idx2[1]) ? e2 : e1;
    var left_connections = get_pipe_connections(leftmost);
    var right_connections = get_pipe_connections(rightmost);
    return (left_connections.right && right_connections.left); 
  }

  if (idx1[1] == idx2[1]){ //vertical
    var topmost = (idx1[0]>idx2[0]) ? e2 : e1;
    var lowermost = (idx1[0]>idx2[0]) ? e1 : e2;
    var top_connections = get_pipe_connections(topmost);
    var bottom_connections = get_pipe_connections(lowermost);
    return (top_connections.bottom && bottom_connections.top); 
  }

  return false;
}

function mark_connected_pipes(){
  var searched = [
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
  ];

  function search_index(e, idx1, idx2){
    var adj = index_to_pipe(idx1, idx2);
    if (adj && !searched[idx1][idx2] && are_pipes_connected(e, adj)){
      search(adj);
    }
  }

  function search(e){
    var idx = get_pipe_index(e);
    mark_has_water(e);
    searched[idx[0]][idx[1]] = 1;

    search_index(e, idx[0]+1,idx[1]);
    search_index(e, idx[0]-1,idx[1]);
    search_index(e, idx[0],idx[1]+1);
    search_index(e, idx[0],idx[1]-1);
  }

  search(index_to_pipe(0,0));
}

function mark_has_water(e){
  e.style.filter = "hue-rotate(120deg)";
  e.style.WebkitFilter = "hue-rotate(120deg)";
}

function mark_no_water(e){
  e.style.filter = "";
  e.style.WebkitFilter = "";
}

function has_water(e){
  return (e.style.filter == "hue-rotate(120deg)") 
          || (e.style.WebkitFilter == "hue-rotate(120deg)");
}


function reset_water(){
  for(var i=0; i<nb_rows; ++i){
    for(var j=0; j<nb_cols; ++j){
      mark_no_water(index_to_pipe(i,j));
    }
  }

  mark_connected_pipes();
  destroy_percolated_pipes();
}

function does_board_percolate(){
  var e1 = index_to_pipe(0,0);
  var e2 = index_to_pipe(0,10);
  return (has_water(e1) && has_water(e2));
}

function destroy_percolated_pipes(){
  if (!does_board_percolate()){return;}

  var partial_score = 0;
  var toDestroy =[];
  for(var i=0; i<nb_rows; ++i){
    for(var j=1; j<nb_cols-1; ++j){
      var e = index_to_pipe(i,j);
      if(has_water(e)){
        mark_no_water(e);
        partial_score += 10;
        toDestroy.push(e);
      }
    }
  }
  destroy_pipes(toDestroy, function(){
    add_score(partial_score);
    reset_water();
    push_down_board();
  });
}

function push_down_board(){
  top_is_empty=false;
  for(var i=nb_rows-1; i>=0; --i){
    for(var j=1; j<nb_cols-1; ++j){
      var e1 = index_to_pipe(i, j);
      var e2 = index_to_pipe(i+1, j);

      if(e2 && get_pipe_name(e1) != "empty" 
            && get_pipe_name(e2) == "empty"){
        swap_pipes(e1, e2);
      }
    }
  }
  var top_is_empty = false;
  for(var j=1;j<nb_cols-1;++j){
    var e = index_to_pipe(0, j);
    if(get_pipe_name(e) == "empty"){
      top_is_empty = true;
      set_pipe(e, random_pipe_name());
    } 
  }
  if(top_is_empty){
    setTimeout(push_down_board, 250);
  }else{
    reset_water();
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  new_game();
  document.getElementById("restart").addEventListener("click", new_game);
  cells = document.querySelectorAll("#game_table td");
  for(var i=0; i<cells.length; ++i){
    (cells[i]).addEventListener("click", function(ev){rotate(ev.currentTarget)});
  }
});
