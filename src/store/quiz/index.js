import db from '@/db'
import firebase from '@/firebase'

import {
  UPDATE_INFORMAITON,
  ADD_QUESTION,
  UPDATE_QUESTION,
  REMOVE_QUESTION,
  ADD_ANSWER,
  UPDATE_ANSWER,
  REMOVE_ANSWER,
  RESET_QUIZ,
  RESET_QUIZ_LIST,
  PUSH_QUIZ
} from './mutations'

const state = {
  newQuiz: {
    title: 'Quiz 2018',
    description: 'Quiz description goes here.',
    questions: [
      {
        question: 'Default Question',
        points: 10,
        answers: [
          {
            answer: 'First answer',
            isRight: false
          }
        ]
      }
    ]
  },
  list: []
}

const getters = {
  newQuiz: ({newQuiz}) => newQuiz,
  list: ({list}) => list
}

const mutations = {
  [UPDATE_INFORMAITON](state, info) {
    state.newQuiz.title = info.title
    state.newQuiz.description = info.description
  },

  [ADD_QUESTION](state) {
    state.newQuiz
      .questions
      .push({
        question: "Question",
        points: 0,
        answers: []
      })
  },

  [UPDATE_QUESTION](state, payload) {
    const question = state.newQuiz
      .questions[payload.questionIndex]

    question.question = payload.question
    question.points = payload.points
  },

  [REMOVE_QUESTION](state, questionIndex) {
    if (state.newQuiz.questions.length > 1) {
      state.newQuiz
        .questions
        .splice(questionIndex, 1)
    }
  },

  [ADD_ANSWER](state, questionIndex) {
    const answers = state.newQuiz.questions[questionIndex].answers
    if (answers.length < 5) {
      answers.push({
        answer: "Anotha one!",
        isRight: false
      })
    }
  },

  [REMOVE_ANSWER](state, payload) {
    const questionIndex = payload.questionIndex
    const answerIndex = payload.answerIndex

    const question = state.newQuiz.questions[questionIndex]

    if (question.answers.length > 1) {
      question.answers.splice(answerIndex, 1)
    }
  },

  [UPDATE_ANSWER](state, payload){
    const questionIndex = payload.questionIndex
    const answerIndex = payload.answerIndex
    const answerText = payload.answer
    const isRight = payload.isRight

    const answer = state.newQuiz
      .questions[questionIndex]
      .answers[answerIndex]

    answer.isRight = isRight
    answer.answer = answerText
  },

  [RESET_QUIZ](state) {
    this.newQuiz = {
      title: "",
      description: "",
      questions: []
    }
  },

  [PUSH_QUIZ](state, quiz) {
    state.list.push(quiz)
  },

  [RESET_QUIZ_LIST](state) {
    state.list = []
  }
}

const actions = {
  async create({state}) {
    const user = firebase.auth().currentUser
    if (user) {

      // check if there is a question without a right answer
      state.newQuiz.questions.map(question => {
        let hasRightAnswer = false

        question.answers.map(answer => {
          if (answer.isRight) hasRightAnswer = true
        })

        if (!hasRightAnswer) {
          alert(`Question: '${question.question}' doesn't have a right answer!`)
          throw new Error()
        }
      })

      // save to database
      await db.collection('quizes').add({
        ...state.newQuiz,
        userId: user.uid
      })

      alert('Quiz created')

    } else {
      alert('Unauthorized')
    }
  },

  list({commit}) {
    // Reset the quiz list so we don't get duplicate quizes whe returning to home page.
    commit(RESET_QUIZ_LIST)
    // Realtime updates from firestore with onSnapshot.
    db.collection('quizes').onSnapshot(snapshot => {
      snapshot.docChanges.forEach(function(change) {
        if (change.type === "added") {
          commit(PUSH_QUIZ, {
            id: change.doc.id,
            ...change.doc.data()
          })
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
