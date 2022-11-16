import axios from "axios";

const appVersion = "v1";

const userAction = axios.create({
    baseURL:`https://quiz-api.roomeet.ir/api/${appVersion}`
})

const LS_Token = JSON.parse(localStorage.getItem("userToken"));

let axiosConfig = {
    headers: {
        // 'Content-Type': 'application/json;charset=UTF-8',
        'Authorization':"Bearer " + LS_Token?.token ,
        'Accept': '*/*',
        //     'Access-Control-Allow-Credentials': 'true',
        //     'mode': 'cors',
    }
};

const userLogin = async (data) => {
    try {
        let response =  await userAction.post(`/login`,data)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const examDatails = async (examID) => {
    try {
        let response =  await userAction.get(`/site/quiz/join/${examID}`)
        return(response.data.quiz)
    } catch (error) {
        console.log(error.message);
    }
}

const attemptToJoinExam = async (examID) => {
    try {
        let response =  await userAction.get(`/site/quiz/attempt/join/${examID}`,axiosConfig)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}
const finishExam = async (examID) => {
    try {
        let response =  await userAction.get(`/site/quiz/finish/${examID}`,axiosConfig)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}

export { userLogin ,examDatails ,attemptToJoinExam ,finishExam };