
function random_pipe_name(){
  var random_idx = Math.floor(Math.random()*play_pipe_names.length);
  return play_pipe_names[random_idx];
}

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

function createSimpleBoard(board) {
  for(var i=0; i<board.nb_rows; ++i){
    for(var j=0; j<board.nb_cols; ++j){
      board.setPipe(i,j, new PlayPipe(random_pipe_name()));
    }
  }
}

function createSimpleBoardWithBoulders(nbBoulders) {
  return function(board) {
    createSimpleBoard(board);
    for(var i=0; i<nbBoulders; ++i){
      var x = Math.floor(Math.random()*board.nb_rows);
      var y = Math.floor(Math.random()*board.nb_cols);
      board.setPipe(x,y, new StaticPipe("boulder"));
    }
  }
}

function createSimpleBoardWithSinks(nbSinks) {
  return function(board) {
    createSimpleBoard(board);
    for(var i=0; i<nbSinks; ++i){
      var x = Math.floor(Math.random()*board.nb_rows);
      var y = Math.floor(Math.random()*board.nb_cols);
      board.setPipe(x,y, new SinkPipe("sink_cross", 100));
    }
  }
}

//objectives
function noSinksLeft(board){
  for(var i=0; i<board.nb_rows; ++i){
    for(var j=0; j<board.nb_cols; ++j){
      if (board.getPipe(i,j) instanceof SinkPipe){
        return false
      }
    }
  }
  return true;
}

function pointsObjective(nbPoints) {
  return function(board){
   return get_score() >= nbPoints;
  };
}


class Level{
  constructor(nbMoves, objective, generator, description){
    this.nbMoves = nbMoves;
    this.objective = objective;
    this.generator = generator;
    this.description = description;
  }
}

var levels = [
  new Level(30, pointsObjective(1000), 
    createSimpleBoard, "Reach 1000 Points!"),
  new Level(30, pointsObjective(2000), 
    createSimpleBoardWithBoulders(3), "Reach 2000 Points!"),
  new Level(40, pointsObjective(3000), 
    createSimpleBoardWithBoulders(5), "Reach 3000 Points!"),
  new Level(30, noSinksLeft, 
    createSimpleBoardWithSinks(5), "Destroy the Sinks!"),
  new Level(60, noSinksLeft, 
    createSimpleBoardWithSinks(5), "Destroy the Sinks!"),
  new Level(10000000000, function(){return false;}, 
    createSimpleBoard, "No more Levels! Have fun!")
];
