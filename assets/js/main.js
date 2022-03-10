class Section{
  constructor(type){
    this.type = type;
    this.quiz = [];
    this.points = 0;
    this.approved = 60;
  }

  insertQuiz(questions){
    questions.forEach( (file) => {
      this.quiz.push({ 
        question: file.question,
        answers: file.answers,
        correctanswer: file.correctAnswer,
        explanation: file.explanation });
    })
  }

  pointsQuiz(points){
    this.points = points
  }
}

const sectionQuiz = document.querySelector("#loadQuiz")
const initReading = document.querySelector("#initReading")
const initWriting = document.querySelector("#initWriting")
const bSubmit = document.querySelector("#submitQuiz")
const loadHistory = document.querySelector("#loadHistory")
const loadResults = document.querySelector("#loadResults")

//Initial Reading Section and Jquery on
$('#initReading').on('click', function () {
  rebootStorage()
  times("init")
  const dataJson = "../data/reading.json"
  const sectionReady = new Section("reading")
  loadHistory.innerHTML = 
  `
  My family lives in a small house. It’s simple but pretty. It has a large garden. I like to work in the garden but my sister hates to work in the garden. 
  She prefers to read. She reads in the morning, in the afternoon and at night.
  <br/>I give all of the vegetables to mom and dad. They like to cook in our small kitchen. I eat any vegetable but my sister eats only a few.
  <br/>My family always eats breakfast and dinner together. We talk. We laugh. Then my sister washes the dishes.
  <br/>At night dad likes to listen to music. Mom works on the computer. I watch television. And my sister reads.
  <br/>Soon we go to bed. My parents go to bed late but my sister and I go to bed early. I’m ready to go to sleep but my sister wants to keep reading.`
  principalMethod(dataJson, sectionReady)
})

//Initial Writing Section and Jquery on
$('#initWriting').on('click', function () {
  rebootStorage()
  times("init")
  const dataJson = "../data/writing.json"
  const sectionReady = new Section("writing")
  loadHistory.innerHTML = ""
  principalMethod(dataJson, sectionReady)
})

function principalMethod(dataJson, sectionReady){
  readData(dataJson)//We invocated a fetch method for a specific url with json format
    .then(res => res.json()) //promise to json format
    .then(data => { 
      sectionReady.insertQuiz(data)//We create the Quiz with Section method
      buildSection(sectionReady.quiz) //Build section and create html skeleton
      bSubmit.setAttribute("class", "btn btn-primary btn-sm")
      heightStyle("#submitQuiz", 'show' )//Basic button style
      bSubmit.onclick = () =>{
        showReplies(sectionReady) //show the answers
        times("finish") //finish time counter 
        heightStyle("#submitQuiz", 'toggle') //Basic button style
        loadResults.innerHTML += `<br/>Time for ${sectionReady.type} Test: ${Math.round((sessionStorage.getItem("finish")-sessionStorage.getItem("init"))/1000)} seconds`
        console.log(`Time for ${sectionReady.type} Test: ${Math.round((sessionStorage.getItem("finish")-sessionStorage.getItem("init"))/1000)} seconds`)
      }
  })
}

function buildSection(questions){
  // HTML output
  const skeleton = []
  questions.forEach(
    (currentQuestion, questionNum) => {
      const answers = []
      for(number in currentQuestion.answers){
        answers.push(
          `<label>
            <input type="radio" name="question${questionNum}" value="${number}">
            ${number} :
            ${currentQuestion.answers[number]}
          </label>`
        )
      }
      // add question with answers
      skeleton.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join('')} </div>
        <div class="explanations" id="explanation${questionNum}"> </div>`
      )
    }
  )
  sectionQuiz.innerHTML = skeleton.join('')
}

function showReplies(section){
  //get the div of answers
  const answerCont = sectionQuiz.querySelectorAll('.answers')
  let points = 0 //correct answers of user
  section.quiz.forEach(
    (currentQuestion, questionNum) => {
      //get the selected answer
      const selectedCheck = `input[name=question${questionNum}]:checked`
      const userReply = (answerCont[questionNum].querySelector(selectedCheck) || {}).value //checked with type='radio'
      let explanation = document.querySelector(`#explanation${questionNum}`)
      if (userReply === currentQuestion.correctanswer){
        points += 1
        explanation.innerHTML = `¡Correct!`
        explanation.classList.add("text-success")
      }
      else{
        explanation.innerHTML = `${currentQuestion.explanation}`
        explanation.classList.add("text-danger")
      }
    }
  )
  section.pointsQuiz(points)
  let prom = Math.round((section.points/section.quiz.length)*100) //Average 
  if (prom >= section.approved){
    loadResults.innerHTML += `<br/>Congratulations! You get ${prom}% of the correct answers`
    console.log(`Congratulations! You get ${prom}% of the correct answers`)
  }
  else{
    loadResults.innerHTML += `<br/>Sorry! You only get ${prom}% of the correct answers`
    console.log(`Sorry! You only get ${prom}% of the correct answers`)
  }
}

function times(value){ //Set Time for evaluation
  let time = new Date().getTime() //Time real
  sessionStorage.setItem(value, time)
}

function rebootStorage(){
  //For this time we clear all storage, however we need clear only session storage
  localStorage.clear()
  sessionStorage.clear()
}

function readData(url){ //method for api fetch
  return fetch(url)
}

//basic button style animated jquery
function heightStyle(tag,style){
  $(tag).animate({
    height: style
  });
}
