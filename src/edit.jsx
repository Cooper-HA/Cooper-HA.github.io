import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import AxiosClient2 from "./AxiosClient2.js";

function Edit(){

    //variable creation
    const navigate = useNavigate();
    const client = AxiosClient2();
    const location = useLocation(); 
  
  
    const [answers, setAnswers] = useState([]);
    const[questions, setQuestions] = useState([]);


    //load initial data
    useEffect(() => {

        try {
            setAnswers(Object.values(location.state.answers))
            setId(location.state.id);
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

    //go to selected question
    function goToQuestion(id){
        navigate("/create", {state:{answers:answers, id:id}})
    }
    //return to results
    function goBack(){
        navigate("/done", {state:{answers:answers}})
    }

    //change pointer
    function showClickable(e) {
        e.target.style.cursor = "pointer";
      }

    //display lsit of questions and back button
    return(
    <>    
    <div className="content-container">

        <h2 className="title">Questions</h2>
            <ul>
                {questions.map((question, index) => (
                    <li key={question.id} onClick={() => goToQuestion(question.id)}>
                        <div className="card" onMouseOver={(e) => showClickable(e)}>
                            <div className="card-content">
                                <div className="content">
                                    <div key="question.legend" className="name">
                                    { question.legend }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={goBack}>
            Back
                        </button>
    </div>
    </>
    )
}

export default Edit;