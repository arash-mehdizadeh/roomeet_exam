import axios from "axios";

const appVersion = "v1";

const userAction = axios.create({
    baseURL: `https://quiz-api.roomeet.ir/api/${appVersion}`
})
const nodeApi = axios.create({
    baseURL: `https://node.roomeet.ir/api/${appVersion}`
})

var LS_Token =  JSON.parse(localStorage.getItem("userToken"));
// let ls = localStorage.getItem("userToken");
// if (ls !== "undefined") {
//     // var LS_Token = JSON.parse(ls);
// }

var previewConfig = (tkn) => {
    return {
        headers: {
            'Authorization': "Bearer " + tkn,
            'Contetnt-Type': "multipart/form-data",
            'Accept': 'application/json',
            'type': "formData",
            //     'Access-Control-Allow-Credentials': 'true',
            //     'mode': 'cors',
        }
    }
}

var axiosUploadConfig = {
    headers: {
        'Authorization': "Bearer " + LS_Token?.token,
        'Contetnt-Type': "multipart/form-data",
        'Accept': 'application/json',
        'type': "formData",
        //     'Access-Control-Allow-Credentials': 'true',
        //     'mode': 'cors',
    }
};


var axiosConfig = {
    headers: {
        // 'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': "Bearer " + LS_Token?.token,
        'Accept': '*/*',
        //     'Access-Control-Allow-Credentials': 'true',
        //     'mode': 'cors',
    }
};

const userLogin = async (data) => {
    try {
        let response = await userAction.post(`/login`, data)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const guestVerification = async(quizCode) => {
    try {
        let response =  await nodeApi.get(`/quiz-on-join?code=${quizCode}`)
        return(response.data)
    } catch (error) {
        return(error.response);
    }
}
const getSchoolName = async(quizCode) => {
    try {
        let response =  await nodeApi.get(`/school-info?code=${quizCode}`)
        return(response.data)
    } catch (error) {
        return(error.response);
    }
}

const confirmMessageRequest = async (phone_num,quizID) => {

    try {
        let response = await nodeApi.post(`/detection-submit-number`, { phone: phone_num,quizCode :quizID })
        return (response.data)
    } catch (error) {
        return(error.response.data);
    }
}
const confirmGuestLoginRequest = async (loginData) => {
    console.log(loginData);
    try {
        let response = await axios.post(`https://node.roomeet.ir/api/v1/detection-submit-code`, loginData)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const examDatails = async (examID) => {
    try {
        let response = await userAction.get(`/site/quiz/join/${examID}`)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const attemptToJoinExam = async (examID) => {
    // console.log(axiosConfig)
    try {
        let response = await userAction.get(`/site/quiz/attempt/join/${examID}`, axiosConfig)
        return (response.data)
    } catch (error) {
        console.log(error.response.data);
    }
}
const finishExam = async (attemptID) => {
    try {
        let response = await userAction.get(`/site/quiz/finish/${attemptID}`, axiosUploadConfig)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}
const leaveExam = async (attemptID) => {
    try {
        let response = await userAction.get(`/site/quiz/leave/${attemptID}`, axiosUploadConfig)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const postFormData = async (formData) => {
    try {
        let response = await userAction.post(`/site/quiz/file/upload`, formData, axiosUploadConfig)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const storeFileURL = async (fileData) => {
    console.log(fileData);
    try {
        let response = await userAction.post(`/site/quiz/file/store`, fileData, axiosUploadConfig)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const postUserDescriptionAnswer = async (id, attemptID, userAnswer) => {

    let questionAnswerData = {
        question_id: id,//id
        attempt_id: attemptID,
        answer: userAnswer ? userAnswer : null
    };

    try {
        let response = await userAction.post(`/site/quiz/answer`, questionAnswerData, axiosUploadConfig)
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}
const postUserTestAnswer = async (id, attemptID, userAnswer) => {

    let questionAnswerData = {
        question_id: id,//id
        attempt_id: attemptID,
        option_id: userAnswer
    };
    try {
        let response = await userAction.post(`/site/quiz/answer`, questionAnswerData, axiosUploadConfig)
        return (response)
    } catch (error) {
        console.log(error.message);
    }
}

const testAnswerCancel = async (optionID) => {

    try {
        let response = await userAction.delete(`/site/quiz/delete/answer/${optionID}`, axiosConfig)
        return (response)
    } catch (error) {
        console.log(error.message);
    }
}

const previewExam = async (quiz_code,token) => {
    try {
        let response = await userAction.get(`/panel/super-admin/preview/quiz/${quiz_code}`, previewConfig(token))
        return (response.data)
    } catch (error) {
        console.log(error.message);
    }
}



export {
    userLogin, examDatails, confirmMessageRequest, confirmGuestLoginRequest, attemptToJoinExam, finishExam, leaveExam, postFormData,// ,postFilePath
    postUserDescriptionAnswer, storeFileURL, postUserTestAnswer, testAnswerCancel, previewExam ,getSchoolName ,guestVerification
};