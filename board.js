class Board {

  constructor(){
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
  }

  setPipe(i,j, pipe){
    this.board[i][j] = pipe;
    this.renderPipe(i,j);
  }

  getPipe(i,j){
    var pi0 = this.board[i];
    if (pi0){
      return pi0[j];
    }
    return null;
  }

  renderPipe(i,j){
    var element = index_to_pipe(i,j);
    this.board[i][j].render(element);
  }

  renderBoard(){
    for(var i=0; i<this.nb_rows; ++i){
      for(var j=0; j<this.nb_cols; ++j){
        this.renderPipe(i,j);
      }
    }
  }
  elementToPipe(e){
    var coords = get_pipe_index(e);
    if(coords){
      return this.board[coords[0]][coords[1]];
    }
    return null;
  }
  elementToIndex(e){
    return get_pipe_index(e);
  }
  getPipePtr(e){
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
