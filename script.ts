window.onload = () => {
    class Game{
        constructor(grid: HTMLElement, result: HTMLElement, size: number) {
            this.clicks = 0;
            this.grid = grid;
            this.result = result;
            this.gridSize = size;
            this.printResult();
        }

        private grid: HTMLElement;
        private enemies: Array<Ship> = [];
        private result: HTMLElement;
        private clicks: number;
        private cells: Array<Cell> = [];
        public cellsId: Array<number> = [];
        readonly gridSize: number;

        drawGrid() {
            grid.style.setProperty("--gridSize", this.gridSize.toString());
            for(let i = 1; i < this.gridSize+1; i++){
                for(let j = 0; j < this.gridSize; j++){
                    let cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.innerHTML += i + "" +  i + "" + j;
                    cell.setAttribute('data-cell', i.toString() + i.toString() + j.toString());
                    this.grid.append(cell);
                    this.cells.push(new Cell(Number(i + "" + i + "" + j)));
                    this.cellsId.push(Number(i + "" + i + "" + j));
                }
            }
        }

        newGame(){
            this.drawGrid();
            this.createEnemy();
        }

        createEnemy(){
            this.enemies.push(new Ship(ShipType.malaLodHorizontal));
            this.enemies.push(new Ship(ShipType.malaLodVertical));
        }

        checkEnemies(){
            for(var i = 0; i < this.enemies.length; i++){
                if(!this.enemies[i].alive){
                    this.enemies.splice(i,1);
                }
            }
        }

        selectedCell(cellId: string): Cell{
            let selectCell: Cell;
            this.cells.forEach(cell => {
                if(cell.id == Number(cellId)){
                    selectCell = cell;
                }
            });
            return selectCell;
        }

        click(cellId: string){
            let cell: Cell = this.selectedCell(cellId);
            let cellElement: HTMLElement = document.querySelector('.cell[data-cell="' + cell.id + '"]');
            if(!cell.selected){
                this.clicks++;
                if(this.enemies.length > 0){
                    for(let i = 0; i < this.enemies.length; i++){
                        if(this.enemies[i].shipHitted(cell)){
                            cell.clickCell(cellElement, true);
                        } else {
                            cell.clickCell(cellElement, false);
                        }
                    }
                } else {
                    this.endGame();
                }
                
            } else {
                alert("Sem uz si kliknul");
            }
            this.checkEnemies();
            this.printResult();
        }

        printResult(){
            this.result.innerHTML = "Pocet kliknuti: " + this.clicks;
        }

        endGame(){
            alert("Konec hry!");
            grid.innerHTML = '';
            this.newGame();
            this.cells.forEach(cell => {
                cell.selected = false;
            });
            this.clicks = 0;
        }
    }

    class Cell{
        constructor(id: number) {
            this.id = id;
            this.selected = false;
        }

        public id: number;
        public selected: boolean;
        
        clickCell(cellElement: HTMLElement, enemyHitted: boolean){
            if(enemyHitted){
                cellElement.classList.add('hitted');
            } else {
                cellElement.classList.add('clicked');
            }
            this.selected = true;
        }
    }

    enum ShipType {
        malaLodHorizontal,
        malaLodVertical,
        velkaLodHorizontal,
        velkaLodVertical,
    }

    class Ship{
        constructor(type: ShipType){
            this.alive = true;
            this.type = type;
            this.drawShip();
        }
        public alive: boolean;
        public type: ShipType;
        public locations: Array<Cell> = [];

        generateRandom(type: string,except: number): number {
            switch(type){
                case "horizontal":
                    let numH: number = game.cellsId[Math.floor(Math.random() * game.cellsId.length)];
                    let lastNumberCharH: number = Number(numH.toString().split('').pop());
                    return (lastNumberCharH === except) ? this.generateRandom("horizontal", except) : numH;
                    break;
                case "vertical":
                    let numV: number = game.cellsId[Math.floor(Math.random() * game.cellsId.length)];
                    let lastNumberCharV: number = Number(numV.toString()[0]);
                    return (lastNumberCharV === except) ? this.generateRandom("vertical", except) : numV;
                    break;
                default:
                    break;
            }
        }

        drawShip(){
            switch(this.type){
                case ShipType.malaLodHorizontal: 
                    let randomNumberMLH: number = this.generateRandom("horizontal", game.gridSize - 1);
                    this.locations.push(new Cell(randomNumberMLH));
                    this.locations.push(new Cell(randomNumberMLH + 1));
                    console.log("randomNumberMLH: " + randomNumberMLH + " / " + (randomNumberMLH+1));
                    break;
                case ShipType.malaLodVertical: 
                    let randomNumberMLV: number = this.generateRandom("vertical", game.gridSize);
                    this.locations.push(new Cell(randomNumberMLV));
                    this.locations.push(new Cell(randomNumberMLV + 110));
                    console.log("randomNumberMLV: " + randomNumberMLV + " / " + (randomNumberMLV+110));
                    break;
                case ShipType.velkaLodHorizontal: 

                    break;
                case ShipType.velkaLodVertical: 

                    break;
                default:
                    break;
            }
        }

        shipHitted(id: Cell): boolean{
            for(let i = 0; i < this.locations.length; i++){
                if(this.locations[i].id == id.id){
                    this.locations.splice(i,1);
                    this.shipAlive();
                    return true;
                } else {
                    return false;
                }
            }
        }

        shipAlive(): boolean{
            if(this.locations.length > 0){
                return true;
            } else {
                this.alive = false;
                return false;
            }
        }
    }

    const grid: HTMLElement = document.getElementById("grid");
    const result: HTMLElement = document.getElementById("result");
    let game: Game = new Game(grid, result, 6)
    game.newGame();

    console.log(game);

    grid.addEventListener('click', function(e){
        let clickedCell: HTMLElement = <HTMLInputElement>e.target;
        game.click(clickedCell.dataset.cell);
    });
}