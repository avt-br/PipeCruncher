
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

function render_destruction(elements, callback){
  var explosion_url = "url(\"Images/explosion.gif\")";
  var empty_url = "url(\"Images/pipe_empty.png\")";
  for(var i=0; i<elements.length; ++i){
    elements[i].style.background = explosion_url;
    elements[i].style.backgroundSize = "100%";
    elements[i].style.backgroundRepeat = "no-repeat";
  }
  setTimeout(
    function(){ 
      for(var i=0; i<elements.length; ++i){
        elements[i].style.background = empty_url;
      }
      callback();
    },
    500
  );
}

function render_swap(e1, e2, callback) {
  callback();
}


function set_selected(pipePtr){
  var e = index_to_pipe(pipePtr.coords[0], pipePtr.coords[1])  
  e.style.filter = "hue-rotate(120deg)";
  e.style.WebkitFilter = "hue-rotate(120deg)";
}

function set_unselected(pipePtr){
  var e = index_to_pipe(pipePtr.coords[0], pipePtr.coords[1])  
  e.style.filter = "";
  e.style.WebkitFilter = "";
}

function is_selected(pipePtr){
  var e = index_to_pipe(pipePtr.coords[0], pipePtr.coords[1])  
  return (e.style.filter == "hue-rotate(120deg)") 
          || (e.style.WebkitFilter == "hue-rotate(120deg)");
}
