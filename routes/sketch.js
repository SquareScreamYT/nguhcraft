let zoom = 0.05;
let offsetX = 0;
let offsetY = 0;

let routes = "";
let inputbox;
let submit;

function mouseDragged() {
  offsetX += mouseX - pmouseX;
  offsetY += mouseY - pmouseY;
}

function mouseWheel(event) {
  let zoomFactor = 1.05;
  let oldZoom = zoom;

  if (event.delta > 0) {
    zoom /= zoomFactor;
  } else {
    zoom *= zoomFactor;
  }
  zoom = constrain(zoom, 0.001, 50);

  let centerX = width / 2;
  let centerY = height / 2;
  
  offsetX = centerX - (centerX - offsetX) * (zoom / oldZoom);
  offsetY = centerY - (centerY - offsetY) * (zoom / oldZoom);

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  offsetX = width / 2;
  offsetY = height / 2;

  inputbox = createInput("");
  inputbox.attribute("placeholder", "paste nguhjourney data here");
  inputbox.position(20, 20);
  inputbox.size(140, 20);

  submit = createButton("submit");
  submit.position(170, 20);

  submit.mousePressed(() => {
    let inputdata = inputbox.value().trim();

    if (inputdata != "") {
      try {
        routes = JSON.parse(inputdata);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

function draw() {
  background(30);

  push();
  translate(offsetX, offsetY);
  scale(zoom);

  if (routes && routes.lines && routes.lines.overworld) {
    let overworldLines = routes.lines.overworld;
    
    for (let i = 0; i < overworldLines.length; i++) {
      let currentLine = overworldLines[i];
      let stopsList = currentLine.stops;
      
      if (!stopsList) continue;
      
      stroke(currentLine.color || 0, 150, 255);
      strokeWeight(4 / zoom);
      noFill();
      
      beginShape();
      for (let j = 0; j < stopsList.length; j++) {
        let stop = stopsList[j];
        if (stop && stop.coords && stop.coords.length >= 2) {
          let x = stop.coords[0];
          let z = stop.coords.length > 2 ? stop.coords[2] : stop.coords[1];
          vertex(x, z);
        }
      }
      endShape();

      for (let j = 0; j < stopsList.length; j++) {
        let stop = stopsList[j];
        if (stop && stop.coords && stop.coords.length >= 2) {
          let x = stop.coords[0];
          let z = stop.coords.length > 2 ? stop.coords[2] : stop.coords[1];
  
          fill(255, 204, 0);
          noStroke();
          circle(x, z, 12 / zoom);
  
          fill(255);
          textAlign(CENTER, BOTTOM);
          textSize(12 / zoom);
          name = routes.stations?.[stop.code] || stop.code;
          text(name || "", x, z - (10 / zoom));
        }
      }
    }
  }

  pop();
}
