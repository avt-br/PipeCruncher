class PipeConnections{
  constructor(top, bottom, left, right){
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }
}
class PipePtr {
  constructor(pipe, coords){
    this.pipe = pipe;
    this.coords = coords;
  }
}

class Pipe {
  constructor(sprite, connections, isStatic, isPlay, isTermination, insidePipe, pointsToDelete){
    this.sprite = sprite;
    this.connections = connections;
    this.isStatic= isStatic;
    this.isPlay = isPlay;
    this.isTermination = isTermination;
    this.insidePipe = insidePipe;
    this.pointsToDelete = pointsToDelete;
    this.isEmpty = false;
  }
  render(element){ 
    var pipe_url = get_pipe_url(this.sprite);
    element.style.background = pipe_url;
    element.style.backgroundSize = "100%";
    element.style.backgroundRepeat = "no-repeat";
  }
  getConnection(){
    return get_pipe_connections(e);
  }
  destroy(destructionPoints){
    if (!this.isPlay) return false;

    this.pointsToDelete -= destructionPoints;
    if (this.pointsToDelete > 0){
      return false;
    }
    return true;
  }
}

class PlayPipe extends Pipe{
  constructor(sprite){
    super(sprite, get_pipe_connections(sprite), false, true, false, null, 0);
  }
}

class StaticPipe extends Pipe{
  constructor(sprite){
    var connects = new PipeConnections(false, false, false, false);
    super(sprite, connects, true, false, false, null, 0);
  }
}

class SinkPipe extends Pipe{
  constructor(sprite, pointsToDelete){
    var connects = new PipeConnections(true, true, true, true);
    super(sprite, connects, true, true, true, null, pointsToDelete);
    this.initialPoints = pointsToDelete;
  }
  render(element){ 
    super.render(element);
    if(!this.isEmpty){
      var rotation = -90 * (this.initialPoints - this.pointsToDelete) / this.initialPoints;
      var filter = "hue-rotate("+rotation+"deg)";
      element.style.WebkitFilter = filter;
      element.style.Filter = filter;
    }
  }
}

class ObstaclePipe extends Pipe{
  constructor(sprite, connections, insidePipe, nbPoints){
    super(sprite, connections, true, true, true, insidePipe, nbPoints);
  }
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
