document.addEventListener('DOMContentLoaded', () => {

    /* Global variable section */
    //board data 
    const grid = createGrid("grid", 200)
    const display = createGrid("next-shape", 36)
    let score = document.getElementById("score")
    let scoreCount = 0

    let isGameOver = false
    let currentPosition = 3
    let dropInterval
    let width = 10
    let timeId
    let moveId
    let lastRowIndex = buildLastRowIndex()

    let displaySquare =  Array.from(display.querySelectorAll('div'))
    let squares = Array.from(grid.querySelectorAll('div'))
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
    let restartButton = document.getElementById("restart")
    let musicButton =  document.getElementById("music")

    // Audio 
    var dropAudio = new Howl({
        src: ['audio/force-hit.mp3'],
        volume: 2.8
        });
        
    var rotateAudio =  new Howl({
        src: ['audio/select.mp3'],
        volume: 2.8
        });

    var scoreAudio =  new Howl({
        src: ['audio/clear.wav'],
        volume: 2.8
        });
  
    var scoreMutipleAudio =  new Howl({
        src: ['audio/line-removal4.mp3'],
        volume: 2.8
        });

    var pauseAudio =  new Howl({
        src: ['audio/pause.mp3'],
        volume: 2.8
        });

    var resumeAudio =  new Howl({
        src: ['audio/start.mp3'],
        volume: 2.8
        });
    
    var gameOverAudio =  new Howl({
        src: ['audio/gameover.mp3'],
        volume: 2.8
        });
    
    var terisOriginalAudio =  new Howl({
        src: ['audio/Tetris-original.mp3'],
        loop: true,
        volume: 0.5
        });

    var terisSpecialAudio =  new Howl({
        src: ['audio/Tetris-special.mp3'],
        loop: true,
        volume: 0.5
        });

    var terisClassicAudio =  new Howl({
        src: ['audio/Tetris-classic.mp3'],
        loop: true,
        volume: 0.5
        });

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

    const jShape = [[0, 1, width, width*2],
                    [width, width*2, width*2+1, width*2+2],
                    [2, width+2, width*2+2, width*2+1,],
                    [0, 1, 2, width+2]]           

    const iShape = [[0, 1, 2, 3],
                    [0, width, width*2, width*3],
                    [0, 1, 2, 3],
                    [0, width, width*2, width*3]]

    const tShape = [[1, width, width+1, width+2],
                    [1, width+1, width*2+1, width+2],
                    [width, width+1, width+2, width*2+1],
                    [width, 1, width+1, width*2+1]]

    const iTetromino = [oShape, zShape, sShape, lShape, jShape, iShape, tShape]
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
    const jShapeSmall = [20, 21, 22, 28]
    const iShapeSmall = [13, 14, 15, 16]
    const tShapeSmall = [15, 20, 21, 22] 

    const smallITeromino = [oShapeSmall, zShapeSmall, sShapeSmall, lShapeSmall, jShapeSmall, iShapeSmall, tShapeSmall]
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
        dropAudio.play()
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
                if(rotationIndex > 0) {
                    rotationIndex --
                }
            } else if (isTaken) {
                if(rotationIndex > 0) {
                    rotationIndex --
                }
            }
            else {
                undrawOnGrid()
                currentShape = iTetromino[randomShape][rotationIndex]
                drawOnGrid()
                rotateAudio.play()
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
    let leftFirst = true
    let rightFirst = true

    let leftId
    let rightId
    let pressTimeLeft = 0
    let pressTimeRight = 0
    function move() {
        if(!isGameOver) {
            let isOnLeftEdge = currentShape.some(index => (index + currentPosition) % width === 0)
            if(keys && keys[37] && !isOnLeftEdge) {
                if(leftFirst) {
                    leftId = setInterval(() => { pressTimeLeft ++
                    }, 3);
                    leftFirst = false
                    moveLeft()
                }
                if(pressTimeLeft > 20) {
                    moveLeft()
                }
                
            }
            let isOnRightEdge = currentShape.some(index => (index + currentPosition) % width === width - 1)
            if(keys && keys[39] && ! isOnRightEdge) {
                if(rightFirst) {
                    rightId = setInterval(() => { pressTimeRight ++
                    }, 3);
                    rightFirst = false
                    moveRight()
                }
                if(pressTimeRight > 20) {
                    moveRight()
                }
            }
            if (keys && keys[40]) {
                moveDown()
            }
        }
    }
    
    let dropDisable = false
    let rotateDisable = false

    let leftCount = 0
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
        if(e.keyCode === 37) {
            pressTimeLeft = 0
            clearInterval(leftId)
            leftFirst = true

        }
        if(e.keyCode === 39) {
            pressTimeRight = 0
            clearInterval(rightId)
            rightFirst = true
        }
    }

    let isPause = false 
    function pauseGame() {
        if(!isPause) {
            pauseAudio.play()
            let gameOver = document.getElementById('gameOver')
            gameOver.innerHTML = "PAUSE"
            gameOver.style.display = "block"
            clearInterval(timeId)
            timeId = null
            isPause = true
        }
    }

    function resumeGame() {
        if(isPause) {
            resumeAudio.play()
            isPause = false
            timeId = setInterval(moveDown, 1000)
            let gameOver = document.getElementById('gameOver')
            gameOver.style.display = "none"
        }

    }

    function drawOnGrid() {
        currentShape.forEach(index => {
            squares[index + currentPosition].style.backgroundSize = '20px'
            squares[index + currentPosition].style.backgroundImage = currentColor
        })
    }

    function undrawOnGrid() {
        currentShape.forEach(index => {
            squares[index + currentPosition].style.backgroundImage = 'none'
        })
    }
    
    function checkGameOver() {
        let initialPostion = 3
        isGameOver = currentShape.some(index => {
            if (initialPostion + index + width < 200){
                if (squares[initialPostion + index].classList.contains(
                    "block")) {
                        return true
                    }
                return false
            }
        })
        if (isGameOver) {
            let gameOver = document.getElementById('gameOver')
            gameOver.innerHTML = "Game Over"
            gameOver.style.display = "block"

            clearInterval(timeId)
            clearInterval(moveId)
            gameOverAudio.play()
            drawOnGrid()
            isGameOver = true
            terisSpecialAudio.stop()
            terisOriginalAudio.stop()
            terisClassicAudio.stop()
            restartButton.classList.add("hint")
        }
    }

    let soundSwitch = 0
    function switchMusic() {
        soundSwitch ++
        soundSwitch = soundSwitch > 3 ? 0 : soundSwitch
        musicButton.classList.remove('fas', 'fa-volume-mute')
        musicButton.classList.add('fas', 'fa-music')
        
        if (soundSwitch == 0) {
            terisSpecialAudio.play()
            terisOriginalAudio.stop()
            terisClassicAudio.stop()
        } else if (soundSwitch == 1) {
            terisOriginalAudio.play()
            terisSpecialAudio.stop()
            terisClassicAudio.stop()
        } else if (soundSwitch == 2) {
            terisClassicAudio.play()
            terisSpecialAudio.stop()
            terisOriginalAudio.stop()
        } else {
            musicButton.classList.remove('fas', 'fa-music')
            musicButton.classList.add('fas', 'fa-volume-mute')
            terisSpecialAudio.stop()
            terisOriginalAudio.stop()
            terisClassicAudio.stop()
        }
    }

    function restart() {
        squares.forEach(cell => cell.classList.remove("block"))
        squares.forEach(cell => cell.style.backgroundImage = 'none')
        drawOnGrid()
        currentPosition = 3
        moveId = setInterval(move, 60); 
        timeId = setInterval(moveDown, 1000)
        let gameOver = document.getElementById('gameOver')
        gameOver.style.display = "none"
        isGameOver = false
        score.innerHTML = 0
        soundSwitch = -1
        switchMusic()
    }

    let lineRemoveCount = 0
    function checkScore() {   
        animationSquare.forEach(cell => cell.classList.remove('flash'))
        animationSquare.forEach(cell => cell.classList.remove('flash2'))
        for(let row=0; row<200; row+=10){
            
            let currentRow = [row, row+1, row+2, row+3, row+4, row+5, row+6, row+7, row+8, row+9]
            let isFull = currentRow.every(index => squares[index].classList.contains('block'))
  
            if(isFull) {
                lineRemoveCount ++
                currentRow.forEach(index => {
                    squares[index].style.backgroundImage = 'none'
                    squares[index].classList.remove('block')
                })

                clearInterval(timeId)
                clearInterval(moveId)
                
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
                timeId = setInterval(moveDown, 1000)
                moveId = setInterval(move, 60); 
            }
        }

        if(lineRemoveCount == 3) {
            scoreMutipleAudio.play()
            lineRemoveCount = 0
            scoreCount += 500

        } 
        if(lineRemoveCount >= 4) {
            scoreMutipleAudio.play()
            lineRemoveCount = 0
            scoreCount += 1000

        } 
        if(lineRemoveCount >= 1 && lineRemoveCount <= 2) {
            scoreAudio.play()
            scoreCount += 100 * lineRemoveCount
            lineRemoveCount = 0
        } 
        score.innerHTML = scoreCount
    }

    function sound(src) {
        var myAudio = document.createElement("audio");
        myAudio.src = src;
        myAudio.play();
    }

    leftButton.addEventListener("click", function() {
        this.blur()
        if(!isGameOver && !isPause) moveLeft()
    }) 

    rightButton.addEventListener("click", function() {
        this.blur()
        if(!isGameOver && !isPause) moveRight()
    }) 

    startButton.addEventListener("click", function() {
        this.blur()
        if(!isGameOver && isPause) {
            startButton.style.background = "none"
            resumeGame()
        } 
    }) 

    pauseButton.addEventListener("click", function() {
        this.blur()
        if(!isGameOver) {
            startButton.style.background = "#82c91e"
            pauseGame()
        } 
    }) 

    restartButton.addEventListener("click", function() {
        this.blur()
        if(isGameOver) {
            restart()
            restartButton.style.background = "none"
            restartButton.classList.remove("hint")
        } 
    }) 

    downButton.addEventListener("click", function() {
        this.blur()
        if(!isGameOver && !isPause)  moveDown() 
    })

    rotateButton.addEventListener("click", function() {
        if(!isGameOver && !isPause) {
            rotate()
            this.blur()
            rotateDisable = true
        }
    })

    dropButton.addEventListener("click", function() {
        if(!isGameOver && !isPause) {
            drop()
            this.blur()
            dropDisable = true
        }
    })

    musicButton.addEventListener("click", function() {
        this.blur()
        if(!isGameOver)  switchMusic() 
    })

    drawOnGrid()
    terisSpecialAudio.play()
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyUp)
    moveId = setInterval(move, 60); 
    timeId = setInterval(moveDown, 1000)
})