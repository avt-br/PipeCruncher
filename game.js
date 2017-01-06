
function pointsObjective(nbPoints) {
  return function(){
   return get_score() >= nbPoints;
  };
}

function createSimpleBoard()
{
   for(var i=0; i<nb_rows; ++i){
     for(var j=0; j<nb_cols; ++j){
       set_pipe(index_to_pipe(i, j), random_pipe_name());
     }
   }
}

function popup(text, button_text, callback){
  document.getElementById("popup_text").innerHTML = text;
  document.getElementById("popup_button").innerHTML = button_text;
  document.getElementById("popup").style.display = "block";
  document.getElementById("popup_button").addEventListener("click",
      function popup_callback(){
        document.getElementById("popup").style.display = "none";
        document.getElementById("popup_button").removeEventListener("click", popup_callback);
        if(callback){
          callback();
        }
      });
}
var activeLevel = 0; 

var levels = [];
levels[0] = {
  nbMoves: 30,
  completedObjective: pointsObjective(1000),
  boardGenerator: createSimpleBoard,
  description: "Reach 1000 Points!"
}
levels[1] = {
  nbMoves: 30,
  completedObjective: pointsObjective(2000),
  boardGenerator: createSimpleBoard,
  description: "Reach 2000 Points!"
}
levels[2] = {
  nbMoves: 40,
  completedObjective: pointsObjective(3000),
  boardGenerator: createSimpleBoard,
  description: "Reach 3000 Points!"
}
levels[3] = {
  nbMoves: 99999999999,
  completedObjective: function(){return false;},
  boardGenerator: createSimpleBoard,
  description: "Sandbox Mode!\nHave Fun!"
}
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
    "empty",
    "t_junction_right_down_left",
    "t_junction_down_left_top",
    "t_junction_left_top_right",
    "t_junction_top_right_down"
];

var static_pipe_names = [
  "boulder"
];

var play_pipe_names = [
    "horizontal",
    "vertical",
    "cross",
    "corner_top_right",
    "corner_top_left",
    "corner_bottom_right",
    "corner_bottom_left",
    "t_junction_right_down_left",
    "t_junction_down_left_top",
    "t_junction_left_top_right",
    "t_junction_top_right_down"
];

function set_level(new_level){
  var e = document.getElementById("level");
  e.innerHTML = "" + new_level;
}

function get_level(){
  var e = document.getElementById("level");
  return parseInt(e.innerHTML); 
}

function set_moves(new_moves){
  var e = document.getElementById("moves");
  e.innerHTML = "" + new_moves;
}

function get_moves(){
  var e = document.getElementById("moves");
  return parseInt(e.innerHTML); 
}

function set_score(new_score){
  var e = document.getElementById("score");
  e.innerHTML = "" + new_score;
}

function get_score(){
  var e = document.getElementById("score");
  return parseInt(e.innerHTML); 
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

function new_game(level){
  set_score(0);
  set_moves(level.nbMoves);
  level.boardGenerator();
  popup(level.description, "Go");
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
  var partial_score = elements.length*10;
  set_score(get_score()+partial_score);
  
  //Make an explosion!
  var explosion_url = "url(\"Images/explosion.gif\")";
  for(var i=0; i<elements.length; ++i){
    elements[i].style.background = explosion_url;
  }
  //Set elements to empty
  setTimeout(function(){
    for(var i=0; i<elements.length; ++i){
      set_pipe(elements[i], "empty");
    }
    push_down_board(callback);
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
    
  if(name == "t_junction_right_down_left"){
    return {top:false, bottom:true, left:true, right:true};
  }
  
  if(name == "t_junction_down_left_top"){
    return {top:true, bottom:true, left:true, right:false};
  }

  if(name == "t_junction_left_top_right"){
    return {top:true , bottom:false, left:true, right:true};
  }
  
  if(name == "t_junction_top_right_down"){
    return {top:true , bottom:true, left:false, right:true};
  }

    return {top:false, bottom:false, left:false, right:false};
}

function are_pipes_connected(e1, e2){
  if (!e1 || !e2 || !are_pipes_adjacent(e1,e2)) return false;

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
}

function mark_no_water(e){
  e.style.filter = "";
}

function has_water(e){
  return (e.style.filter == "hue-rotate(120deg)");
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
  destroy_pipes(toDestroy)
}

function push_down_board(callback){
  top_is_empty=false;
  for(var i=nb_rows-1; i>=0; --i){
    for(var j=0; j<nb_cols; ++j){
      var e1 = index_to_pipe(i, j);
      var e2 = index_to_pipe(i+1, j);

      if(e2 && get_pipe_name(e1) != "empty" 
            && get_pipe_name(e2) == "empty"){
        swap_pipes(e1, e2);
      }
    }
  }
  var top_is_empty = false;
  for(var j=0;j<nb_cols;++j){
    var e = index_to_pipe(0, j);
    if(get_pipe_name(e) == "empty"){
      top_is_empty = true;
      set_pipe(e, random_pipe_name());
    } 
  }
  if(top_is_empty){
    setTimeout(function(){push_down_board(callback);}, 250);
  }
  else if(callback) {
    callback();
  }
}
function game_over(){
  popup("Game Over :(", "Restart", function(){ new_game(levels[activeLevel]); });
}

document.addEventListener("DOMContentLoaded", function(event) { 
  new_game(levels[activeLevel]);
  document.getElementById("restart").addEventListener("click", function(){new_game(levels[activeLevel])});
  var cells = document.querySelectorAll("#game_table td");
  var mouse_down = false;
  var selected_pipes = [];
  for(var i=0; i<cells.length; ++i){
    (cells[i]).addEventListener("mousedown", function(ev){
      mouse_down = true;
      last_pipe = this_pipe;
      mark_has_water(this_pipe);
      selected_pipes.push(this_pipe);
    });
    (cells[i]).addEventListener("mouseover", function(ev){
      this_pipe = ev.currentTarget;
      if(mouse_down && selected_pipes.length > 0 
          && selected_pipes.indexOf(this_pipe) == -1
          && are_pipes_connected(this_pipe, selected_pipes[selected_pipes.length-1])){
        mark_has_water(this_pipe);
        selected_pipes.push(this_pipe);
      };
    });
    (cells[i]).addEventListener("mouseup", function(ev){
      mouse_down = false;
      for(var i=0; i<selected_pipes.length; ++i){
        mark_no_water(selected_pipes[i]);
      }
      if(selected_pipes.length >= 3)
      {
        destroy_pipes(selected_pipes, function(){
          set_moves(get_moves()-1);
          if(levels[activeLevel].completedObjective()){
            popup("Congratulations, you won the level", "Next Level", function(){
              ++activeLevel;
              new_game(levels[activeLevel]);
            });
          }
          else if(get_moves() <= 0) {
            game_over();
          }
        });
      }
      selected_pipes = [];
    });
  }
});
