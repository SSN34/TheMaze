const columns = 10;
const rows = 10;
const width = 50;

const canvas = document.getElementById("game-canvas");
canvas.setAttribute("height", rows * width);
canvas.setAttribute("width", columns * width);

const ctx = canvas.getContext("2d");

const gotKey = new Audio();
gotKey.src = "./Audio/eat.wav";
const mazeChange = new Audio();
mazeChange.src = "./Audio/mazeChange.wav";

var grid = [];
var stack = [];
var current;
var player;
var playerPath = [];
var StartPos;
var EndPos;
var Key = [];
var KeysColledted = 0;
var gameStarted = false;
var gameInterval;
var keyImage = new Image();
var time = 0;
var animationFrame;
keyImage.src = "./Images/KEY.png";

function setup() {
	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < columns; i++) {
			grid.push(new Cell(i, j));
		}
	}

	current = grid[0];
	current.visited = true;

	getMaze();

	player = new Player(0, 0);

	playerPath.push(player);

	StartPos = new Player(0, 0);
	EndPos = new Player(columns - 1, rows - 1);

	for (var count = 0; count < 2; count++) {
		Key.push(
			new Player(
				Math.floor(Math.random() * columns),
				Math.floor(Math.random() * rows)
			)
		);
	}

	player.highlightPlayer("#FFBA63", 1);

	for (var count = 0; count < Key.length; count++) {
		Key[count].drawKey(keyImage);
	}

	messageBox("Press 'SPACEBAR' to Start", "#000", "Use Arrow Keys to Play");

	document.addEventListener("keyup", function (event) {
		switch (event.keyCode) {
			case 13:
				location.reload();
				break;
			case 32:
				if (!gameStarted) {
					gameStarted = true;
					gameInterval = setInterval(getNewMaze, 10000);
					KeyboardEvents();
					Update();
					setInterval(recTime, 1000);
				}
				break;
			default:
		}
	});
}

function recTime() {
	time++;
}

function KeyboardEvents() {
	document.addEventListener("keydown", function (event) {
		switch (event.keyCode) {
			case 37:
				UpdateMovement(3);
				break;
			case 38:
				UpdateMovement(0);
				break;
			case 39:
				UpdateMovement(1);
				break;
			case 40:
				UpdateMovement(2);
				break;
			default:
		}
	});
}

setup();

function Index(i, j) {
	if (i < 0 || j < 0 || i > rows - 1 || j > columns - 1) {
		return -1;
	}

	return i + j * columns;
}

function getMaze() {
	var nextNeighbour = current.getNeighbours();

	if (nextNeighbour) {
		nextNeighbour.visited = true;
		stack.push(current);
		removeWalls(current, nextNeighbour);
		current = nextNeighbour;
	} else if (stack.length > 0) {
		current = stack.pop();
	}

	if (checkVacant()) {
		getMaze();
	} else {
		drawMaze();
	}
	// drawMaze();
	// requestAnimationFrame(getMaze);
}

function messageBox(
	fillText,
	fillStyle,
	secondaryText = "",
	secondaryTextFillStyle = "#000"
) {
	ctx.fillStyle = "#fff";
	ctx.globalAlpha = "0.5";
	ctx.fillRect(0, (rows * width) / 3, columns * width, (rows * width) / 3);
	ctx.globalAlpha = "1.0";

	ctx.font = "30px Courier New";
	ctx.fillStyle = fillStyle;
	ctx.textAlign = "center";
	ctx.fillText(fillText, (rows * width) / 2, (columns * width) / 2);
	ctx.fillStyle = secondaryTextFillStyle;
	ctx.fillText(secondaryText, (rows * width) / 2, (columns * width) / 2 + 30);
}

function drawMaze() {
	ctx.fillStyle = "#F0E4E4";
	ctx.fillRect(0, 0, columns * width, rows * width);
	ctx.strokeStyle = "black";
	for (var i = 0; i < grid.length; i++) {
		grid[i].drawGrid();
	}
}

function checkVacant() {
	for (var i = 0; i < grid.length; i++) {
		if (!grid[i].visited) {
			return true;
		}
	}
	return false;
}

function getNewMaze() {
	grid = [];

	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < columns; i++) {
			grid.push(new Cell(i, j));
		}
	}

	getMaze();
	mazeChange.play();
}

function removeWalls(current, nextNeighbour) {
	var iDir = nextNeighbour.i - current.i;

	if (iDir == 1) {
		nextNeighbour.walls[3] = false;
		current.walls[1] = false;
	} else if (iDir == -1) {
		nextNeighbour.walls[1] = false;
		current.walls[3] = false;
	}

	var jDir = nextNeighbour.j - current.j;

	if (jDir == 1) {
		nextNeighbour.walls[0] = false;
		current.walls[2] = false;
	} else if (jDir == -1) {
		nextNeighbour.walls[2] = false;
		current.walls[0] = false;
	}
}

function Update() {
	clearCanvas();

	drawMaze();

	StartPos.highlightPlayer("red", 1);
	EndPos.highlightPlayer("green", 1);
	for (var count = 0; count < Key.length; count++) {
		Key[count].drawKey(keyImage);
	}

	// for (var i = 0; i < playerPath.length; i++) {
	// 	playerPath[i].highlightPlayer("#F0E4E4", 0.5);
	// }

	player.highlightPlayer("#FFBA63", 1);
	checkFinish();

	animationFrame = requestAnimationFrame(Update);
}

function checkFinish() {
	if (KeysColledted === 2) {
		if (player.i === EndPos.i && player.j == EndPos.j) {
			messageBox("YOU WON!!!", "#f00", "Press 'ENTER' to RESTART");
			clearInterval(gameInterval);
			document.removeEventListener("keydown", gameOver());
		}
	}
}

function gameOver() {}

function checkKeyInteraction() {
	for (var count = 0; count < Key.length; count++) {
		if (player.i === Key[count].i && player.j === Key[count].j) {
			gotKey.play();

			Key.splice(count, 1);
			KeysColledted++;
			getNewMaze();
		}
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, columns * width, rows * width);
}

function UpdateMovement(direction) {
	var gridToCheck = grid[Index(player.i, player.j)];
	var pathAvailable = true;
	while (pathAvailable) {
		checkKeyInteraction();

		if (!gridToCheck.walls[direction]) {
			if (direction == 0) {
				gridToCheck = grid[Index(gridToCheck.i, gridToCheck.j - 1)];
			} else if (direction == 1) {
				gridToCheck = grid[Index(gridToCheck.i + 1, gridToCheck.j)];
			} else if (direction == 2) {
				gridToCheck = grid[Index(gridToCheck.i, gridToCheck.j + 1)];
			} else if (direction == 3) {
				gridToCheck = grid[Index(gridToCheck.i - 1, gridToCheck.j)];
			}

			if (gridToCheck) {
				player = new Player(gridToCheck.i, gridToCheck.j);
				if (
					playerPath.filter(
						(x) => x.i === player.i && x.j === player.j
					).length === 0
				) {
					playerPath.push(player);
				}
				if (gridToCheck.walls.filter((x) => x === false).length >= 3) {
					pathAvailable = false;
				}
			}
		} else {
			pathAvailable = false;
		}
	}
}
