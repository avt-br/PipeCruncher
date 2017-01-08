var PipeConnections = function(top, bottom, left, right){
  this.top = top;
  this.bottom = bottom;
  this.left = left;
  this.right = right;
}

var PipePtr = function(pipe, coords){
  this.pipe = pipe;
  this.coords = coords;
}

var Pipe = function(sprite, connections, isStatic, isPlay, isTermination, insidePipe, pointsToDelete){
  this.sprite = sprite;
  this.connections = connections;
  this.isStatic= isStatic;
  this.isPlay = isPlay;
  this.isTermination = isTermination;
  this.insidePipe = insidePipe;
  this.pointsToDelete = pointsToDelete;
  this.isEmpty = false;

  this.render =  function(element){ 
    var pipe_url = get_pipe_url(this.sprite);
    element.style.background = pipe_url;
    element.style.backgroundSize = "100%";
    element.style.backgroundRepeat = "no-repeat";
  };

  this.getConnection = function(){
    return get_pipe_connections(e);
  };
  
  this.destroy = function(destructionPoints){
    if (!this.isPlay) return false;
    this.pointsToDelete -= destructionPoints;
    if (this.pointsToDelete > 0){
      return false;
    }
    return true;
  };
}

var PlayPipe = function(sprite){
  Pipe.call(this, sprite, get_pipe_connections(sprite), false, true, false, null, 0);
}

var StaticPipe = function(sprite){
  var connects = new PipeConnections(false, false, false, false);
  Pipe.call(this, sprite, connects, true, false, false, null, 0);
}

var SinkPipe = function (sprite, pointsToDelete){
  var connects = new PipeConnections(true, true, true, true);
  Pipe.call(this, sprite, connects, true, true, true, null, pointsToDelete);
  this.initialPoints = pointsToDelete;

  this.oldrender = this.render;
  this.render = function(element){ 
    this.oldrender(element);
    if(!this.isEmpty){
      var rotation = -90 * (this.initialPoints - this.pointsToDelete) / this.initialPoints;
      var filter = "hue-rotate("+rotation+"deg)";
      element.style.WebkitFilter = filter;
      element.style.Filter = filter;
    }
  }
}

var ObstaclePipe = function(sprite, connections, insidePipe, nbPoints){
  Pipe.call(this, sprite, connections, true, true, true, insidePipe, nbPoints);
}


function get_pipe_connections(name){

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
