// Variables
var wp_waypointGui = new Gui();
var wp_bgAlpha, wp_fgAlpha, wp_guiDepth, wp_waypointGuiElements;
var wp_waypointGuiGap = 35;

// Initializing and opening
register('command', 'wp_openWaypointCreationGui').setName('createWaypoint');

function wp_openWaypointCreationGui() {
  // Default values
  wp_bgAlpha = 0, wp_fgAlpha = 0, wp_guiDepth = 0;
  wp_waypointGuiElements = [];

  // Add elements
  wp_waypointGuiElements.push(new wp_waypointTitleElement('Create Waypoint'));
  wp_waypointGuiElements.push(new wp_waypointInvisElement());
  wp_waypointGuiElements.push(new wp_waypointTextElement('Name:'));
  wp_waypointGuiElements.push(new wp_waypointColorElement('Color'));

  // Open
  wp_waypointGui.open();
}

wp_waypointGui.registerClicked(function() {
  ChatLib.chat('wee');
});

register('step', function() {
  if (wp_waypointGui.isOpen()) {
    wp_bgAlpha = easeOut(wp_bgAlpha, 150, 10);
    wp_fgAlpha = easeOut(wp_fgAlpha, 100, 13);

    // Step elements
    wp_waypointGuiElements.forEach(function(element) {
      element.step();
    });
  }
});

wp_waypointGui.registerDraw(function(mouseX, mouseY) {
  // Variables
  var x = Renderer.screen.getWidth() / 2, y = 20;

  // Background
  Renderer.drawRect(Renderer.color(0, 0, 0, wp_bgAlpha), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight());

  // Draw elements
  wp_waypointGuiElements.forEach(function(element) {
    y = element.draw(x, y, mouseX, mouseY);

    // Background behind elements
    if (element instanceof wp_waypointInvisElement) Renderer.drawRect(Renderer.color(0, 0, 0, wp_fgAlpha), 50, y - 20, Renderer.screen.getWidth() - 100, wp_guiDepth - y);
  });

  wp_guiDepth = y;
  // if (!wp_guiDepth) wp_guiDepth = y;
  // wp_guiDepth = easeOut(wp_guiDepth, y, 4);
});


// Elements

// Base element (does nothing alone, copy+paste to create new element)
function wp_waypointBaseElement() {
  this.step = function() {

  }

  this.draw = function(x, y, mouseX, mouseY) {

  }
}

// Title
function wp_waypointTitleElement(title) {
  this.title = title;
  this.y = 0;
  this.alpha = 0;

  this.step = function() {
    this.y = easeOut(this.y, 20, 6);
    this.alpha = easeOut(this.alpha, 255, 10);
  }

  this.draw = function(x, y, mouseX, mouseY) {
    /*Renderer.drawStringWithShadow(
      this.title,
      x - (Renderer.getStringWidth(title) / 2),
      this.y
    );*/

    Renderer.text(
      this.title,
      x - (Renderer.getStringWidth(this.title) / 2),
      this.y
    ).setColor(
      Renderer.color(
        255,
        255,
        255,
        this.alpha
      )
    ).setShadow(true).draw();

    return y + wp_waypointGuiGap;
  }
}

// Invisible element for spacing and animation
function wp_waypointInvisElement() {
  this.yGoal = undefined;
  this.y = undefined;


  this.step = function() {
    if (this.y) this.y = easeOut(this.y, this.yGoal, 6);
    this.alpha = easeOut(this.alpha, 255, 10);
  }

  this.draw = function(x, y, mouseX, mouseY) {
    if (!this.y) {
      this.yGoal = y;
      this.y = y + 10;
    }
    return this.y + 25;
  }
}

function wp_waypointTextElement(desc) {
  this.text = "";
  this.desc = desc;
  // this.yGoal = undefined;
  // this.y = undefined;
  this.alpha = 0;

  this.step = function() {
    // if (this.y) this.y = easeOut(this.y, this.yGoal, 6);
    this.alpha = easeOut(this.alpha, 255, 10);
  }

  this.draw = function(x, y, mouseX, mouseY) {
    /*if (!this.y) {
      this.yGoal = y;
      this.y = y + 10;
    }*/
    Renderer.text(
      this.desc,
      x - (Renderer.getStringWidth(this.desc) / 2),
      y
    ).setColor(
      Renderer.color(
        255,
        255,
        255,
        this.alpha
      )
    ).setShadow(true).draw();

    return y + wp_waypointGuiGap;
  }
}

function wp_waypointColorElement(title) {
  this.color = {
    r: 255,
    g: 255,
    b: 255
  };
  this.desc = title;
  this.alpha = 0;

  this.step = function() {
    this.alpha = easeOut(this.alpha, 255, 10);
  }

  // Text
  this.draw = function(x, y, mouseX, mouseY) {
    Renderer.text(
      this.desc,
      110,
      y
    ).setColor(
      Renderer.color(
        255,
        255,
        255,
        this.alpha
      )
    ).setShadow(true).draw();

    // Red selector
    Renderer.drawRect(
      Renderer.color(this.color.r, 0, 0, this.alpha),
      100,
      y + 20,
      (Renderer.screen.getWidth() / 2) - 170,
      3
    );

    // Green selector
    Renderer.drawRect(
      Renderer.color(0, this.color.g, 0, this.alpha),
      100,
      y + 40,
      (Renderer.screen.getWidth() / 2) - 170,
      3
    );

    // Blue selector
    Renderer.drawRect(
      Renderer.color(0, 0, this.color.b, this.alpha),
      100,
      y + 60,
      (Renderer.screen.getWidth() / 2) - 170,
      3
    );

    // Color preview
    // Black outline
    Renderer.drawRect(
      Renderer.color(0, 0, 0, this.alpha),
      (Renderer.screen.getWidth() / 2) - 60,
      y + 15,
      53,
      53
    );

    // Color fill
    Renderer.drawRect(
      Renderer.color(this.color.r, this.color.g, this.color.b, this.alpha),
      (Renderer.screen.getWidth() / 2) - 57,
      y + 18,
      47,
      47
    )

    return y + 140;
  }
}
