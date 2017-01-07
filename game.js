var activeLevel = 0; 

var board = new Board();

function get_pipe_url(pipe_name, ext){
  if(!ext){
    ext = "png";
  }
  return "url(\"Images/pipe_" + pipe_name + "." + ext + "\")"
}


function index_to_pipe(idx1, idx2){
  return document.getElementById("idx_"+idx1+"_"+idx2);
}

function new_game(level){
  set_score(0);
  set_moves(level.nbMoves);
  level.generator(board);
  popup(level.description, "Go");
}

function are_pipes_adjacent(ptr1, ptr2){
  var idx1 = ptr1.coords;
  var idx2 = ptr2.coords;
  return ((idx1[1] == idx2[1]) && (Math.abs(idx1[0] - idx2[0])==1))
       ||((idx1[0] == idx2[0]) && (Math.abs(idx1[1] - idx2[1])==1))
}

function swap_pipes(e1, e2){
    render_swap(e1, e2, function(){
      var coord1 = board.elementToIndex(e1);
      var coord2 = board.elementToIndex(e2);
      var temp1 = board.getPipe(coord1[0],coord1[1]);
      var temp2 = board.getPipe(coord2[0],coord2[1]);
      board.setPipe(coord1[0], coord1[1], temp2);
      board.setPipe(coord2[0], coord2[1], temp1);
    });
}

function destroy_pipes(ptrs, callback){
  var partial_score = ptrs.length*10;

  var elements = [];
  for(var i=0; i<ptrs.length; ++i){
    var coords = ptrs[i].coords;
    var element = index_to_pipe(coords[0], coords[1]);
    if(ptrs[i].pipe.destroy(partial_score)){
      elements.push(element);
    }else{
      board.renderPipe(coords[0], coords[1]);
    }
  }

  set_score(get_score()+partial_score);

  render_destruction(elements, function(){
    for(var i=0; i<elements.length; ++i){
      var pipe = board.elementToPipe(elements[i]);
      pipe.isEmpty = true;
    }
    push_down_board(callback);
  });
}

function are_pipes_connected(ptr1, ptr2){

  if (!ptr1.pipe || !ptr2.pipe || !are_pipes_adjacent(ptr1,ptr2)) return false;

  var idx1 = ptr1.coords;
  var idx2 = ptr2.coords;
  var p1 = ptr1.pipe
  var p2 = ptr2.pipe

  if (idx1[0] == idx2[0]){ // horizontal
    var rightmost = (idx1[1]>idx2[1]) ? p1 : p2;
    var leftmost = (idx1[1]>idx2[1]) ? p2 : p1;
    return (leftmost.connections.right && rightmost.connections.left); 
  }

  if (idx1[1] == idx2[1]){ //vertical
    var topmost = (idx1[0]>idx2[0]) ? p2 : p1;
    var lowermost = (idx1[0]>idx2[0]) ? p1 : p2;
    return (topmost.connections.bottom && lowermost.connections.top); 
  }
  return false;
}

function empty_above(el){
  var coords = get_pipe_index(el);
  for(var i=0; i<coords[0]; ++i){
    var pipe = board.getPipe(i,coords[1]);
    if(!pipe.isEmpty || !pipe.isStatic) return false
  }
  return true;
}

var previousDirection = [
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
function push_down_board(callback){
  pushed_down=false;
  for(var i=board.nb_rows-1; i>=0; --i){
    for(var j=0; j<board.nb_cols; ++j){
      var e1 = index_to_pipe(i, j);
      var e2 = index_to_pipe(i+1, j);
      var e1l = index_to_pipe(i, j-1);
      var e1r = index_to_pipe(i, j+1);
      
      var p1 = board.getPipe(i,j);
      var p2 = board.getPipe(i+1,j);
      var p1l = board.getPipe(i,j-1);
      var p1r = board.getPipe(i,j+1);

      //Case 0: Nowhere to push
      if(!p2 || !p1.isEmpty && !p2.isEmpty) continue;

      //Case 1: Pushing down a pipe under an empty square
      if(!p1.isEmpty && p2.isEmpty){
        if (!p1.isStatic){
          swap_pipes(e1, e2);
          pushed_down=true;
        } 
        //Case 2: Interleaving under a static pipe
        else if((previousDirection[i][j] == 0 || p1r && p1r.isStatic)
            && p1l && !p1l.isStatic){
          swap_pipes(e1l, e2);
          previousDirection[i][j] = 1;
          pushed_down=true;
        } 
        else if((previousDirection[i][j] == 1 || e1l && p1l.isStatic) 
            && p1r && !p1r.isStatic) {
          swap_pipes(e1r, e2);
          previousDirection[i][j] = 0;
          pushed_down=true;
        }
      }
      //Case 3: Falling under a ledge
      else if(p1l && empty_above(e1l) && p2.isEmpty){
          swap_pipes(e1l, e2);
          pushed_down=true;
      }
      else if(p1r && empty_above(e1r) && p2.isEmpty){
          swap_pipes(e1r, e2);
          pushed_down=true;
      }
    }
  }
  var top_is_empty = false;
  for(var j=0;j<board.nb_cols;++j){
    var pipe = board.getPipe(0,j);
    if(pipe.isEmpty){
      board.setPipe(0, j, new PlayPipe(random_pipe_name()));
      pushed_down=true;
    } 
  }
  if(pushed_down){
    setTimeout(function(){push_down_board(callback);}, 250);
  }
  else if(callback) {
    callback();
  }
}

function game_over(){
  popup("Game Over :(", "Restart", function(){ new_game(levels[activeLevel]); });
}

class PipeSelector{
  constructor(){
    this.mouse_down = false;
    this.selected_pipes = [];
  }
  onStartSelection(ev){
    var thisPipePtr = board.getPipePtr(ev.currentTarget);
    this.mouse_down = true;
    set_selected(thisPipePtr);
    this.selected_pipes.push(thisPipePtr);
  }
  onPipeSelection(ev){

    function containsPtr(vector, ptr)
    {
      for(var i=0; i<vector.length; ++i) {
        if (vector[i].coords[0] == ptr.coords[0] 
         && vector[i].coords[1] == ptr.coords[1]) return true;
      }
      return false;
    }
    var thisPipePtr = board.getPipePtr(ev.currentTarget);
    var lastPipePtr = this.selected_pipes[this.selected_pipes.length-1];
    if(this.mouse_down && this.selected_pipes.length > 0 
      && thisPipePtr.pipe.isPlay
      && !lastPipePtr.pipe.isTermination
      && !containsPtr(this.selected_pipes, thisPipePtr)
      && are_pipes_connected(thisPipePtr, lastPipePtr)){
        set_selected(thisPipePtr);
        this.selected_pipes.push(thisPipePtr);
    }
  }
  onEndSelection(ev){
    for(var i=0; i<this.selected_pipes.length; ++i){
      set_unselected(this.selected_pipes[i]);
    }
    if(this.selected_pipes.length >= 3)
    {
      destroy_pipes(this.selected_pipes, new_move);
    }
    this.mouse_down = false;
    this.selected_pipes = [];
  }
}

function new_move(){
  set_moves(get_moves()-1);
  if(levels[activeLevel].objective(board)){
    popup("Congratulations, you won the level", "Next Level", function(){
      ++activeLevel;
      new_game(levels[activeLevel]);
    });
  } 
  else if(get_moves() <= 0) {
    game_over();
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
  new_game(levels[activeLevel]);
  document.getElementById("restart").addEventListener("click", function(){new_game(levels[activeLevel])});
  var cells = document.querySelectorAll("#game_table td");
  var selector = new PipeSelector();
  for(var i=0; i<cells.length; ++i){
    (cells[i]).addEventListener("mousedown", function(ev){selector.onStartSelection(ev)});
    (cells[i]).addEventListener("mouseover", function(ev){selector.onPipeSelection(ev)});
    (cells[i]).addEventListener("mouseup", function(ev){selector.onEndSelection(ev)});
  }
});
