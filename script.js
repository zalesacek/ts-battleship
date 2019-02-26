window.onload = function () {
    var Game = /** @class */ (function () {
        function Game(grid, result, size) {
            this.enemies = [];
            this.cells = [];
            this.cellsId = [];
            this.clicks = 0;
            this.grid = grid;
            this.result = result;
            this.gridSize = size;
            this.printResult();
        }
        Game.prototype.drawGrid = function () {
            grid.style.setProperty("--gridSize", this.gridSize.toString());
            for (var i = 1; i < this.gridSize + 1; i++) {
                for (var j = 0; j < this.gridSize; j++) {
                    var cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.innerHTML += i + "" + i + "" + j;
                    cell.setAttribute('data-cell', i.toString() + i.toString() + j.toString());
                    this.grid.append(cell);
                    this.cells.push(new Cell(Number(i + "" + i + "" + j)));
                    this.cellsId.push(Number(i + "" + i + "" + j));
                }
            }
        };
        Game.prototype.newGame = function () {
            this.drawGrid();
            this.createEnemy();
        };
        Game.prototype.createEnemy = function () {
            this.enemies.push(new Ship(ShipType.malaLodHorizontal));
            this.enemies.push(new Ship(ShipType.malaLodVertical));
        };
        Game.prototype.checkEnemies = function () {
            for (var i = 0; i < this.enemies.length; i++) {
                if (!this.enemies[i].alive) {
                    this.enemies.splice(i, 1);
                }
            }
        };
        Game.prototype.selectedCell = function (cellId) {
            var selectCell;
            this.cells.forEach(function (cell) {
                if (cell.id == Number(cellId)) {
                    selectCell = cell;
                }
            });
            return selectCell;
        };
        Game.prototype.click = function (cellId) {
            var cell = this.selectedCell(cellId);
            var cellElement = document.querySelector('.cell[data-cell="' + cell.id + '"]');
            if (!cell.selected) {
                this.clicks++;
                if (this.enemies.length > 0) {
                    for (var i = 0; i < this.enemies.length; i++) {
                        if (this.enemies[i].shipHitted(cell)) {
                            cell.clickCell(cellElement, true);
                        }
                        else {
                            cell.clickCell(cellElement, false);
                        }
                    }
                }
                else {
                    this.endGame();
                }
            }
            else {
                alert("Sem uz si kliknul");
            }
            this.checkEnemies();
            this.printResult();
        };
        Game.prototype.printResult = function () {
            this.result.innerHTML = "Pocet kliknuti: " + this.clicks;
        };
        Game.prototype.endGame = function () {
            alert("Konec hry!");
            grid.innerHTML = '';
            this.newGame();
            this.cells.forEach(function (cell) {
                cell.selected = false;
            });
            this.clicks = 0;
        };
        return Game;
    }());
    var Cell = /** @class */ (function () {
        function Cell(id) {
            this.id = id;
            this.selected = false;
        }
        Cell.prototype.clickCell = function (cellElement, enemyHitted) {
            if (enemyHitted) {
                cellElement.classList.add('hitted');
            }
            else {
                cellElement.classList.add('clicked');
            }
            this.selected = true;
        };
        return Cell;
    }());
    var ShipType;
    (function (ShipType) {
        ShipType[ShipType["malaLodHorizontal"] = 0] = "malaLodHorizontal";
        ShipType[ShipType["malaLodVertical"] = 1] = "malaLodVertical";
        ShipType[ShipType["velkaLodHorizontal"] = 2] = "velkaLodHorizontal";
        ShipType[ShipType["velkaLodVertical"] = 3] = "velkaLodVertical";
    })(ShipType || (ShipType = {}));
    var Ship = /** @class */ (function () {
        function Ship(type) {
            this.locations = [];
            this.alive = true;
            this.type = type;
            this.drawShip();
        }
        Ship.prototype.generateRandom = function (type, except) {
            switch (type) {
                case "horizontal":
                    var numH = game.cellsId[Math.floor(Math.random() * game.cellsId.length)];
                    var lastNumberCharH = Number(numH.toString().split('').pop());
                    return (lastNumberCharH === except) ? this.generateRandom("horizontal", except) : numH;
                    break;
                case "vertical":
                    var numV = game.cellsId[Math.floor(Math.random() * game.cellsId.length)];
                    var lastNumberCharV = Number(numV.toString()[0]);
                    return (lastNumberCharV === except) ? this.generateRandom("vertical", except) : numV;
                    break;
                default:
                    break;
            }
        };
        Ship.prototype.drawShip = function () {
            switch (this.type) {
                case ShipType.malaLodHorizontal:
                    var randomNumberMLH = this.generateRandom("horizontal", game.gridSize - 1);
                    this.locations.push(new Cell(randomNumberMLH));
                    this.locations.push(new Cell(randomNumberMLH + 1));
                    console.log("randomNumberMLH: " + randomNumberMLH + " / " + (randomNumberMLH + 1));
                    break;
                case ShipType.malaLodVertical:
                    var randomNumberMLV = this.generateRandom("vertical", game.gridSize);
                    this.locations.push(new Cell(randomNumberMLV));
                    this.locations.push(new Cell(randomNumberMLV + 110));
                    console.log("randomNumberMLV: " + randomNumberMLV + " / " + (randomNumberMLV + 110));
                    break;
                case ShipType.velkaLodHorizontal:
                    break;
                case ShipType.velkaLodVertical:
                    break;
                default:
                    break;
            }
        };
        Ship.prototype.shipHitted = function (id) {
            for (var i = 0; i < this.locations.length; i++) {
                if (this.locations[i].id == id.id) {
                    this.locations.splice(i, 1);
                    this.shipAlive();
                    return true;
                }
            }
            return false;
        };
        Ship.prototype.shipAlive = function () {
            if (this.locations.length > 0) {
                return true;
            }
            else {
                this.alive = false;
                return false;
            }
        };
        return Ship;
    }());
    var grid = document.getElementById("grid");
    var result = document.getElementById("result");
    var game = new Game(grid, result, 6);
    game.newGame();
    console.log(game);
    grid.addEventListener('click', function (e) {
        var clickedCell = e.target;
        game.click(clickedCell.dataset.cell);
    });
};
