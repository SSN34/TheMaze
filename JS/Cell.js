class Cell {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.walls = [true, true, true, true];
		this.visited = false;
	}

	drawGrid() {
		if (this.visited) {
			ctx.fillStyle = "#A0C261";
			ctx.fillRect(this.i * width, this.j * width, width, width);
		}

		if (this.walls[0]) {
			this.line(
				this.i * width,
				this.j * width,
				(this.i + 1) * width,
				this.j * width
			);
		}
		if (this.walls[1]) {
			this.line(
				(this.i + 1) * width,
				this.j * width,
				(this.i + 1) * width,
				(this.j + 1) * width
			);
		}
		if (this.walls[2]) {
			this.line(
				(this.i + 1) * width,
				(this.j + 1) * width,
				this.i * width,
				(this.j + 1) * width
			);
		}
		if (this.walls[3]) {
			this.line(
				this.i * width,
				(this.j + 1) * width,
				this.i * width,
				this.j * width
			);
		}
	}

	line(ax, ay, bx, by) {
		ctx.beginPath();
		ctx.moveTo(ax, ay);
		ctx.lineTo(bx, by);
		ctx.stroke();
	}

	getNeighbours() {
		var neighbours = [];

		var top = grid[Index(this.i, this.j - 1)];
		var right = grid[Index(this.i + 1, this.j)];
		var bottom = grid[Index(this.i, this.j + 1)];
		var left = grid[Index(this.i - 1, this.j)];

		if (top && !top.visited) {
			neighbours.push(top);
		}
		if (right && !right.visited) {
			neighbours.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbours.push(bottom);
		}
		if (left && !left.visited) {
			neighbours.push(left);
		}

		if (neighbours.length > 0) {
			var selected = Math.floor(Math.random() * neighbours.length);
			return neighbours[selected];
		} else {
			return undefined;
		}
	}
}


class Player extends Cell{

    highlightPlayer(fillColor, globalalpha){
		ctx.fillStyle = fillColor;
		ctx.globalAlpha = globalalpha;
		ctx.fillRect((this.i * width) + 5, (this.j * width) + 5 , width - 10 , width - 10);
		ctx.globalAlpha = 1;
	}

	drawKey(image){
		ctx.drawImage(image,(this.i * width) + 5, (this.j * width) + 5 , width - 10 , width - 10);
	}
}

