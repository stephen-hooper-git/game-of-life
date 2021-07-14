'use strict';

window.addEventListener('resize', resized)

const canvas = document.querySelector('#display')
const ctx = canvas.getContext('2d')

const alive = 0xFFFFFF80  // a white pixel
const dead = 0x00000000   // a black pixel

let data //holds the canvas data 
let cells //provides us 32bit access (faster)
let next // next generation of cells    


let width = 0
resized()

animate() // kick things off with the first call to animate

function animate() {
    ctx.putImageData(data, 0, 0)
    tick()
    requestAnimationFrame(animate)
}

function clearData() {
    for (let i = 0; i < cells.length; i++) { cells[i] = 0 }
}

function randomFill() {

    for (let i = 0; i < cells.length; i++) {
        if (Math.random() > .8) {
            cells[i] = alive  //20% chance of being alive
        }
        else {
            cells[i] = dead
        }
    }
}

function makeCanvas(width, height) {

    data = ctx.createImageData(width, height)
    cells = new Uint32Array(data.data.buffer) // this is a 32 bit 'view' onto the data
    next = new Uint32Array(ctx.createImageData(width, height).data.buffer)


}


function tick() {

    let w = canvas.width

    //write a for "i" loop - which goes through every cell in cells
    //count the 'alive' neighbours of the i'th cell
    //based upon whether the (i'th) cell is alive, and the count of it's live neigbours - set next[i] to "dead or alive" 

    //Your code goes here :-

    for (let i = 0; i < cells.length; i++) {

        let aliveNeighbours = 0

        if (cells[i - w] == alive) { aliveNeighbours++ }
        if (cells[i + w] == alive) { aliveNeighbours++ }

        if (cells[i - 1] == alive) { aliveNeighbours++ }
        if (cells[i + 1] == alive) { aliveNeighbours++ }

        if (cells[i - w + 1] == alive) { aliveNeighbours++ }
        if (cells[i + w - 1] == alive) { aliveNeighbours++ }

        if (cells[i - w - 1] == alive) { aliveNeighbours++ }
        if (cells[i + w + 1] == alive) { aliveNeighbours++ }

        // Any live cell with two or three live neighbours survives.
        if (cells[i] == alive) {
            if (aliveNeighbours == 2 || aliveNeighbours == 3) {
                next[i] = alive
            } else {
                // All other live cells die in the next generation
                next[i] = dead
            }
        }

        // Any dead cell with three live neighbours becomes a live cell.
        if (cells[i] == dead) {
            if (aliveNeighbours == 3) {
                next[i] = alive
            } else {
                // Similarly, all other dead cells stay dead.
                next[i] = dead
            }
        }
    }

    //now we copy the next generation into the current for display (see animate())
    for (let i = 0; i < next.length; i++) {
        cells[i] = next[i]
    }

}

function resized() {
    let { innerWidth: width, innerHeight: height } = window //destructure window to get innerWidth into width ..etc

    width = Math.floor(width / 4)
    height = Math.floor(height / 4)

    canvas.width = width
    canvas.height = height
    makeCanvas(width, height)

    randomFill() //randomly fill the grid with dead/alive cells

}
