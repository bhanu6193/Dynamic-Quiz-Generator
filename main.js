const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

let questions = [];
let time = 0;
let score = 0;
let currQuestion = 0;
let timer;

const startQuiz = () => {
    const num = numQuestion.value;
    const cat = category.value;
    const diff = difficulty.value;
    time = parseInt(timePerQuestion.value);
    loadingAnimation();
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            startScreen.classList.add("hide");
            quiz.classList.remove("hide");
            showQuestion();
        })
        .catch((error) => {
            console.error('Error fetching questions:', error);
        });
};

const showQuestion = () => {
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answers-wrapper");
    const questionNumber = document.querySelector(".number");

    questionText.innerHTML = questions[currQuestion].question;

    const answers = [
        ...questions[currQuestion].incorrect_answers,
        questions[currQuestion].correct_answer,
    ];
    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `<div class="answer">
            <span class="checkbox">
                <i class="fas fa-check"></i>
            </span>
            <span class="text">${answer}</span>
        </div>`;
    });
    questionNumber.innerHTML = `Question <span class="current">${currQuestion + 1}</span> <span class="total">/${questions.length}</span>`;

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!quiz.classList.contains("hide")) {
                clearInterval(timer); // Clear timer immediately after answer selection
                checkAnswer(answer);
            }
        });
    });

    startTimer(time); // Start timer with updated time
};


const startTimer = (time) => {
    clearInterval(timer);
    let currentTime = time;
    timer = setInterval(() => {
        progress(currentTime);
        currentTime--;
        if (currentTime < 0) {
            clearInterval(timer);
            if (!quiz.classList.contains("hide")) {
                checkAnswer(null); // Check answer with null argument for unanswered case
            }
        }
    }, 1000);
};

const progress = (value) => {
    const percentage = ((time - value) / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};

const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length === 10) {
            startBtn.innerHTML = "Loading";
        } else {
            startBtn.innerHTML += ".";
        }
    }, 500);
};

const checkAnswer = (selectedAnswer) => {
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        if (answer === questions[currQuestion].correct_answer) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            document.querySelectorAll(".answer").forEach((ans) => {
                if (ans.querySelector(".text").innerHTML === questions[currQuestion].correct_answer) {
                    ans.classList.add("correct");
                }
            });
        }
    } else {
        document.querySelectorAll(".answer").forEach((ans) => {
            if (ans.querySelector(".text").innerHTML === questions[currQuestion].correct_answer) {
                ans.classList.add("correct");
            }
        });
    }

    document.querySelectorAll(".answer").forEach((ans) => {
        ans.classList.add("checked");
    });

    setTimeout(nextQuestion, 1000); // Automatically move to the next question after 1 second delay
};

const nextQuestion = () => {
    currQuestion++;
    if (currQuestion < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
};

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    const incorrect = questions.length - score; // Calculate incorrect questions
    const unanswered = Math.max(0, questions.length - (currQuestion + 1)); // Calculate unanswered questions, ensuring it's not negative
    totalScore.innerHTML = `/${questions.length}`;
    document.querySelector(".correct-score").innerHTML = score;
    document.querySelector(".incorrect-score").innerHTML = incorrect;
    document.querySelector(".unanswered-score").innerHTML = unanswered;
};


const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};

const startBtn = document.querySelector(".start");
const numQuestion = document.querySelector("#num");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");
const endScreen = document.querySelector(".end-screen");

startBtn.addEventListener("click", startQuiz);
