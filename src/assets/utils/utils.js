const getFileName = (path) => {
    if (path) {
        const lastIndex = path.path.split("/").pop();
        const fileName = lastIndex.split("_").pop();
        return fileName;
    }

}
const getFileNameFromAttempt = (path) => {
    if (path) {
        const lastIndex = path.file_url.split("/").pop();
        const fileName = lastIndex.split("_").pop();
        return fileName;
    }
}

const checkMatchQuestion = (dataQue, dataAtt) => {
    let matches = [];
    // console.log(dataQue ,dataAtt);
    for (var i = 0; i < dataQue.questions.length; i++) {
        for (var j = 0; j < dataAtt.answers.length; j++) {
            if (dataQue.questions[i].id === dataAtt.answers[j].question_id) {
                matches.push({
                    id: dataQue.questions[i].id,
                    option_number: dataAtt.answers[j].option_id,
                })
                // console.log(dataQue.questions[i].id);
                // console.log(dataAtt.answers[j].question_id);
                // matches.push(dataQue.questions[i].id);
            }
        }
    }
    return matches;
}

const checkMatchQuestionURL = (dataQue, dataAtt) => {
    let matches = [];
    // console.log(dataQue ,dataAtt);
    for (var i = 0; i < dataQue.questions.length; i++) {
        for (var j = 0; j < dataAtt.answers.length; j++) {
            if (dataQue.questions[i].id === dataAtt.answers[j].question_id) {
                matches.push({
                    id: dataQue.questions[i].id,
                    file_url: dataAtt.answers[j].file_url,
                    answer: dataAtt.answers[j].answer
                })
                // console.log(dataQue.questions[i].id);
                // console.log(dataAtt.answers[j].question_id);
                // matches.push(dataQue.questions[i].id);
            }
        }
    }
    return matches;
}

export {
    getFileName,
    getFileNameFromAttempt,
    checkMatchQuestion,
    checkMatchQuestionURL,
};