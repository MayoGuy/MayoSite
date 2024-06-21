import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import flag from './flag.svg'
import bomb from './bomb.svg'
import refresh from './refresh.svg'
import config from './hamburger.svg'
import {Helmet} from 'react-helmet'
import { Timer, Configurations} from './helpers';


function Square(props) {
    const sq = props.square
    let val = sq.value

    // Empty cell when value is 0 or is an Image
    if (sq.value === 0) {
        val = ''
    }
    let img = sq.flag ? <img src={flag}></img> : null;
    if (sq.open && sq.value === 'X') {
        img = <img src={bomb}></img>;
        val = ''
    }

    // Animation handling
    let block = sq.open ? <div className='block top-part disappeared' ></div> : <div className='block top-part' ></div>;
    if (sq.open && !sq.animationed) {
        block = <div className='block top-part disappear' onAnimationEnd={props.animationHandler} ></div>;
    }

    // Flagging
    const handler = (e) => {
        e.preventDefault();
        props.onContextMenu()
    }

    return (
        <button className="square" onClick={props.onClick} onContextMenu={handler} >
            {img}
            {block}
            <div className='block val'>{val}</div>
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array.from({ length: this.props.box }, () => Array(this.props.box).fill({ value: 0, flag: false, open: false, animationed: false })), // Generating an Array
            firstClick: false,
            mines: this.props.mines,
            flags: 0,
            win: false,
            gameEnd: false
        };
    }
    
    // Resetting the board, on configurations save
    static getDerivedStateFromProps(props, state) {
        if (props.box !== state.squares.length) {
            return {
                squares: Array.from({ length: props.box }, () => Array(props.box).fill({ value: 0, flag: false, open: false, animationed: false })),
                firstClick: false,
                mines: props.mines,
                flags: 0,
                win: false,
                gameEnd: false
            }
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.win) this.checkWin()
    }

    // Converting from 1D to 2D
    toXY(num) {
        return [num % this.props.box, Math.floor(num / this.props.box)];
    }

    // Get surrounding cells, and filter out cells that are out of bounds
    getNeighbours(x, y) {
        var cells = [[x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x, y - 1], [x, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
        return cells.filter(cell => cell[0] >= 0 && cell[0] < this.props.box && cell[1] >= 0 && cell[1] < this.props.box);
    }

    checkWin() {
        for (let i = 0; i < this.state.squares.length; i++) {
            for (let j = 0; j < this.state.squares[i].length; j++) {
                if (!this.state.squares[i][j].open && this.state.squares[i][j].value !== 'X') {
                    return 
                }
            }
        }
        this.setState({gameEnd: true})
        this.setState({win: true})
    }

    // Randomly place mines on the board
    createMines(first) {
        var mines = [];
        while (mines.length < this.state.mines) {
            var r = Math.floor(Math.random() * Math.pow(this.props.box, 2));
            if (mines.indexOf(r) === -1 && r !== first) mines.push(r);
        }
        this.setState(prevState => {
            const squares = prevState.squares.map(row => row.slice());
            for (let i = 0; i < mines.length; i++) {
                let [x, y] = this.toXY(mines[i]);
                squares[y][x] = { ...squares[y][x], value: 'X' };
            }
            return { squares };
        }, this.createNums);
    }


    // Count number of mines around each cell
    createNums() {
        this.setState(prevState => {
            const squares = prevState.squares.map(row => row.slice());
            for (let x = 0; x < this.props.box; x++) {
                for (let y = 0; y < this.props.box; y++) {
                    if (squares[y][x].value === 'X') {
                        let cells = this.getNeighbours(x, y);
                        for (let j = 0; j < cells.length; j++) {
                            let [xt, yt] = cells[j];
                            if (squares[yt][xt].value !== 'X') {
                                squares[yt][xt] = { ...squares[yt][xt], value: squares[yt][xt].value + 1 };
                            }
                        }
                    }
                }
            }
            return { squares };
        });
    }
 
    // Square click handler
    handleClick(x, y) {
        if (this.state.gameEnd) return; 
        if (!this.state.firstClick) {  // Making sure first click is not a mine
            this.createMines(y * this.props.box + x);
            this.setState({ firstClick: true }, () => this.handleClick(x, y));
            return;
        }
        if (!this.state.squares[y][x].open && !this.state.squares[y][x].flag) {
            this.setState(prevState => {
                if (prevState.squares[y][x].value === 'X') { // Boom
                    this.setState({ gameEnd: true });
                    this.bombClick(x, y);
                    return;
                }
                const squares = prevState.squares.map(row => row.slice());
                squares[y][x] = { ...squares[y][x], open: true };
                return { squares };
            }, () => {
                if (this.state.squares[y][x].value === 0) {
                    this.openSquares(x, y);
                }
            });
        } else if (this.state.squares[y][x].open ) {
            this.openFlagNeighbours(x, y);
        }
    }

    //Flagging the cells
    handleRightClick(x, y) {
        if (this.state.gameEnd) return;
        if (this.state.squares[y][x].open) return;
        this.setState(prevState => {
            const squares = prevState.squares.map(row => row.slice());
            const flagged = !squares[y][x].flag
            if (flagged) this.setState({ flags: prevState.flags + 1 });
            else this.setState({ flags: prevState.flags - 1 });
            squares[y][x] = { ...squares[y][x], flag: squares[y][x].open ? !flagged : flagged };
            return { squares };
        });
        return false;
    }

    // Making sure the animations don't run again
    handleAnimationEnd = (e, x, y) => {
            this.setState(prevState => {
                const squares = prevState.squares.map(row => row.slice());
                squares[y][x] = { ...squares[y][x], animationed: true };
                return { squares };
            })
            e.target.classList.remove('disappear');
            e.target.classList.remove('top-part');
    };

    // Open cells around a flagged cell
    openFlagNeighbours(x, y) {
        const val = this.state.squares[y][x].value;
        var cells = this.getNeighbours(x, y);
        let flagnums = 0;
        
        cells.forEach(cell => {
            if (this.state.squares[cell[1]][cell[0]].flag) {
                flagnums++;
            }
        })
        if (flagnums === val) {
            cells.forEach(cell => {
                if (!this.state.squares[cell[1]][cell[0]].open && !this.state.squares[cell[1]][cell[0]].flag) {
                    this.handleClick(cell[0], cell[1]);
                }
            })
        }
    }

    // Open all exposed empty cells in the board
    openSquares(x, y) {
        const squares = this.state.squares.map(row => row.slice());
        const queue = [[x, y]];
        const visited = Array.from({ length: this.props.box }, () => Array(this.props.box).fill(false));
    
        while (queue.length > 0) {
            const [currentX, currentY] = queue.shift();
            const currentSquare = squares[currentY][currentX];
    
            if (visited[currentY][currentX] || currentSquare.flag || currentSquare.value === 'X') {
                continue;
            }
    
            visited[currentY][currentX] = true;
            squares[currentY][currentX] = { ...currentSquare, open: true };
            if (currentSquare.value === 0) {
                const neighbours = this.getNeighbours(currentX, currentY);
                queue.push(...neighbours.filter(([newX, newY]) => 
                    !visited[newY][newX] && !squares[newY][newX].open && !squares[newY][newX].flag && squares[newY][newX].value !== 'X'
                ));
            }
        }
    
        this.setState({ squares });
    }
    
    // Game ending animation, bombs opening randially outward
    bombClick(x, y) {
        let bombs = [];
        const squares = this.state.squares.map(row => row.slice());
        for (let i = 0; i < this.props.box; i++) {
            for (let j = 0; j < this.props.box; j++) {
                if (squares[i][j].value === 'X' && !squares[i][j].flag) {
                    if (i === y && j === x) {
                        continue
                    }
                    bombs.push([i, j]);
                }
            }
        }
        squares[y][x].open = true;
        squares[y][x].animationed = true;
        this.setState({ squares: squares });
        bombs.sort((point1, point2) => {
            const distance1 = this.calculateDistance(point1, [y, x]);
            const distance2 = this.calculateDistance(point2, [y, x]);
            return distance1 - distance2;
        });
        this.openBombWithDelay(bombs, squares);
    }

    // Euclidian distance formula
    calculateDistance(point1, point2) {
        const dx = point1[0] - point2[0];
        const dy = point1[1] - point2[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Game ending animation
    openBombWithDelay(bombs, squarecopy) {
        if (bombs.length===0) {
            return;
        }

        setTimeout(() => {
            const [ x, y ] = bombs[0];
            bombs.splice(0, 1)
            squarecopy[x][y].open = true;
            squarecopy[x][y].animationed = true;
            this.setState({ squares: squarecopy });

            document.querySelector('.board').classList.add('shake');

            setTimeout(() => {
                document.querySelector('.board').classList.remove('shake');
            }, 100);

            this.openBombWithDelay(bombs, squarecopy);
        }, 100);
    };

    // Rendering the board
    renderSquare(x, y) {
        const square = this.state.squares[y][x];
        return (
            <Square
                key={`${x}-${y}`}
                square={square}
                animationHandler={(e) => this.handleAnimationEnd(e, x, y)}
                onClick={() => this.handleClick(x, y)}
                onContextMenu={() => this.handleRightClick(x, y)}
            />
        );
    }

    // reset board, duh
    resetBoard = () => {
        this.setState({
            squares: this.state.squares.map(row => row.map(() => ({ value: 0, open: false, flag: false, animationed: false }))),
            firstClick: false,
            gameEnd: false,
            flags: 0,
            win: false,
        });
    }

    render() {
        const rows = [];
        for (let i = 0; i < this.props.box; i++) {
            for (let j = 0; j < this.props.box; j++) {
                rows.push(this.renderSquare(j, i));
            }
        }

        const pause = !this.state.firstClick || this.state.gameEnd;
        const reset = this.state.firstClick;

        let status = this.state.win ? <div className='win'>You won!</div> : " ";


        return ( 
        <div className="game-board" >
            {status}
            <div className='board-data'>
                <Timer pause={pause} reset={reset}/>
                <div className='m-fs'>Mines: {this.state.mines} | Flags: {this.state.flags}</div>
                <img src={refresh} alt='refresh' className='refresh' onClick={this.resetBoard}/>
            </div>
            <div className="board">
                <div className='board-wrapper'>
                    <div className='board-inner'>
                    {rows} 
                    </div>
                </div>
                
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'Small',
            color: '#228B22',
            speed: 0.5,
            box: 8,
            mines: 10,
            open: false
        };
    }

    onSave = (color, speed, size) => {
        if (size !== this.state.size) {
            let ssize, box, mines
            switch (size) {
                case 'Small':
                    ssize = '50px';
                    box = 8
                    mines = 10
                    break;
                case 'Medium':
                    ssize = '40px';
                    box = 15
                    mines = 25
                    break;
                case 'Large':
                    ssize = '30px';
                    box = 25
                    mines = 75
                    break;
                default:
                    ssize = 50;
                
            }
            this.setState({ size: size, box: box, mines: mines });
            document.documentElement.style.setProperty('--boxes', box);
            document.documentElement.style.setProperty('--size', ssize);
        }
        document.documentElement.style.setProperty('--color', color);
        document.documentElement.style.setProperty('--speed', speed+'s');
        
        this.setState({ color, speed, size });
        this.setState({ open: false });
    }

    onClosed = () => {
        this.setState({ open: false });
    }
    render() {
        return (
            <div className="game">
                <Helmet>
                    <title>Minesweeper</title>
                    <link rel="icon" href="./bomb.svg"></link>
                </Helmet>
                <button className='config-button' onClick={() => this.setState({ open: true })}>
                    <img src={config} alt='config' className='config-img'></img>
                    </button>
                {this.state.open ? <Configurations onSave={this.onSave} sliderColor={this.state.color} opened={this.state.open} onClosed={this.onClosed} dcolor={this.state.color} dspeed={this.state.speed} dsize={this.state.size}/> : null}
                <h2 className='title'>MINESWEEPER</h2>
                <Board box={this.state.box} mines={this.state.mines}/>
            </div>
        );
    }
}

// ========================================


export default Game