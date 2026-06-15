const questions = require('./questionsOne.json')
const { Random } = require('random-js')
const { buttonsList } = require('./consts')



const getRandomQuestion = (topic) => {

    const random = new Random();

    let questionTopic = topic.toLowerCase();
    // const randoQuestionIndex = Math.floor(
    //     Math.random() * questions[questionTopic].length
    // );

    // if (questionTopic === 'випадкове питання') {
    if (questionTopic === 'anyquestion') {
        // questionTopic = buttonsList[random.integer(
        questionTopic = Object.keys(questions)[random.integer(
            0,
            Object.keys(questions).length - 1
        )]
    }

    const randoQuestionIndex = random.integer(
        0,
        questions[questionTopic].length - 1
    )

    // return questions[questionTopic][randoQuestionIndex];
    return {
        question: questions[questionTopic][randoQuestionIndex],
        questionTopic: questionTopic,
    }
}

//const answer = getCorrectAnswer(callbackData.type, callbackData.questionId);
// const getCorrectAnswer = (topicKey, id) => {
const getCorrectAnswer = (topic, id) => {
    const question = questions[topic].find((question) => question.id === Number(id))

    if (!question.hasOptions) {
        return question.answer
    }
    return question.options.find((option) => option.isCorrect).text() ?? null;
}

const getCorrectAnswerTwo = (topicKey, questionId, optionId) => {
    const topic = questions[topicKey]
    if (!topic) return null

    const question = topic.find(q => q.id === Number(questionId))
    if (!question) return null

    return question.options.find(o => o.isCorrect)
}

const getCorrectAnswerThry = (topicKey, questionId) => {
    const topic = questions[topicKey]
    if (!topic) return null

    const question = topic.find(q => q.id === Number(questionId))
    if (!question) return null

    if (question.answer) {
        return question.answer
    }

}

const getCurrentAnswer = (topicKey, questionId, optionId) => {
    const topic = questions[topicKey]
    if (!topic) return null

    const question = topic.find(q => q.id === Number(questionId))
    if (!question) return null

    if (optionId) {
        return question.options.find(o => o.id === Number(optionId))
    }

}

const getCurrentQuestion = (topicKey, questionId, optionId) => {
    const topic = questions[topicKey]
    if (!topic) return null

    const question = topic.find(q => q.id === Number(questionId))
    if (!question) return null

    if (optionId) {
        return question.options.find(o => o.id === Number(optionId))
    }

    if (question.text) {
        return question.text
    }

}


module.exports = { getRandomQuestion, getCorrectAnswer, getCorrectAnswerTwo, getCurrentAnswer, getCorrectAnswerThry, getCurrentQuestion }

