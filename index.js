//static stars
let staticStarsX = [];
let staticStarsY = [];
let numStars = 1000;

let law = 1;

// the sun
let sx;
let sy;
let svx;
let svy;
let sax;
let say;
let sclr = "FFFF00";
let sr = 100;
let sm = 5000;

// the planet
let px;
let py;
let pvx;
let pvy;
let pax;
let pay;
let pclr = "0000FF";
let pr = 30;
let pm = 100;
let planetTrailX = [];
let planetTrailY = [];
let planetTrailC = [];
let trailLength = 5000;
let resistance = 1;

// other letiables
let grav = 1;
let forceMag;
let forceAnlge;
let forceX;
let forceY;
let simMode; // 0: setting up, 1: simulating
let deathTextSize = 0;

// law 2
let areaAccum = false;
let areaFrame = 0;
let areaTotal = 0;

// [[[prevX, prevY], [px, py], [sx, sy]], [prevX, prevY], [px, py], [sx, sy]], ...]
let areaHistory = [];

function setup() {
  createCanvas(1024, 768);
  textSize(20);
  textAlign(CENTER);

  background(0);
  // static stars
  staticStars = new Array(numStars)[2];
  stroke(255);
  for (let i = 0; i < numStars; i++) {
    staticStarsX[i] = int(random(0, width));
    staticStarsY[i] = int(random(0, height));
    point(staticStarsX[i], staticStarsY[i]);
  }

  // the star
  sx = width / 2;
  sy = height / 2;
  svx = 0;
  svy = 0;
  sax = 0;
  say = 0;

  // the planet
  px = width / 2;
  py = height / 8;
  pvx = 0;
  pvy = 0;
  pax = 0;
  pay = 0;

  // for circular orbit
  px = width / 2;
  py = height / 8;
  sx = width / 2;
  sy = height / 2;
  pvx = 8;
  pvy = 0;
  svx = -pvx * (pm / sm);
  svy = -pvy * (pm / sm);

  for (let i = 0; i < trailLength; i++) {
    planetTrailX[i] = px;
    planetTrailY[i] = py;
    planetTrailC[i] = 0;
  }

  // initialize other letiables
  forceMag = 0;
  forceAngle = 0;
  forceX = 0;
  forceY = 0;
  simMode = 1;
  mouseX = width / 2;
  mouseY = height / 8;
}

function draw() {
  // static stars
  background(0);
  stroke(255);
  for (let i = 0; i < numStars; i++) {
    point(staticStarsX[i], staticStarsY[i]);
  }

  if (simMode == 1) {
    // force Calculations
    forceMag =
      (grav * sm * pm) / (dist(sx, sy, px, py) * dist(sx, sy, px, py) * 0.3);
    forceAngle = atan((sy - py) / (sx - px));
    forceX = forceMag * cos(forceAngle);
    forceY = forceMag * sin(forceAngle);

    // setting object letiables
    // accelerations
    if (px > sx) {
      if (py < sy) {
        sax = abs(forceX) / sm;
        pax = (-1 * abs(forceX)) / pm;
        say = (-1 * abs(forceY)) / sm;
        pay = abs(forceY) / pm;
      } else {
        sax = abs(forceX) / sm;
        pax = (-1 * abs(forceX)) / pm;
        say = abs(forceY) / sm;
        pay = (-1 * abs(forceY)) / pm;
      }
    } else {
      if (py < sy) {
        sax = (-1 * abs(forceX)) / sm;
        pax = abs(forceX) / pm;
        say = (-1 * abs(forceY)) / sm;
        pay = abs(forceY) / pm;
      } else {
        sax = (-1 * abs(forceX)) / sm;
        pax = abs(forceX) / pm;
        say = abs(forceY) / sm;
        pay = (-1 * abs(forceY)) / pm;
      }
    }

    // star
    svx += sax;
    svy += say;
    svx *= resistance;
    svy *= resistance;
    sx += svx;
    sy += svy;

    // planet
    pvx += pax;
    pvy += pay;
    pvx *= resistance;
    pvy *= resistance;
    px += pvx;
    py += pvy;

    if (areaAccum) {
      // Calculate the area swept in this frame
      let prevX = planetTrailX[0];
      let prevY = planetTrailY[0];
      let area = abs(
        (sx * (prevY - py) + prevX * (py - sy) + px * (sy - prevY)) / 2
      );
      areaTotal += area;

      // Store history
      areaHistory.push([
        [prevX, prevY],
        [px, py],
        [sx, sy],
      ]);
      areaFrame++;

      if (areaFrame > 30) {
        areaAccum = false;
      }
    }

    for (
      let i = 1;
      i < trailLength;
      i++ // recalculating the trail
    ) {
      planetTrailX[trailLength - i] = planetTrailX[trailLength - 1 - i];
      planetTrailY[trailLength - i] = planetTrailY[trailLength - 1 - i];
      planetTrailC[trailLength - i] = planetTrailC[trailLength - 1 - i];
    }
    planetTrailX[0] = px;
    planetTrailY[0] = py;
    planetTrailC[0] = sqrt(pvx * pvx + pvy * pvy);
  } else if (simMode == 0) {
    stroke(255);
    line(px, py, mouseX, mouseY);
  }
  // Drawing objects
  if (simMode != 2) {
    noStroke();

    // star
    fill(255, 255, 0);
    ellipse(sx, sy, sr, sr);

    // planet
    fill(0, 0, 255);
    ellipse(px, py, pr, pr);
    for (
      let i = 1;
      i < trailLength;
      i++ // drawing the trail
    ) {
      stroke(planetTrailC[i] * 20 - 20, 255 - 20 * planetTrailC[i] + 20, 0);
      line(
        planetTrailX[i - 1],
        planetTrailY[i - 1],
        planetTrailX[i],
        planetTrailY[i]
      );
    }

    // labels
    textSize(20);

    fill(255);
    text("Earth", px, py + 27);
    fill(0);
    text("Sun", sx, sy + 7);

    // circle
    fill(0);
    stroke(255);

    rect(width - 101, 100, 100, 100);
    fill(255);
    text("Demo\nCircle", width - 50, 150 - 6);

    text("Orbit Presets", width - 65, 150 - 75);

    // ellipse
    fill(0);
    stroke(255);
    rect(width - 101, 225, 100, 100);
    fill(255);
    text("Demo\nEllipse", width - 50, 275 - 6);

    // close
    fill(0);
    stroke(255);
    rect(width - 101, 350, 100, 100);
    fill(255);
    text("Demo\nClose", width - 50, 400 - 6);

    fill(0);
    stroke(255);
    rect(width - 101, 350, 100, 100);
    fill(255);
    text("Demo\nClose", width - 50, 400 - 6);

    fill(0);
    stroke(255);
    rect(5, 5, 100, 40);
    fill(255);
    text("1st law", 40, 30);

    let offset = 120;
    fill(0);
    stroke(255);
    rect(5 + offset, 5, 100, 40);
    fill(255);
    text("2nd law", 45 + offset, 30);

    if (law == 2) {
      fill(0);
      stroke(255);
      rect(5, 50, 225, 40);
      fill(255);
      text("Start area acculumation", 120, 80);
    }

    if (areaTotal > 0) {
      stroke(0, 255, 0);
      for (let i = 0; i < areaHistory.length; i++) {
        let h = areaHistory[i];
        line(h[0][0], h[0][1], h[1][0], h[1][1]);
        line(h[1][0], h[1][1], h[2][0], h[2][1]);
      }

      fill(255);
      textSize(16);
      text(`Accumulated Area: ${areaTotal.toFixed(2)}`, 150, height - 30);
      text(`Current Frame: ${areaFrame}`, 150, height - 70);
    }
  }
}

function mousePressed() {
  if (mouseX > 5 && mouseX < 105 && mouseY > 5 && mouseY < 45) {
    return;
  } else if (mouseX > 125 && mouseX < 225 && mouseY > 5 && mouseY < 45) {
    return;
  } else if (mouseX > 5 && mouseX < 230 && mouseY > 50 && mouseY < 90) {
    return;
  }

  px = mouseX;
  py = mouseY;
  simMode = 0;
}

function mouseReleased() {
  if (mouseX > 5 && mouseX < 105 && mouseY > 5 && mouseY < 45) {
    law = 1;
    return;
  } else if (mouseX > 125 && mouseX < 225 && mouseY > 5 && mouseY < 45) {
    law = 2;
    return;
  }
  if (mouseX > 5 && mouseX < 230 && mouseY > 50 && mouseY < 90) {
    areaAccum = true;
    areaFrame = 0;
    areaTotal = 0;
    areaHistory = [];
    return;
  }

  pvx = (mouseX - px) / 30;
  pvy = (mouseY - py) / 30;
  svx = -pvx * (pm / sm);
  svy = -pvy * (pm / sm);
  simMode = 1;

  if (mouseX > width - 100 && mouseY < 200) {
    // circle
    px = width / 2;
    py = height / 8;
    sx = width / 2;
    sy = height / 2;
    pvx = 8;
    pvy = 0;
    svx = -pvx * (pm / sm);
    svy = -pvy * (pm / sm);
  } else if (mouseX > width - 100 && mouseY > 220 && mouseY < 325) {
    // close circle
    px = width / 2;
    py = height / 3;
    sx = width / 2;
    sy = height / 2;
    pvx = 12;
    pvy = 0;
    svx = -pvx * (pm / sm);
    svy = -pvy * (pm / sm);
  } else if (mouseX > width - 100 && mouseY > 350 && mouseY < 450) {
    // ellipse
    px = width / 8;
    py = height / 2;
    sx = width / 4;
    sy = height / 2;
    pvx = 0;
    pvy = 13.5;
    svx = -pvx * (pm / sm);
    svy = -pvy * (pm / sm);
  }

  for (let i = 0; i < trailLength; i++) {
    planetTrailX[i] = px;
    planetTrailY[i] = py;
  }
}
