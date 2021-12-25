document.addEventListener('DOMContentLoaded', () => {

    /* Global variable section */
    //board data 
    const grid = createGrid("grid", 200)
    const display = createGrid("next-shape", 36)
    let score = document.getElementById("score")
    let scoreCount = 0

    let displaySquare =  Array.from(display.querySelectorAll('div'))
    let squares = Array.from(grid.querySelectorAll('div'))
    let musicBox = document.getElementById("music-box")
    const animation = createGrid("animation", 200)
    let animationSquare = Array.from(animation.querySelectorAll('div'))

    // Controller 
    let leftButton = document.getElementById("left")
    let rotateButton = document.getElementById("up")
    let rightButton = document.getElementById("right")
    let downButton = document.getElementById("down")
    let dropButton = document.getElementById("drop")
    let startButton = document.getElementById("start")
    let pauseButton = document.getElementById("pause")
    let resetButton = document.getElementById("reset")




    let isGameOver = false
    let pause = true
    let reachBottom = false
    let currentPosition = 3
    let dropInterval
    let width = 10
    let timeId
    let moveId
    let lastRowIndex = buildLastRowIndex()

    // Tetromino data
    const oShape = [[0, 1, width, width+1],
                    [0, 1, width, width+1],
                    [0, 1, width, width+1],
                    [0, 1, width, width+1]]

    const zShape = [[0, 1, width+1, width+2],
                    [2, width+1, width+2, width*2+1],
                    [0, 1, width+1, width+2],
                    [2, width+1, width+2, width*2+1]]

    const sShape = [[1, 2, width, width+1],
                    [1, width+1, width+2, width*2+2],
                    [1, 2, width, width+1],
                    [1, width+1, width+2, width*2+2]]

    const lShape = [[0, width, width*2, width*2+1],
                    [0, 1, 2, width],
                    [1, 2, width+2, width*2+2],
                    [width*2, width*2+1, width*2+2, width+2]]

    const iShape = [[0, 1, 2, 3],
                    [0, width, width*2, width*3],
                    [0, 1, 2, 3],
                    [0, width, width*2, width*3]]

    const tShape = [[1, width, width+1, width+2],
                    [1, width+1, width*2+1, width+2],
                    [width, width+1, width+2, width*2+1],
                    [width, 1, width+1, width*2+1]]

    const iTetromino = [oShape, zShape, sShape, lShape, iShape, tShape]
    let randomShape = Math.floor(Math.random() * iTetromino.length)
    let rotationIndex = 0
    let currentShape = iTetromino[randomShape][rotationIndex]

    // brick color data 
    let brickColor = ["url('images/blue_block.png')", 
                      "url('images/green_block.png')",
                      "url('images/navy_block.png')",
                      "url('images/peach_block.png')",
                      "url('images/pink_block.png')",
                      "url('images/purple_block.png')",
                      "url('images/yellow_block.png')" ]

    let randomColor = Math.floor(Math.random() * brickColor.length)
    let currentColor = brickColor[randomShape]

    const oShapeSmall = [14, 15, 20, 21]
    const zShapeSmall = [14, 15, 21, 22]
    const sShapeSmall = [14, 15, 19, 20]
    const lShapeSmall = [20, 21, 22, 16]
    const iShapeSmall = [13, 14, 15, 16]
    const tShapeSmall = [15, 20, 21, 22] 

    const smallITeromino = [oShapeSmall, zShapeSmall, sShapeSmall, lShapeSmall, iShapeSmall, tShapeSmall]
    let randomShapeSmall = Math.floor(Math.random() * smallITeromino.length)
    let currentShapeSmall = smallITeromino[randomShapeSmall]
    currentShapeSmall.forEach(index => displaySquare[index].style.backgroundImage = brickColor[randomColor])


    /* Data initialization section */
    function createGrid(name, count) {
        // the main grid
        let grid = document.getElementById(name)
        for (let i = 0; i < count; i++) {
          let cell = document.createElement("div")
          cell.classList.add('cell')
          grid.appendChild(cell)
        }
        return grid
      }
    

    function buildLastRowIndex() {
        let lastRow = []
        for (let i=190; i<200; i++) {
            lastRow.push(i)
        }
        return lastRow
    }

    /* Navigation functions section */
    function moveDown() {
        try{
            if(pause) {
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
                if(isSettled) {
                    currentShape.forEach(index => {
                        squares[index + currentPosition].style.backgroundImage = currentColor
                        squares[index + currentPosition].style.backgroundSize = '20px'
                        squares[index + currentPosition].classList.add("block")
                    })
                    currentPosition = 3
                    drawOnGrid() 
    
                }
                undrawOnGrid() 
                currentPosition = currentPosition += width
                drawOnGrid() 
                freeze()
            }
        } catch {
            currentShape = iTetromino[randomShape][rotationIndex]
            currentPosition = 3
            drawOnGrid()
        }
        
    }

    function moveLeft() {
        undrawOnGrid()
        let isOnLeftEdge = currentShape.some(index => (index + currentPosition) % width === 0)
        let isConflict = currentShape.every(index => !isOnLeftEdge && !squares[index + currentPosition - 1].classList.contains('block'))
        if(!isOnLeftEdge && isConflict) {
            currentPosition -= 1
        }
        drawOnGrid()
    }

    function drop() {     
        dropInterval = setInterval(moveDown, 1)
        var myAudio = document.createElement("audio");
                myAudio.src = "force-hit.mp3";
                myAudio.play();
    }

    function moveRight() {
        undrawOnGrid()
        let isOnRightEdge = currentShape.some(index => (index + currentPosition) % width === width - 1)
        let isConflict = currentShape.every(index => !isOnRightEdge && !squares[index + currentPosition + 1].classList.contains('block'))
        if(!isOnRightEdge && isConflict) {
            currentPosition += 1
        }
        drawOnGrid()
    }

    function rotate() {
        rotationIndex ++
        if(rotationIndex > 3) {
            rotationIndex = 0
        }
        let nextRotation = rotationIndex
        let isOnLeftEdge = iTetromino[randomShape][nextRotation].some(index => (index + currentPosition) % width === 0)
        let isInRightEdge = iTetromino[randomShape][nextRotation].some(index => (index + currentPosition) % 10 == 9)
        let isTaken = iTetromino[randomShape][nextRotation].some(index => squares[index + currentPosition].classList.contains("block"))
            if(isOnLeftEdge && isInRightEdge) { 
                rotationIndex --
            
            } else if (isTaken) {
                rotationIndex --
            }
            else {
                undrawOnGrid()
                currentShape = iTetromino[randomShape][rotationIndex]
                drawOnGrid()
                sound("select.mp3")
            }
    }

    let colorToggle = true
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
                squares[index + currentPosition].style.backgroundSize = '20px'
                squares[index + currentPosition].classList.add("block")
            })
            currentPosition = 3
            randomColor = Math.floor(Math.random() * brickColor.length)
            currentColor = brickColor[randomColor]
            randomShape = randomShapeSmall
           
            displaySquare.forEach(cell => cell.style.backgroundImage = 'none')
            currentShape = iTetromino[randomShape][rotationIndex]
            randomShapeSmall = Math.floor(Math.random() * smallITeromino.length)
            currentShapeSmall = smallITeromino[randomShapeSmall]
            currentShapeSmall.forEach(index => displaySquare[index].style.backgroundImage = brickColor[randomColor])
            
            reachBottom = true
            continueGame = false
            clearInterval(dropInterval)
            checkGameOver()
            checkScore()
            drawOnGrid()
        }
    }

    /* action fuctions section*/
    let keys = []
    function move() {
        try {
            if(pause) {
                let isOnLeftEdge = currentShape.some(index => (index + currentPosition) % width === 0)
                if(keys && keys[37] && !isOnLeftEdge) {
                    moveLeft()
                }
                let isOnRightEdge = currentShape.some(index => (index + currentPosition) % width === width - 1)
                if(keys && keys[39] && ! isOnRightEdge) {
                    moveRight()
                }
                if (keys && keys[40]) {
                    moveDown()
                }
            }
        } catch {
            currentShape = iTetromino[randomShape][rotationIndex]
            currentPosition = 3
            drawOnGrid()
        }
    }
    
    let dropDisable = false
    let rotateDisable = false
    function keydown(e) {
        keys[e.keyCode] = (e.type == "keydown")

        if (e.keyCode === 32 && !dropDisable && !isGameOver) {
            drop()
            dropDisable = true
        }
        if(e.keyCode === 38 && !rotateDisable && !isGameOver) {
            rotate()
            rotateDisable = true
        }
    }

    function keyUp(e) {
        keys[e.keyCode] = (e.type == "keydown")
        if (e.keyCode === 32) {
            dropDisable = false
        }
        if (e.keyCode === 38) {
            rotateDisable = false
        }
    }

    function drawOnGrid() {
        try {
            currentShape.forEach(index => {
                squares[index + currentPosition].style.backgroundSize = '20px'
                squares[index + currentPosition].style.backgroundImage = currentColor
            })
        }  catch {
            currentShape = iTetromino[randomShape][rotationIndex]
            currentPosition = 3
            drawOnGrid()
        }

    }

    function undrawOnGrid() {
        currentShape.forEach(index => {
            squares[index + currentPosition].style.backgroundImage = 'none'
        })
    }
    
    function checkGameOver() {
        let initialPostion = 4
        let isGameOver = currentShape.some(index => {
            if (initialPostion + index + width < 200){
                if (squares[initialPostion + index + width].classList.contains(
                    "block")) {
                        return true
                    }
                return false
            }
            return false
        })
        if (isGameOver) {
            let gameOver = document.getElementById('gameOver')
            gameOver.style.display = "block"
            isGameOver = true

            clearInterval(timeId)
            clearInterval(moveId)
            sound("gameover.mp3")
            musicBox.pause()
            drawOnGrid()
        }
    }

    let lineRemoveCount = 0
    function checkScore() {   
        animationSquare.forEach(cell => cell.classList.remove('flash'))
        animationSquare.forEach(cell => cell.classList.remove('flash2'))
        for(let row=0; row<200; row+=10){
            
            let currentRow = [row, row+1, row+2, row+3, row+4, row+5, row+6, row+7, row+8, row+9]
            let isFull = currentRow.every(index => squares[index].classList.contains('block'))
  
            if(isFull) {
                pause = false
                lineRemoveCount ++
                currentRow.forEach(index => {
                    squares[index].style.backgroundImage = 'none'
                    squares[index].classList.remove('block')
                })

                clearInterval(timeId)
                clearInterval(moveId)
                
                pause = true;

                let removedSquares = squares.splice(row, width)
                squares = removedSquares.concat(squares)
                
                squares.forEach(cell => {
                    grid.appendChild(cell)
                })      
   

                if(colorToggle) {
                    currentRow.forEach(index => {
                        animationSquare[index].classList.add('flash')
                    })
                    colorToggle = false
                } else {
                    currentRow.forEach(index => {
                        animationSquare[index].classList.add('flash2')
                    })
                    colorToggle = true
                }
                timeId = setInterval(moveDown, 500)
                moveId = setInterval(move, 60); 
                
            }
        }
        if(lineRemoveCount >= 4) {
            sound("line-removal4.mp3")
            lineRemoveCount = 0
            scoreCount += 1000
            score.innerHTML = scoreCount
        } 
        if(lineRemoveCount >= 1 && lineRemoveCount <= 3) {
            sound("clear.wav")
            scoreCount += 100 * lineRemoveCount
            lineRemoveCount = 0
            score.innerHTML = scoreCount
        } 
        
    }

    function sound(src) {
        var myAudio = document.createElement("audio");
        myAudio.src = src;
        myAudio.play();
    }


    leftButton.addEventListener("click", moveLeft)
    rotateButton.addEventListener("click", rotate)
    rightButton.addEventListener("click", moveRight)
    downButton.addEventListener("click", moveDown)
    dropButton.addEventListener("click", drop)
    startButton.addEventListener("click", moveLeft)
    pauseButton.addEventListener("click", moveLeft)
    resetButton.addEventListener("click", moveLeft)
    

    drawOnGrid()
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyUp)
    moveId = setInterval(move, 60); 
    timeId = setInterval(moveDown, 1000)

})