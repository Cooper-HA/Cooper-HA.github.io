import "./App.css";
import AxiosClient2 from "./AxiosClient2.js";
import { useNavigate } from "react-router-dom";


function Welcome(){
    const navigate = useNavigate();
    function continueToQuiz(){
        navigate('/quiz', {state:{ id: 1}})
    }
    return (
        <>
        <div id = "all">
        <div id = "instructions"> <p>This is a quiz that will test your general knowledge of random stuff. Press Continue To Begin</p> 
            <button onClick={continueToQuiz} id = "continue" className ="centeredlr">Continue</button>
            </div>
        </div>
        </>
    )
}
export default Welcome;