var Board  = function() {

    this.nb_rows = 9;
    this.nb_cols = 11;
    this.board = [
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null,null,null,null] 
    ];

  this.setPipe = function(i,j, pipe){
    this.board[i][j] = pipe;
    this.renderPipe(i,j);
  }

  this.getPipe = function (i,j){
    var pi0 = this.board[i];
    if (pi0){
      return pi0[j];
    }
    return null;
  }

  this.renderPipe = function(i,j) {
    var element = index_to_pipe(i,j);
    this.board[i][j].render(element);
  }

  this.renderBoard = function(){
    for(var i=0; i<this.nb_rows; ++i){
      for(var j=0; j<this.nb_cols; ++j){
        this.renderPipe(i,j);
      }
    }
  }

  this.elementToPipe = function(e){
    var coords = get_pipe_index(e);
    if(coords){
      return this.board[coords[0]][coords[1]];
    }
    return null;
  }
  
  this.elementToIndex = function(e){
    return get_pipe_index(e);
  }

  this.getPipePtr = function(e){
    return new PipePtr(this.elementToPipe(e), this.elementToIndex(e));
  }

}

function get_pipe_index(element){
  var id = element.id;
  var re = /idx_(\d+)_(\d+)/;
  var match = re.exec(id);
  if(match){
    return [parseInt(match[1]), parseInt(match[2])];
  }
  return null;
}
