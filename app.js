document.addEventListener('DOMContentLoaded', () => {

    /* Global variable section */
    //board data 
    const grid = createGrid()
    const squares = Array.from(grid.querySelectorAll('div'))

    let reachBottom = false
    let currentPosition = 4
    let width = 10
    let timeId
    let lastRowIndex = buildLastRowIndex()

    // Tetromino data
    const oShape = [0, 1, width, width+1]
    const zShape = [[0, 1, width+1, width+2],
                    [2, width+1, width+2, width*2+1],
                    [0, 1, width+1, width+2],
                    [2, width+1, width+2, width*2+1]]

    const lShape = [0, width, width+1, width+2]
    const iShape = [0, width, width*2, width*3]
    const tShape = [width, 1, width+1, width+2]
    const iTetromino = [oShape, zShape, lShape, iShape, tShape]
    let randomShape = Math.floor(Math.random() * iTetromino.length)
    let rotationIndex = 0
    let currentShape = iTetromino[1][rotationIndex]



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
    function createGrid() {
        // the main grid
        let grid = document.getElementById("grid")
        for (let i = 0; i < 200; i++) {
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
        undrawOnGrid()
        currentPosition = currentPosition += width
        drawOnGrid()
        freeze()
    }

    function moveLeft() {
        undrawOnGrid()
        let isOnLeftEdge = currentShape.some(index => (index + currentPosition) % width === 0)
        if(!isOnLeftEdge) {
            currentPosition -= 1
        }
        drawOnGrid()

    }

    function drop() {
        while(!reachBottom) {
            moveDown()
        }          

        reachBottom = false
    }

    function moveRight() {
        undrawOnGrid()
        let isOnRightEdge = currentShape.some(index => (index + currentPosition) % width === width - 1)
        if(!isOnRightEdge) {
            currentPosition += 1
        }
        drawOnGrid()
    }

    function rotate() {
        undrawOnGrid()
        rotationIndex ++
        if(rotationIndex > 3) {
            rotationIndex = 0
        }
        currentShape = iTetromino[1][rotationIndex]
        drawOnGrid()

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
                squares[index + currentPosition].style.backgroundSize = '20px'
                squares[index + currentPosition].classList.add("block")
            })
            currentPosition = 4
            randomColor = Math.floor(Math.random() * brickColor.length)
            currentColor = brickColor[randomColor]
            randomShape = Math.floor(Math.random() * iTetromino.length)
            currentShape = iTetromino[1][rotationIndex]
          
            reachBottom = true
            continueGame = false
            drawOnGrid()
        }
    }

    /* action fuctions section*/
    let keys = []

    function move() {
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
    
    let dropDisable = false
    let rotateDisable = false
    function keydown(e) {
        keys[e.keyCode] = (e.type == "keydown")

        if (e.keyCode === 32 && !dropDisable) {
            drop()
            dropDisable = true
        }
        if(e.keyCode === 38 && !rotateDisable) {
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

    function sound(src) {
        this.sound = document.createElement("audio")
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto")
        this.sound.setAttribute("controls", "none")
        this.sound.style.display = "none"
        this.sound.loop = true
        document.body.appendChild(this.sound)
        this.play = function(){
            this.sound.play()
        }
        this.stop = function(){
            this.sound.pause()
        }    
    }


    
    mySound = new sound("Tetris.mp3");
    //mySound.play();
   // drawOnGrid()
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyUp)
    setInterval(move, 60); 
    timeId = setInterval(moveDown, 1000)

})