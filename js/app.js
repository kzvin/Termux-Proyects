document.addEventListener('DOMContentLoaded', () => {

    const squares = document.querySelectorAll('.grid div')
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('.countScore')
    const startBtn = document.querySelector('.start')
    const livesDisplay = document.querySelector('.countLives')

    const WIDTH = 30
    let currentIndex
    let appleIndex
    let currentSnake
    let direction
    let score, lives, speed, intervalTime, interval, stopGame

    lives = 3
    score = 0

    const startGame = () => {
        if (currentSnake)
            currentSnake.forEach(index => squares[index].classList.remove('snake'))
        squares.forEach(element => element.classList.remove('apple'))

        clearInterval(interval)

        direction = 1
        intervalTime = 250
        currentSnake = [452, 451, 450]
        currentIndex = 0
        speed = 0.97
        appleIndex = 0
        stopGame = false

        randomApple(false)

        scoreDisplay.innerText = score
        livesDisplay.innerText = lives

        currentSnake.forEach(index => squares[index].classList.add('snake'))
        interval = setInterval(moveOutcomes, intervalTime)
        grid.style = (stopGame ? "background-color:wheat" : "background-color:rgb(3,22,9)")
    }

    const moveOutcomes = () => {
        if (
            (currentSnake[0] + WIDTH >= (WIDTH * WIDTH) && direction === WIDTH) ||
            (currentSnake[0] % WIDTH === 0 && direction === -1) ||
            (currentSnake[0] % WIDTH === WIDTH - 1 && direction === 1) ||
            (currentSnake[0] - WIDTH < 0 && direction === -WIDTH) ||
            squares[currentSnake[0] + direction].classList.contains('snake')
        ) {
            stopGame = true
            livesDisplay.innerText = --lives
            squares.forEach(element => element.classList.remove('apple'))

            if (lives == 0) {
                score = 0
                livesDisplay.innerText = "Game Over"
                lives = 3
                return clearInterval(interval)
            } else {
                return clearInterval(interval)
            }
        }

        const tail = currentSnake.pop()
        squares[tail].classList.remove('snake')
        currentSnake.unshift(currentSnake[0] + direction)


        //deals with snake getting apple
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple')
            if (squares[currentSnake[0]].classList.contains('apple2')) {
                squares[currentSnake[0]].classList.remove('apple2')
                scoreDisplay.textContent = ++score
            }
            squares[tail].classList.add('snake')
            currentSnake.push(tail)
            scoreDisplay.textContent = ++score
            intervalTime = intervalTime * speed
            randomApple(true)
            clearInterval(interval)

            interval = setInterval(moveOutcomes, intervalTime)
        }
        squares[currentSnake[0]].classList.add('snake')


    }

    function randomApple(boolean) {

        if ((score % 3 === 0) && boolean)
            for (let index = 0; index < 2; index++) {
                do
                    appleIndex = Math.floor(Math.random() * squares.length)
                while (squares[appleIndex].classList.contains('snake'))
                if (index == 0)
                    squares[appleIndex].classList.add('apple')
                else
                    squares[appleIndex].classList.add('apple2')

                setTimeout(() => {
                    squares[appleIndex].classList.remove('apple2')
                }, 2000);

            }
        else {
            do
                appleIndex = Math.floor(Math.random() * squares.length)
            while (squares[appleIndex].classList.contains('snake'))
            squares[appleIndex].classList.add('apple')
        }

    }

    function control(e) {
        squares[currentIndex].classList.remove('snake')

        if (e.keyCode === 39 && direction != -1)
            direction = 1
        else if (e.keyCode === 38 && direction != WIDTH)
            direction = -WIDTH
        else if (e.keyCode === 37 && direction != 1)
            direction = -1
        else if (e.keyCode === 40 && direction != -WIDTH)
            direction = WIDTH

    }
    document.addEventListener('keydown', control)
    startBtn.addEventListener('click', startGame)

    grid.addEventListener('click', () => {
        if (!stopGame)
            clearInterval(interval)
        else
            interval = setInterval(moveOutcomes, intervalTime)
        grid.style = (stopGame ? "background-color:rgb(3,22,9)" : "background-color:wheat")

        stopGame = !stopGame
    })

})
