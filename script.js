const startBtn = document.getElementById("startmbtn");
const restartBtn = document.getElementById("restart");
const startModal = document.getElementById("startModal");
const endModal = document.getElementById("endModal");
const questionEl = document.getElementById("question");
const options = Array.from(document.getElementsByClassName("btn"));
const timerEl = document.getElementById("timer-el")
const maxQuestions = 10;

let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let interval;

let questionsList = [];
let usedQuestions = [];
let selectedAnswers = [];

fetch(
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        questionsList = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer)

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });
            return formattedQuestion;
        })
    })
    .catch(err => {
        console.log(err);
    })

let highScore = localStorage.getItem('highScore') || 0;

const highScoreArea = document.getElementById("highScoreArea");
if (highScore != 0) {
    highScoreArea.textContent = `Highest Score: ${highScore}`;
}


function startGame() {
    startModal.style.display = "none";
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questionsList];
    document.getElementById("score").textContent = `Score: `;
    getNewQuestion();
    document.getElementById("quizarea").style.visibility = "visible";
};

function restartGame() {
    endModal.style.display = "none";
    startModal.style.display = "block";
}


function getNewQuestion() {
    time = 11;
    clearInterval(interval);
    interval = setInterval(countdown, 1000)
    
    questionCounter++;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionEl.textContent = `Q${questionCounter}. ${currentQuestion.question}`;

    options.forEach(option => {
        const number = option.dataset['number'];
        option.textContent = currentQuestion['choice' + number];
    })
    usedQuestions.push(currentQuestion);
    availableQuestions.splice(questionIndex, 1)
}

function countdown() {
    if (time > 0) {
        time--;
        timerEl.textContent = time
    } else if (questionCounter < maxQuestions) {
        getNewQuestion()
    } else {
        clearInterval(interval)
    }
}


options.forEach(option => {
    option.addEventListener("click", e => {
        const selectedOption = e.target.dataset['number'];
        console.log(selectedOption)
        selectedAnswers.push(selectedOption);
        if (selectedOption == currentQuestion.answer) {
            classToAdd = 'correct';
            score++;
        } else {
            classToAdd = 'incorrect';
        };

        e.target.classList.add(classToAdd);

        setTimeout(() => {
            e.target.classList.remove(classToAdd);
            if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
                document.getElementById("quizarea").style.visibility = "hidden";
                endModal.style.display = "block";
                document.getElementById("score").textContent += ` ${score} / ${maxQuestions}`;
                if (score > highScore) {
                    highScore = score;
                    document.getElementById("msg").textContent = "You beat the Highest Score!"
                    highScoreArea.textContent = `Highest Score: ${highScore}`;
                } else (
                    document.getElementById("msg").textContent = ""
                )
                localStorage.setItem('highScore', highScore);
            } else {
                getNewQuestion()
            }
        }, 1000)
    })
})


startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
document.getElementById("viewans").addEventListener("click", () => {
    endModal.style.visibility = "hidden";
    document.getElementById("quizarea").style.display = "none";
    timerEl.style.visibility = "hidden";
    usedQuestions.forEach(question => {
        document.getElementById("allQuestions").innerHTML += `
            <div id="question" class=" container questions">Question: ${question.question}</div>
                <div id="options" class=" container options">
                    <button class="btn" data-number="1">${question.choice1}</button>
                    <button class="btn" data-number="2">${question.choice2}</button>
                    <button class="btn" data-number="3">${question.choice3}</button>
                    <button class="btn" data-number="4">${question.choice4}</button>
                </div>
    `

    options.forEach(option => {
        if (option.dataset['number'] == question.answer) {
            classToAdd = 'correct';
            score++;
        } else {
            classToAdd = 'incorrect';
        };
    
        option.classList.add(classToAdd);
        })
    })
})








