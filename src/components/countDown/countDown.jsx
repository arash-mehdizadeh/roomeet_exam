import { useState ,useEffect } from 'react';

import CountdownTimer from "react-component-countdown-timer";
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import classes from '../../App.module.scss';
import { finishExam } from '../../assets/api/userActions';


const   CountDown = (props) => {
    
    const navigate = useNavigate();
    const params = useParams();

    const [timeLeft, setTimeLeft] = useState(props.timeRemained);
    const [totalTime, setTotalTime] = useState(props.totalTime);
    const [percentage, setPercentage] = useState(75)

    useEffect(() => {
        // exit early when we reach 0
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
            // console.log(timeLeft);
        }, 1000);
        setPercentage(Math.floor((timeLeft / totalTime) * 75))
        // console.log("time left",timeLeft); 
        // console.log( "percent" , Math.floor((timeLeft/totalTime)*75))

        return () => clearInterval(intervalId);
    }, [timeLeft]);
    
    const onFinishHandler = async (e) => {
        let res = await finishExam(e);
        console.log(res);
        if (res.status === "success-finish" || res.status==="not-found") {  
            navigate("/quiz/finish")
        }
        else{
            Swal.fire({
                icon:"error",
                title: `${res?.message}`,
            })
            // alert(res?.message)
        }
    }

    return (
        <div className={classes.countdownContainer}>
            <svg id={classes.circle_container} viewBox="2 -2 28 36" xmlns="http://www.w3.org/2000/svg">
                <linearGradient id={"gradient"}>
                    <stop id={classes.stop1} offset="0%" />
                    <stop id={classes.stop2} offset="100%" />
                </linearGradient>
                <circle id={classes.circle_container__background} r="16" cx="16" cy="16" shapeRendering="geometricPrecision"></circle>
                <circle id={classes.circle_container__progress} strokeDasharray={`${percentage} 100`} r="16" cx="16" cy="16" shapeRendering="geometricPrecision">
                </circle>
            </svg>
            <div className={classes.timeRemained} style={{zIndex:"1"}}>
                <div id={classes.time}>
                    <CountdownTimer count={timeLeft} hideDay={true} backgroundColor={"transparent"} size={12} onEnd={() => { onFinishHandler() }} />  {/* examData?.duration */}
                </div>
                <div>مانده</div>
            </div>
        </div>
    )
}

export default CountDown