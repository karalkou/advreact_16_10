import firebase from 'firebase'
import {
    signUpSaga, signInSaga, watchStatusChangeSaga,
    signUp, signIn,
    SIGN_UP_START, SIGN_UP_SUCCESS, SIGN_UP_ERROR,
    SIGN_IN_START, SIGN_IN_SUCCESS, SIGN_IN_ERROR
} from './auth'
import {all, take, call, put} from 'redux-saga/effects'
import {replace} from 'react-router-redux'


it('should sign up user', () => {
    const auth = firebase.auth()
    const gen = signUpSaga()

    expect(gen.next().value).toEqual(take(SIGN_UP_START))

    const authData = {
        email: '123@123.ru',
        password: 'qwerty1234'
    }

    const requestAction = {
        type: SIGN_UP_START,
        payload: authData
    }

    expect(gen.next(requestAction).value).toEqual(call(
        [auth, auth.createUserWithEmailAndPassword],
        authData.email, authData.password
    ))

    const user = {
        email: authData.email,
        uid: Date.now().toString()
    }

    expect(gen.next(user).value).toEqual(put({
        type: SIGN_UP_SUCCESS,
        payload: {user}
    }))

    const error = new Error

    expect(gen.throw(error).value).toEqual(put({
        type: SIGN_UP_ERROR,
        payload: {error}
    }))

})

it('should sign in user', () => {
    const auth = firebase.auth()
    const gen = signInSaga()

    expect(gen.next().value).toEqual(take(SIGN_IN_START))

    const authData = {
        email: '123@123.ru',
        password: 'qwerty1234'
    }

    const requestAction = {
        type: SIGN_IN_START,
        payload: authData
    }

    expect(gen.next(requestAction).value).toEqual(call(
        [auth, auth.signInWithEmailAndPassword],
        authData.email, authData.password
    ))

    const error = new Error

    expect(gen.throw(error).value).toEqual(put({
        type: SIGN_IN_ERROR,
        payload: {error}
    }))

})

it('should redirect to /admin on SIGN_IN_SUCCESS', () => {

    const gen = watchStatusChangeSaga()

    expect(gen.next().value).toEqual(take(SIGN_IN_SUCCESS))

    const requestAction = {
        type: SIGN_IN_SUCCESS
    }

    expect(gen.next(requestAction).value).toEqual(put(replace('/admin')))
})
