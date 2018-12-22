// Variables
var wp_waypointGui = new Gui();
var wp_bgAlpha, wp_fgAlpha, wp_guiDepth, wp_waypointGuiElements;
var wp_waypointGuiGap = 35;

var WaypointGui = new wp_gui();

function wp_gui() {
  // Base variables
  this.editingId = undefined;
  this.editing = false;
  this.states = {
    list: {
      render: false,
      state: 'closing',
      elementAlpha: 0,
      guiDepth: 0,
      xOffset: 0,
      direction: 'left',
      bgAlpha: 0,
    },
    creation: {
      render: false,
      state: 'closing',
      elementAlpha: 0,
      guiDepth: 0,
      xOffset: 0,
      direction: 'left',
      bgAlpha: 0,
    },
    global: {
      bgAlpha: 0,
    },
  };

  // Utility render variables
  // TODO: merge into states as well
  this.bgAlpha = 0;
  this.fgAlpha = 0;

  // TODO: merge elements with states
  this.elements = {
    list: {
      type: 'list',
      elements: []
    },
    creation: {
      type: 'column',
      elements: [
        // Left-hand column
        [],
        // Right-hand column
        []
      ]
    }
  };

  this.edit = function(id) {
    this.editingId = id != undefined ? id : java.util.UUID.randomUUID();
    this.editing = (id != undefined);

    // Reset default values
    this.bgAlpha = 0, this.fgAlpha = 0, this.states.creation.guiDepth = 0, this.states.creation.elementAlpha = 0;
    this.states.creation.render = true;
    this.states.creation.state = 'opening';
    this.elements.creation.elements = [
      [],
      []
    ];

    // Add elements
    this.elements.creation.elements[0].push(new wp_waypointBackButtonElement());
    this.elements.creation.elements[0].push(new wp_waypointTitleElement(this.editing ? 'Edit Waypoint' : 'Create Waypoint'));
    this.elements.creation.elements[0].push(new wp_waypointInvisElement());
    this.elements.creation.elements[0].push(new wp_waypointTextElement('Name:'));
    this.elements.creation.elements[0].push(new wp_waypointColorElement('Color'));

    this.elements.creation.elements[1].push(new wp_waypointInvisElement());
    this.elements.creation.elements[1].push(new wp_waypointTextElement('Test!'));
    // this.elements.creation.elements[1].push(new wp_waypointSaveButtonElement());

    // Open
    wp_waypointGui.open();
  }

  this.forEachElement = function(func) {
    Object.keys(this.states).forEach(function(state) {
      if (!WaypointGui.states[state].render) return;
      if (WaypointGui.elements[state].type === 'list') WaypointGui.elements[state].elements.forEach(function(element) {
        func(element);
      });
      else if (WaypointGui.elements[state].type === 'column') WaypointGui.elements[state].elements.forEach(function(column) {
        column.forEach(function(element) {
          func(element);
        });
      });
    });
  }

  this.click = function(mouseX, mouseY, button) {
    if (button == 0) {
      this.forEachElement(function(element) {
        element.click();
      });
    }
  }

  this.release = function(mouseX, mouseY, button) {
    if (button == 0) {
      this.forEachElement(function(element) {
        if (element.release) element.release();
      });
    }
  }

  this.step = function() {
    // Global values
    this.bgAlpha = easeOut(this.bgAlpha, 150, 10);
    this.fgAlpha = easeOut(this.fgAlpha, 100, 13);
    this.states.creation.elementAlpha = easeOut(this.states.creation.elementAlpha, 255, 10);

    // Step elements
    this.forEachElement(function(element) {
      element.step();
    });
  }

  this.draw = function(mouseX, mouseY) {
    // Variables
    var x = 100, y = 20;
    var state = this.states.creation;

    // Background
    Renderer.drawRect(Renderer.color(0, 0, 0, this.bgAlpha), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight());

    // Draw elements
    this.elements.creation.elements[0].forEach(function(element) {
      y = element.draw(x, y, mouseX, mouseY, state);

      // Background behind elements
      if (element instanceof wp_waypointInvisElement) Renderer.drawRect(Renderer.color(0, 0, 0, WaypointGui.fgAlpha), 50, y - 20, Renderer.screen.getWidth() - 100, WaypointGui.states.creation.guiDepth - y);
    });

    this.states.creation.guiDepth = y;
    x = (Renderer.screen.getWidth() / 2) + 10, y = 20 + wp_waypointGuiGap;

    this.elements.creation.elements[1].forEach(function(element) {
      y = element.draw(x, y, mouseX, mouseY, state);
    });

    if (y > this.states.creation.guiDepth) this.states.creation.guiDepth = y;
  }
}

// Initializing and opening
/*register('command', 'wp_openWaypointCreationGui').setName('createWaypoint');

function wp_openWaypointCreationGui() {

}*/

register('command', function() {
  WaypointGui.edit();
}).setName('createWaypoint');

wp_waypointGui.registerClicked(function(mouseX, mouseY, button) {
  WaypointGui.click(mouseX, mouseY, button);
});

wp_waypointGui.registerMouseReleased(function(mouseX, mouseY, button) {
  WaypointGui.release(mouseX, mouseY, button);
});

// TODO: implement this into WaypointGui object
wp_waypointGui.registerKeyTyped(function(char, keyCode) {
  WaypointGui.forEachElement(function(element) {
    if (element.onKeyTyped) element.onKeyTyped(char, keyCode);
  });
});

register('step', function() {
  if (wp_waypointGui.isOpen()) {
    WaypointGui.step();
  }
});

wp_waypointGui.registerDraw(function(mouseX, mouseY) {
  WaypointGui.draw(mouseX, mouseY);
});


// Elements

// Base element (does nothing alone, copy+paste to create new element)
function wp_waypointBaseElement() {
  this.step = function() {

  }

  this.click = function() {

  }

  this.draw = function(x, y, mouseX, mouseY) {

  }
}

// Back button
function wp_waypointBackButtonElement() {
  // this.text = "« Back";

  this.mouseX = 0, this.mouseY = 0;

  this.alpha = 0;
  this.textColor = {
    r: 170,
    g: 0,
    b: 0
  };
  this.backX = 25;
  this.arrowX = 25;
  this.arrowAlpha = 0;
  this.rectAlpha = 0;

  this.hovered = false;

  this.step = function() {
      this.alpha = easeOut(this.alpha, 255, 10);

      if (this.mouseX >= 15 && this.mouseX < Renderer.getStringWidth("« Back") + 30 && this.mouseY >= 5 && this.mouseY < 24) this.hovered = true;
      else this.hovered = false;

      if (this.hovered) {
        this.textColor.r = easeOut(this.textColor.r, 170, 10);
        this.textColor.g = easeOut(this.textColor.g, 0, 10);
        this.textColor.b = easeOut(this.textColor.b, 0, 10);

        this.backX = easeOut(this.backX, 30, 5, 0.1);
        this.arrowX = easeOut(this.arrowX, 20, 5, 0.1);

        this.arrowAlpha = easeOut(this.arrowAlpha, 255, 10);
        this.rectAlpha = easeOut(this.rectAlpha, 150, 10);
      } else {
        this.textColor.r = easeOut(this.textColor.r, 255, 10);
        this.textColor.g = easeOut(this.textColor.g, 85, 10);
        this.textColor.b = easeOut(this.textColor.b, 85, 10);

        this.backX = easeOut(this.backX, 25, 12, 0.1);
        this.arrowX = easeOut(this.arrowX, 25, 12, 0.1);

        this.arrowAlpha = easeOut(this.arrowAlpha, 0, 10);
        this.rectAlpha = easeOut(this.rectAlpha, 0, 10);
      }
  }

  this.click = function() {

  }

  this.draw = function(x, y, mouseX, mouseY) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;

    // Background hover box
    Renderer.drawRect(
      Renderer.color(170, 170, 170, this.rectAlpha),
      15,
      5,
      Renderer.getStringWidth("« Back") + 15,
      19
    );

    // Back
    Renderer.text(
      "Back",
      this.backX,
      10
    ).setColor(
      Renderer.color(
        this.textColor.r,
        this.textColor.g,
        this.textColor.b,
        this.alpha
      )
    ).setShadow(true).draw();

    // Arrow
    Renderer.text(
      "«",
      this.arrowX,
      10
    ).setColor(
      Renderer.color(
        this.textColor.r,
        this.textColor.g,
        this.textColor.b,
        this.arrowAlpha
      )
    ).setShadow(true).draw();

    return y;
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

  this.click = function() {

  }

  this.draw = function(x, y, mouseX, mouseY) {
    /*Renderer.drawStringWithShadow(
      this.title,
      x - (Renderer.getStringWidth(title) / 2),
      this.y
    );*/

    Renderer.text(
      this.title,
      (Renderer.screen.getWidth() / 2) - (Renderer.getStringWidth(this.title) / 2),
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

  this.click = function() {

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
  this.text = '';
  this.desc = desc;
  this.alpha = 0;

  this.selected = false;
  this.hovered = false;

  this.bgColor = 0;

  this.cursor = {
    alpha: 255,
    going: 'down',
    timer: 10
  };

  this.x = 0, this.y = 0;
  this.mouseX = 0, this.mouseY = 0;

  this.step = function() {
    this.alpha = easeOut(this.alpha, 255, 10);

    // Hover calculation
    if (
      this.mouseX >= this.x + Renderer.getStringWidth(this.desc) + 6
      && this.mouseX < (this.x + Renderer.getStringWidth(this.desc) + 6) + ((Renderer.screen.getWidth() / 2) - Renderer.getStringWidth(this.desc) - 116)
      && this.mouseY >= this.y - 5
      && this.mouseY < this.y + 14
    ) this.hovered = true;
    else this.hovered = false;

    if (this.hovered && (!this.selected)) this.bgColor = easeOut(this.bgColor, 30, 5);
    else this.bgColor = easeOut(this.bgColor, 0, 15);

    if (this.selected) {
      if (this.cursor.going === 'down') {
        if (this.cursor.alpha === 0) {
          if (this.cursor.timer > 0) this.cursor.timer--;
          else {
            this.cursor.timer = 10;
            this.cursor.going = 'up';
          }
        }
        else this.cursor.alpha = easeOut(this.cursor.alpha, 0, 5);
      } else {
        if (this.cursor.alpha === 255) {
          if (this.cursor.timer > 0) this.cursor.timer--;
          else {
            this.cursor.timer = 10;
            this.cursor.going = 'down';
          }
        }
        else this.cursor.alpha = easeOut(this.cursor.alpha, 255, 5);
      }
    }
    else this.cursor.alpha = 0;
  }

  this.click = function() {
    if (this.hovered) this.selected = true;
    else this.selected = false;
  }

  this.onKeyTyped = function(char, keyCode) {
    if ((!this.selected) || (Renderer.getStringWidth(this.text + char) >= (Renderer.screen.getWidth() / 2) - Renderer.getStringWidth(this.desc) - 124)) return;
    if (char) this.text += char;
  }

  this.draw = function(x, y, mouseX, mouseY) {
    this.x = x, this.y = y;
    this.mouseX = mouseX, this.mouseY = mouseY;

    Renderer.text(
      this.desc,
      x,
      y
    ).setColor(
      Renderer.color(
        255,
        255,
        255,
        this.alpha
      )
    ).setShadow(true).draw();

    // Box outline
    Renderer.drawRect(
      Renderer.color(255, 255, 255, this.alpha),
      x + Renderer.getStringWidth(this.desc) + 6,
      y - 5,
      (Renderer.screen.getWidth() / 2) - Renderer.getStringWidth(this.desc) - 116,
      19
    );

    // Text input box
    Renderer.drawRect(
      Renderer.color(this.bgColor, this.bgColor, this.bgColor, this.alpha),
      x + Renderer.getStringWidth(this.desc) + 7,
      y - 4,
      (Renderer.screen.getWidth() / 2) - Renderer.getStringWidth(this.desc) - 118,
      17
    );

    // Text input
    Renderer.text(
      this.text,
      x + Renderer.getStringWidth(this.desc) + 10,
      y
    ).setColor(
      Renderer.color(
        255,
        255,
        255,
        this.alpha
      )
    ).setShadow(true).draw();

    // Cursor
    if (this.selected) Renderer.drawRect(
      Renderer.color(255, 255, 255, this.cursor.alpha),
      x + Renderer.getStringWidth(this.desc) + 10 + Renderer.getStringWidth(this.text) + 1,
      y,
      2,
      9
    );

    return y + wp_waypointGuiGap;
  }
}

function wp_waypointColorElement(title) {
  this.color = {
    r: 255,
    g: 55,
    b: 255
  };
  this.sliders = {
    r: {
      width: 3,
      color: 170
    },
    g: {
      width: 3,
      color: 170
    },
    b: {
      width: 3,
      color: 170
    }
  };
  this.hover = 0;
  this.selected = 0;
  this.x = 0, this.y = 0;
  this.mouseX = 0, this.mouseY = 0;
  this.desc = title;
  this.alpha = 0;

  this.step = function() {
    this.alpha = easeOut(this.alpha, 255, 10);

    if (this.mouseX > 100 && this.mouseX < (Renderer.screen.getWidth() / 2) - 70) {
      if (this.mouseY > this.y + 12 && this.mouseY < this.y + 32) this.hover = 1;
      else if (this.mouseY > this.y + 32 && this.mouseY < this.y + 52) this.hover = 2;
      else if (this.mouseY > this.y + 52 && this.mouseY < this.y + 72) this.hover = 3;
      else this.hover = 0;
    } else this.hover = 0;

    if (this.hover == 1 && (this.selected == 1 || this.selected == 0)) {
      this.sliders.r.width = easeOut(this.sliders.r.width, 5, 10);
      this.sliders.r.color = easeOut(this.sliders.r.color, 255, 10);
    } else if (this.selected == 0) {
      this.sliders.r.width = easeOut(this.sliders.r.width, 3, 10);
      this.sliders.r.color = easeOut(this.sliders.r.color, 200, 10);
    }
    if (this.hover == 2 && (this.selected == 2 || this.selected == 0)) {
      this.sliders.g.width = easeOut(this.sliders.g.width, 5, 10);
      this.sliders.g.color = easeOut(this.sliders.g.color, 255, 10);
    } else if (this.selected == 0) {
      this.sliders.g.width = easeOut(this.sliders.g.width, 3, 10);
      this.sliders.g.color = easeOut(this.sliders.g.color, 200, 10);
    }
    if (this.hover == 3 && (this.selected == 3 || this.selected == 0)) {
      this.sliders.b.width = easeOut(this.sliders.b.width, 5, 10);
      this.sliders.b.color = easeOut(this.sliders.b.color, 255, 10);
    } else if (this.selected == 0) {
      this.sliders.b.width = easeOut(this.sliders.b.width, 3, 10);
      this.sliders.b.color = easeOut(this.sliders.b.color, 200, 10);
    }

    if (this.selected != 0) {
      // Calculate slide
      var slide = Math.round(((this.mouseX - 100) / ((Renderer.screen.getWidth() / 2) - 170)) * 255);
      if (slide < 0) slide = 0;
      if (slide > 255) slide = 255;

      // Apply slide
      if (this.selected == 1 && this.color.r != slide) this.color.r = slide;
      else if (this.selected == 2 && this.color.g != slide) this.color.g = slide;
      else if (this.selected == 3 && this.color.b != slide) this.color.b = slide;
    }
  }

  this.click = function() {
    if (this.hover != 0) this.selected = this.hover;
  }

  this.release = function() {
    this.selected = 0;
  }

  // Text
  this.draw = function(x, y, mouseX, mouseY) {
    // Set values
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.y = y;

    // Draw
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

    // Red slider
    Renderer.drawRect(
      Renderer.color(this.sliders.r.color, this.sliders.r.color, this.sliders.r.color, this.alpha),
      100 + (((Renderer.screen.getWidth() / 2) - 170) * (this.color.r / 255)) - (this.sliders.r.width / 2),
      y + 16,
      this.sliders.r.width,
      11
    );

    // Green slider
    Renderer.drawRect(
      Renderer.color(this.sliders.g.color, this.sliders.g.color, this.sliders.g.color, this.alpha),
      100 + (((Renderer.screen.getWidth() / 2) - 170) * (this.color.g / 255)) - (this.sliders.g.width / 2),
      y + 36,
      this.sliders.g.width,
      11
    );

    // Blue slider
    Renderer.drawRect(
      Renderer.color(this.sliders.b.color, this.sliders.b.color, this.sliders.b.color, this.alpha),
      100 + (((Renderer.screen.getWidth() / 2) - 170) * (this.color.b / 255)) - (this.sliders.b.width / 2),
      y + 56,
      this.sliders.b.width,
      11
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

function wp_waypointSaveButtonElement() {
  this.mouseX = 0, this.mouseY = 0;

  this.textColor = {
    r: 170,
    g: 0,
    b: 0
  };
  this.saveX = 25;
  this.checkX = 25;
  this.checkAlpha = 0;
  this.rectAlpha = 0;

  this.hovered = false;

  this.step = function() {
    if (this.mouseX >= 15 && this.mouseX < Renderer.getStringWidth("✓ Save") + 30 && this.mouseY >= 5 && this.mouseY < 24) this.hovered = true;
    else this.hovered = false;

    if (this.hovered) {
      this.textColor.r = easeOut(this.textColor.r, 170, 10);
      this.textColor.g = easeOut(this.textColor.g, 0, 10);
      this.textColor.b = easeOut(this.textColor.b, 0, 10);

      this.saveX = easeOut(this.saveX, 30, 5, 0.1);
      this.checkX = easeOut(this.checkX, 20, 5, 0.1);

      this.checkAlpha = easeOut(this.checkAlpha, 255, 10);
      this.rectAlpha = easeOut(this.rectAlpha, 150, 10);
    } else {
      this.textColor.r = easeOut(this.textColor.r, 255, 10);
      this.textColor.g = easeOut(this.textColor.g, 85, 10);
      this.textColor.b = easeOut(this.textColor.b, 85, 10);

      this.saveX = easeOut(this.saveX, 25, 12, 0.1);
      this.checkX = easeOut(this.checkX, 25, 12, 0.1);

      this.checkAlpha = easeOut(this.checkAlpha, 0, 10);
      this.rectAlpha = easeOut(this.rectAlpha, 0, 10);
    }
  }

  this.click = function() {

  }

  this.draw = function(x, y, mouseX, mouseY, state) {
    this.mouseX = mouseX, this.mouseY = mouseY;

    // Background hover box
    Renderer.drawRect(
      Renderer.color(170, 170, 170, this.rectAlpha),
      15,
      state.guiDepth + 5,
      Renderer.getStringWidth("✓ Save") + 15,
      19
    );

    // Save
    Renderer.text(
      "Save",
      this.saveX,
      state.guiDepth + 10
    ).setColor(
      Renderer.color(
        this.textColor.r,
        this.textColor.g,
        this.textColor.b,
        state.elementAlpha
      )
    ).setShadow(true).draw();

    // Check
    Renderer.text(
      "✓",
      this.checkX,
      state.guiDepth + 10
    ).setColor(
      Renderer.color(
        this.textColor.r,
        this.textColor.g,
        this.textColor.b,
        this.checkAlpha
      )
    ).setShadow(true).draw();

    return y;
  }
}
