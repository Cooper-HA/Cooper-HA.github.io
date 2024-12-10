import React, { useState, useEffect } from "react";
import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosClient2 from "./AxiosClient2.js";

function Create() {

  //variable creation
  const navigate = useNavigate();
  const client = AxiosClient2();
  const location = useLocation(); 


  const [answers, setAnswers] = useState([]);
  const[questions, setQuestions] = useState([]);
  const [numOptions, setNumOptions] = useState(1);
  const [options, setOptions] = useState([""]); // Start with one option
  const [correctValue, setCorrectValue] = useState("");
  const [prompt, setPrompt] = useState("");
  const [id, setId] = useState(null);
  const [rendered, setRendered] = useState(false);


  //load initail data
  useEffect(() => {

    try {
        setAnswers(Object.values(location.state.answers))
        console.log(Object.values(location.state.answers))
        if(location.state.id){
          setId(location.state.id);
        }
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


  //handle user inputs
  function handleNumOptionsChange(event) {
    const value = parseInt(event.target.value, 10) || 1; // Ensure the value is a number
    setNumOptions(value);

    // Adjust the options array dynamically
    if (value > options.length) {
      setOptions([...options, ...Array(value - options.length).fill("")]);
    } else {
      setOptions(options.slice(0, value));
    }
  }

  function handleOptionChange(index, event) {
    const updatedOptions = [...options];
    updatedOptions[index] = event.target.value;
    setOptions(updatedOptions);
  }

  function handleCorrectValueChange(event) {
    setCorrectValue(event.target.value);
  }

  function handlePromptChange(event){
    setPrompt(event.target.value);
  }



  //make sure we have an answerable question
  function validate(){
    let valid = false;

    for(const option in options){
      if(correctValue == options[option]){
        valid = true;
        break;
      }
    }

    return valid;
  }

  //add question then redirect
  function handleFinish() {

    //make sure we have an answerable question
    if(!validate()){
      document.getElementById("warning").innerHTML = "please make sure your correct value is one of the avaliable options"
      return;
    }

    //question object
    const newQuestion = {

        name: `Q${questions.length+1}`,
        legend: prompt,
        numOptions: numOptions,
        ...options.reduce((acc, option, idx) => {
          acc[`option${idx + 1}`] = option; // Dynamically add option fields
          return acc;
        }, {}),
        answer: correctValue,
      };
    
    //if we have an existing id change else create new
    if(id){
      client
          .put("/questions/"+id, JSON.stringify(newQuestion))
          .then((response) => {
            console.log("Question added successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error adding question:", error);
          });
    }else{
      client
        .post("/questions", JSON.stringify(newQuestion))
        .then((response) => {
          console.log("Question added successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error adding question:", error);
        });
    }

    //return
    navigate("/done", { state: { answers: answers } });
  }

  //return to results screen
  function handleCancel() {
    navigate("/done", { state: { answers: answers } });
  }

  //for edit mode populate with existing data
  function populate(id){
    //set question properties
    let question = null; 
    for(const q in questions){
      
      if (questions[q].id==id){
        question = questions[q];
        console.log(questions[q].id + ": :" + id);
        break;
      }
    }
    
    

    //make sure question exists then populate if it does
    if (question) {
      setPrompt(question.legend);
  
      setNumOptions(question.numOptions);
  
      
      const extractedOptions = Array.from(
        { length: question.numOptions },
        (_, i) => question[`option${i + 1}`]
      );
  
      setOptions(extractedOptions); 
      setCorrectValue(question.answer); 
      setRendered(true);
    } else {
      console.error(`Question with ID ${id} not found`);
    }
    
    
  }

  //remove existing question
  function handleDelete(){
    client
    .delete(`/questions/${id}`)
    .then(() => {
      navigate("/done", { state: { answers: answers } });
    })
    .catch((error) => {
      console.error("Error deleting question:", error);
      alert("Failed to delete the question. Please try again.");
    });
  }

  //display
  return (
    <div id="all-quiz">
      <div id="instructions">
        <h2>Question Creation</h2>

        {/* prompt */}
        {questions != [] && !rendered &&id&& populate(id, rendered)}
        <label htmlFor="prompt">Prompt:</label>
        <textarea 
            rows = "5"
            cols = "40" 
            id = "prompt" 
            value = {prompt}
            onChange={handlePromptChange}
            className="fillable">
        </textarea>

        {/* numOptions */}
        <div></div>
        <label htmlFor="numOptions">Number of Options:</label>
        <input
          type="number"
          id="numOptions"
          min="1"
          max="100"
          step="1"
          value={numOptions}
          onChange={handleNumOptionsChange}
          className="fillable"
        />

        {/* options */}
        <ul id="options">
          {options.map((option, index) => (
            <li key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
                placeholder={`Option ${index + 1}`}
                className="fillable"
              />
            </li>
          ))}
        </ul>

        <div>
          <p></p>
        </div>

        <label htmlFor="CV">Correct Value:</label>
        <input
          type="text"
          id="CV"
          value={correctValue}
          onChange={handleCorrectValueChange}
          className="fillable"
        />
        <div id = "warning"></div>

        {/* buttons */}
        <div className="button-container">
          <button onClick={handleFinish}>Finish</button>
          {id && <button onClick={handleDelete}>Delete</button>}
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Create;
