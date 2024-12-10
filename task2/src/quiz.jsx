import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import AxiosClient2 from "./AxiosClient2.js";

function Quiz(){
    //variable creation
    const client = AxiosClient2();
    const location = useLocation();    
    const navigate = useNavigate();


    const [question, setQuestion] = useState({
        "id": 0,
        "name": "Q0",
        "legend": "",
        "numOptions": 0,
        "option1": "",
        "answer": ""
    });

    const [questions, setQuestions] = useState([])
    const [options, setOptions] = useState([]);
    const [id, setId] = useState(1);
    const [answers, setAnswers] = useState([]);
    const isFirstQuestion = id === 1;
    const isLastQuestion = id === questions.length;

    //load initial data
    useEffect(() => {
        //if state exists set data
        try{
            console.log(location.state.id)
            setId(location.state.id)

            //if we have an id we will be editing existing
            try {
                setAnswers(location.state.answers)
            }catch{
                console.log("no answers using empty array");
            }
        }catch(error){
            console.log("error getting state: " + error)
        }
        //load question list
        client
            .get("/questions")
            .then((response) => {
                setQuestions(response.data);
                console.log(response.data);
                setQuestion(response.data[location.state.id-1]);
                setOptions(shuffleArray(Array.from({ length: response.data[location.state.id-1].numOptions }, (_, i) => i + 1)));
            })
            .catch((error)=>{
                console.log("error while getting questions: " + error)
            });
    }, []);

    //load answer after having loaded questions
    useEffect(() => {
        if (questions.length) {
            setAnswers(new Array(questions.length).fill(null)); // Initialize answers to match questions length
        }
    }, [questions]);

    //move to next question
    function nextQuestion(){
        setQuestion(questions[id]);
        setOptions(shuffleArray(Array.from({ length: questions[id].numOptions }, (_, i) => i + 1)));
        setId(id+1);
        
    }

    //move to previous questin
    function prevQuestion(){
        setQuestion(questions[id-2]);
        setOptions(shuffleArray(Array.from({ length: questions[id-2].numOptions }, (_, i) => i + 1)));

        setId(id-1);
    }

    //set selected option to input value
    function handleOptionChange(event) {
        const selectedOption = event.target.value;

        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[id - 1] = selectedOption; // Update answer for the current question
            return updatedAnswers;
        });
    }

    //move to results page if we have answered all questions
    function Finish() {
        if(validate(answers)){
            navigate("/done", { state: { answers: answers } });
        }

    }

    //pretty self explamitory
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      }

    //make sure we have answered all questions
    function validate(_answers){
        let valid = true;
        let runs = 1;
        for(const answer in answers){
            if(answers[runs-1]){
                runs ++;
                continue;
            }
            document.getElementById("warning").innerHTML = "Please answer all questions";
            valid = false;
        }
        return valid;
    }
    


    //make sure we have loaded everything we need
    if(!answers){
        return(
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>
        <div id = "all-quiz">

        <div id = "quiz" className = "quiz_center">
            <span id = "INFO">
                <span>Question: <span id = "questionNumber">{id}</span>  
                </span>
            </span>
            {/* quiz form / questions */}
            <form name="quiz_form" id="quiz_form" method="get">          
            {question ? (
                <fieldset>
                    <legend>{question.legend}</legend>
                    {options.map((num) => {
                        const optionText = question[`option${num}`];
                        return (
                            <div key={optionText}>
                                <input
                                    type="radio"
                                    id={optionText}
                                    name={question.name}
                                    value={optionText}
                                    checked={answers[questions.findIndex(q => q.id === question.id)] === optionText || false} // Ensure a fallback
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor={optionText}>{optionText}</label>
                            </div>
                        );
                    })}
                </fieldset>
                ) : (
                <div>No question to display</div>
                )}
            </form>
            {/* buttons */}
            <div id = "warning"></div>
            <div className="button-container">
                {!isFirstQuestion && <button onClick = {prevQuestion} id = "prev">Previous</button>}
                {!isLastQuestion &&<button onClick = {nextQuestion} id = "next">Next</button>}
                {isLastQuestion && <button onClick = {Finish} id = "Finish">Finish</button>}

            </div>


        </div>

        </div>
        </>
    )
}
export default Quiz;