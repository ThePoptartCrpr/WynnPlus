// Temporary waypoints
/*var wp_waypoints = {
  '56011fc9-00c2-43eb-8353-a56880d1d0bd': {
    'name': 'Test Waypoint',
    'coordinates': [
      -153,
      10,
      -125
    ],
    'color': [
      50,
      100,
      255
    ],
    'hidden': false,
    'shownOnMap': true,
    'range': 'infinite',
    'icon': 'none',
  },
}

var frame = Renderer.image('../modules/WynnPlus/data/images/frame.png', '');
var icon = Renderer.image('../modules/WynnPlus/data/images/icons/paper.png', '');

var tessellator = Java.type("com.chattriggers.ctjs.minecraft.libs.Tessellator");

// Draw waypoints
register('renderOverlay', function(partialTicks) {
  for (var waypointUUID in wp_waypoints) {
    var waypoint = wp_waypoints[waypointUUID];

    // Calculate x/y differential
    var xDiff = waypoint.coordinates[0] - Player.getX();
    var yDiff = waypoint.coordinates[1] - (Player.getY() + 2);
    var zDiff = waypoint.coordinates[2] - Player.getZ();

    // Calculate direct distance
    var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(zDiff, 2));
    var directDistance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2) + Math.pow(zDiff, 2))

    // Calculate position on screen
    var waypointAngle = Math.atan(xDiff / zDiff);

    // ChatLib.chat('yaw: ' + ((Player.getYaw() + 180) % 90));

    // var diffAtAxis = Math.tan(Player.getYaw() + 90);

    var waypointX = 200; //Renderer.screen.getWidth() / 2 + (Player.getYaw() * (Renderer.screen.getWidth()));
    var waypointY = 100;


    // Prepare variables for drawing
    var width = Renderer.getStringWidth(waypoint.name) + 10 + 40;
    var height = 19 + 9 + 10;
    var distanceStr = 'Distance: ' + Math.round(directDistance) + 'm';

    // Draw waypoint on screen
    Renderer.drawRect(
      Renderer.color(waypoint.color[0], waypoint.color[1], waypoint.color[2], 100),
      waypointX - (width / 2) - 1,
      waypointY - (height / 2) - 1,
      width + 2,
      height + 2
    )

    Renderer.drawRect(
      Renderer.color(0, 0, 0),
      waypointX - (width / 2),
      waypointY - (height / 2),
      width,
      height
    )

    Renderer.text(
      waypoint.name,
      waypointX - (Renderer.getStringWidth(waypoint.name) / 2) + 20,
      waypointY - 9
    ).setColor(Renderer.color(waypoint.color[0], waypoint.color[1], waypoint.color[2])).draw();

    Renderer.text(
      distanceStr,
      waypointX - (Renderer.getStringWidth(distanceStr) / 2) + 20,
      waypointY + 5
    ).setColor(Renderer.color(255, 255, 255)).draw();

    frame.draw(
      waypointX - (width / 2) + 5,
      waypointY - (height / 2) + 5,
      30,
      30
    );

    icon.draw(
      waypointX - (width / 2) + 8.3,
      waypointY - (height / 2) + 7.5,
      25,
      25
    );
  }
});*/
