import axios from "axios";

const appVersion = "v1";

const userAction = axios.create({
    baseURL:`https://quiz-api.roomeet.ir/api/${appVersion}`
})

const LS_Token = JSON.parse(localStorage.getItem("userToken"));


var axiosUploadConfig = {
    headers: {
        'Authorization':"Bearer " + LS_Token?.token ,
        'Contetnt-Type':"multipart/form-data",
        'Accept': 'application/json',
        'type':"formData",
        //     'Access-Control-Allow-Credentials': 'true',
        //     'mode': 'cors',
    }
};


var axiosConfig = {
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
        return(response.data)
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
const finishExam = async (attemptID) => {
    try {
        let response =  await userAction.get(`/site/quiz/finish/${attemptID}`,axiosUploadConfig)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const postFormData = async ( formData ) => {
    try {
        let response =  await userAction.post(`/site/quiz/file/upload`,formData,axiosUploadConfig)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}

const storeFileURL = async ( fileData ) => {
    console.log(fileData);
    try {
        let response =  await userAction.post(`/site/quiz/file/store`, fileData , axiosUploadConfig)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}
// const postFilePath = async ( path , answerID ) => {
//     let postFilePathData = {
//         path: path,
//         type:"open",
//         driver:"ftp",
//         answer_id : answerID
//     };
    
//     try {
//         let response =  await userAction.post(`/site/quiz/file/store`,postFilePathData,axiosUploadConfig)
//         return(response.data)
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const postUserDescriptionAnswer = async ( id ,attemptID ,userAnswer ) => {
    
    let questionAnswerData = {
        question_id: id,//id
        attempt_id: attemptID,
        answer: userAnswer
    };

    try {
        let response =  await userAction.post(`/site/quiz/answer`,questionAnswerData,axiosUploadConfig)
        return(response.data)
    } catch (error) {
        console.log(error.message);
    }
}
const postUserTestAnswer = async ( id ,attemptID ,userAnswer ) => {
    
    let questionAnswerData = {
        question_id: id,//id
        attempt_id: attemptID,
        option_id: userAnswer
    };

    try {
        let response =  await userAction.post(`/site/quiz/answer`,questionAnswerData,axiosUploadConfig)
        return(response)
    } catch (error) {
        console.log(error.message);
    }
}



export { userLogin ,examDatails ,attemptToJoinExam ,finishExam ,postFormData ,// ,postFilePath
            postUserDescriptionAnswer ,storeFileURL ,postUserTestAnswer
};