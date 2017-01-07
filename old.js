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

