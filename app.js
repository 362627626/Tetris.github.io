document.addEventListener('DOMContentLoaded', () => {

    /* Global variable section */
    //board data 
    const grid = document.getElementById('grid')
    const squares = Array.from(grid.querySelectorAll('div'))

    let currentPosition = 4
    let width = 10
    let adjustment = 10
    let timeId
    let lastRowIndex = buildLastRowIndex()

    // Tetromino data
    const oShape = [0, 1, width, width+1]
    const zShape = [0, 1, width+1, width+2]
    const lShape = [0, width, width+1, width+2]
    const iShape = [0, width, width*2, width*3]
    const tShape = [width, 1, width+1, width+2]
    const iTetromino = [oShape, zShape, lShape, iShape, tShape]
    let randomShape = Math.floor(Math.random() * iTetromino.length)
    let currentShape = iTetromino[randomShape]


    // brick color data 
    let brickColor = ["url('images/blue_block.png')", 
                      "url('images/green_block.png')",
                      "url('images/navy_block.png')",
                      "url('images/peach_block.png')",
                      "url('images/pink_block.png')",
                      "url('images/purple_block.png')",
                      "url('images/Yellow_block.png')" ]

    let randomColor = Math.floor(Math.random() * brickColor.length)
    let currentColor = brickColor[randomShape]


    /* Data initialization section */
    function buildLastRowIndex() {
        let lastRow = []
        for (let i=190; i<200; i++) {
            lastRow.push(i)
        }
        return lastRow
    }

    /* Navigation functions section */
    function moveDown() {
        undrawOnGrid()
        currentPosition += adjustment
        drawOnGrid()
        freeze()
    }

    function moveLeft() {
        undrawOnGrid()
        if(currentPosition % width != 0) {
            currentPosition -= 1
        }
        drawOnGrid()
    }

    function moveRight() {
        undrawOnGrid()
        let isOnRightEdge = currentShape.some(index => (index + currentPosition) % width === width - 1)
        if(!isOnRightEdge) {
            currentPosition += 1
        }
        drawOnGrid()
    }

    let drop =() => {
        let i = 0
        while(i < 15){
            moveDown()
            i++
        }
        currentPosition = 3 
    }

    function freeze() {
        let isBottom = currentShape.some(index => {
            for(let i=0; i<lastRowIndex.length; i++) {
                if(index + currentPosition == lastRowIndex[i]) {
                    return true
                }
            }
            return false
        }) 

        let isSettled = currentShape.some(index => {
            if (currentPosition + index + width < 200){
                if (squares[currentPosition + index + width].classList.contains(
                    "block")) {
                        return true
                    }
                return false
            }
            return false
        })
    
        if (isBottom || isSettled) {
            currentShape.forEach(index => {
                squares[index + currentPosition].style.backgroundImage = currentColor
                squares[index + currentPosition].classList.add("block")
            })
            currentPosition = 4
            randomColor = Math.floor(Math.random() * brickColor.length)
            currentColor = brickColor[randomColor]
            randomShape = Math.floor(Math.random() * iTetromino.length)
            currentShape = iTetromino[randomShape]
            drawOnGrid()
            
            ids.forEach(id => {
                clearInterval(id)
            })
        }
    }

    /* action fuctions section*/
    let keys = []
    let ids = []
    let downSpeed = 50
    
    function keydown(e) {
        console.log(keys)
        keys[e.keyCode] = (e.type == "keydown")
        if(keys && keys[37]) {
            ids.push(setInterval(moveLeft, 50))
        }
        if(keys && keys[39]) {
            ids.push(setInterval(moveRight, 50))
        }
        if (keys && keys[40]) {
            ids.push(setInterval(moveDown, downSpeed))
            if(downSpeed < 100) {
                downSpeed = downSpeed + 100
            }
        }  
        if (e.keyCode === 32) {
            ids.push(setInterval(moveDown, 0.1))
        } 
    }

    function keyUp(e) {
        keys[e.keyCode] = (e.type == "keydown")
        ids.forEach(id => {
            clearInterval(id)
            downSpeed = 50
        })
    }

    function drawOnGrid() {
        currentShape.forEach(index => {
            squares[index + currentPosition].style.backgroundImage = currentColor
        })
    }

    function undrawOnGrid() {
        currentShape.forEach(index => {
            squares[index + currentPosition].style.backgroundImage = "none"
        })
    }

    drawOnGrid()
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyUp)
    timeId = setInterval(moveDown, 1000)

})