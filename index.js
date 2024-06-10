//static stars
var staticStarsX = [];
var staticStarsY = [];
let numStars = 1000;

// the sun
var sx;
var sy;
var svx;
var svy;
var sax;
var say;
let sclr = "FFFF00";
var sr = 100;
var sm = 5000;

// the planet
var px;
var py;
var pvx;
var pvy;
var pax;
var pay;
let pclr = "0000FF";
var pr = 30;
var pm = 100;
var planetTrailX = [];
var planetTrailY = [];
var planetTrailC = [];
var trailLength = 5000;
var resistance = 1; // Use the to add resistance to the orbit
var day = 0;

// other variables
var grav = 1;
var forceMag;
var forceAnlge;
var forceX;
var forceY;
var simMode; // 0: setting up, 1: simulating, 2: burning death
var deathTextSize = 0;

function setup() {
  createCanvas(1024, 768);
  textSize(20);
  textAlign(CENTER);

  background(0);
  // static stars
  staticStars = new Array(numStars)[2];
  stroke(255);
  for (var i = 0; i < numStars; i++) {
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

  for (var i = 0; i < trailLength; i++) {
    planetTrailX[i] = px;
    planetTrailY[i] = py;
    planetTrailC[i] = 0;
  }

  // initialize other variables
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
  for (var i = 0; i < numStars; i++) {
    point(staticStarsX[i], staticStarsY[i]);
  }

  if (simMode == 1) {
    // force Calculations
    forceMag =
      (grav * sm * pm) / (dist(sx, sy, px, py) * dist(sx, sy, px, py) * 0.3);
    forceAngle = atan((sy - py) / (sx - px));
    forceX = forceMag * cos(forceAngle);
    forceY = forceMag * sin(forceAngle);

    // setting object variables
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

    for (
      var i = 1;
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
    day -= 0.1; // used for rotating the earth
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
    fill(0, 255, 0);
    quad(
      px + (pr / 3) * cos(day),
      py + (pr / 3) * sin(day),
      px - (pr / 3) * sin(day),
      py + (pr / 3) * cos(day),
      px - (pr / 2) * cos(day),
      py - (pr / 2) * sin(day),
      px + (pr / 2) * sin(day),
      py - (pr / 2) * cos(day)
    );
    for (
      var i = 1;
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
  }
}

function mousePressed() {
  px = mouseX;
  py = mouseY;
  simMode = 0;
}

function mouseReleased() {
  pvx = (mouseX - px) / 30;
  pvy = (mouseY - py) / 30;
  svx = -pvx * (pm / sm); // conservation of momentum
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
  for (var i = 0; i < trailLength; i++) {
    planetTrailX[i] = px;
    planetTrailY[i] = py;
  }
}
