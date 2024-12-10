import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import AxiosClient2 from "./AxiosClient2.js";


function Finish(){

    //variable creation
    const navigate = useNavigate();
    const location = useLocation(); 
    const client = AxiosClient2();
   
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([])

    //inital data load
    useEffect(() => {
        try {
            setAnswers(Object.values(location.state.answers))
            console.log(Object.values(location.state.answers))
        }catch{
            console.log("no answers using empty array");
        }
        client
            .get("/questions")
            .then((response) => {
                setQuestions(response.data);
                console.log(response.data);
            })
            .catch((error)=>{
                console.log("error while getting questions: " + error)
            });
    }, []);

    //navigation functions
    function returnToWelcome(){
        navigate('/');
    }
    function continueToCreate(){
        navigate("/create", { state: { answers: answers } });
    }
    function continueToEdit(){
        navigate("/edit", { state: { answers: answers} });
    }

    //calculate percent score on quiz
    function percentCalc(){
        let correctAnswers = 0;
        for(let i = 0 ; i < questions.length; i++){
            if(questions[i].answer == answers[i]){
                correctAnswers ++;
            }
        }
        let percentage = parseFloat((correctAnswers/(questions.length)*100).toFixed(2)).toString();
        return percentage;
    }

    //display data
    return (
        <>
        <div id="all-quiz">
            <div id="instructions">
                <div>
                <p>You Finished with {percentCalc()}% score</p>

                {/* answer list */}
                {answers.length > 0 ? (
                    answers.map((answer, index) => (
                        
                        <div key={index} className={questions[index]?.answer == answer? ("correct"):("incorrect")}>
                            {questions[index]?(questions[index].legend):(index)}: {answer}
                        </div>
                    ))
                ) : (
                    <p>No answers to display</p> // Handle case where no answers exist
                )}
                </div>
                {/* buttons */}
                <div className="button-container">
                    <button onClick={returnToWelcome} id="continue" >
                        Retake
                    </button>
                    <button onClick={continueToEdit}>
                        Edit
                    </button>
                    <button onClick={continueToCreate}>
                        Create
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}
export default Finish;