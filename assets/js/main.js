class Section{
  constructor(description, type){
    this.description = description;
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

const sectionQuiz = document.querySelector("#readingQuiz")
const initAll = document.querySelector("#initialButton")
const bSubmit = document.querySelector("#submitReading")
const readingJson = "../data/reading.json"
//const writingJson = "../data/writing.json"

//Initial Method and Jquery on
$('#initialButton').on('click', function () {
  rebootStorage()
  times("init")
  //First section will be "Reading" and will have X questions
  const sectionReading = new Section("Here you can find activities to practise your READING skills", "reading")

  readData(readingJson)//We invocated a fetch method for a specific url with json format
    .then(res => res.json()) //promise to json format
    .then(data => { 
      sectionReading.insertQuiz(data)//We create the Quiz with Section method
      buildSection(sectionReading.quiz) //Build section and create html skeleton
      bSubmit.setAttribute("class", "btn btn-primary btn-sm")
      heightStyle("#submitReading", 'show')//Basic button style
      bSubmit.onclick = () =>{
        showReplies(sectionReading) //show the answers
        times("finish") //finish time counter 
        heightStyle("#submitReading", 'toggle') //Basic button style
        //Maybe show the time in a div
        console.log(`Time for reading Test: ${Math.round((sessionStorage.getItem("finish")-sessionStorage.getItem("init"))/1000)} seconds`)
        initAll.innerHTML = `Volver a intentarlo`
      }
  })
})

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
    console.log(`Congratulations! You get ${prom}% of the correct answers`)
  }
  else{
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
