import {all, take, takeEvery, put, call, select} from 'redux-saga/effects'
import {appName} from '../config'
import {Record, OrderedMap, OrderedSet} from 'immutable'
import firebase from 'firebase'
import {createSelector} from 'reselect'
import {fbToEntities} from './utils'

/**
 * Constants
 * */
export const moduleName = 'events'
const prefix = `${appName}/${moduleName}`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_START = `${prefix}/FETCH_ALL_START`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`

export const LOAD_NEXT_PAGE_REQUEST = `${prefix}/LOAD_NEXT_PAGE_REQUEST`
export const LOAD_NEXT_PAGE_START = `${prefix}/LOAD_NEXT_PAGE_START`
export const LOAD_NEXT_PAGE_SUCCESS = `${prefix}/LOAD_NEXT_PAGE_SUCCESS`

export const SELECT_EVENT = `${prefix}/SELECT_EVENT`


/**
 * Reducer
 * */
export const ReducerRecord = Record({
    loading: false,
    loaded: false,
    entities: new OrderedMap({}),
    selected: new OrderedSet([])
})

export const EventRecord = Record({
    uid: null,
    month: null,
    submissionDeadline: null,
    title: null,
    url: null,
    when: null,
    where: null
})

export default function reducer(state = new ReducerRecord(), action) {
    const {type, payload} = action

    switch (type) {
        case FETCH_ALL_START:
            return state.set('loading', true)

        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .set('entities', fbToEntities(payload, EventRecord))

        case LOAD_NEXT_PAGE_SUCCESS:
            return state
                .set('loading', false)
                .mergeIn(['entities'], fbToEntities(payload, EventRecord))
                .set('loaded', Object.keys(payload).length < 10)

        case SELECT_EVENT:
            return state.update('selected', selected => selected.add(payload.uid))

        default:
            return state
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[moduleName]
export const entitiesSelector = createSelector(stateSelector, state => state.entities)
export const loadingSelector = createSelector(stateSelector, state => state.loading)
export const loadedSelector = createSelector(stateSelector, state => state.loaded)
export const selectionSelector = createSelector(stateSelector, state => state.selected.toArray())
export const eventListSelector = createSelector(entitiesSelector, entities => entities.valueSeq().toArray())
export const selectedEventsSelector = createSelector(entitiesSelector, selectionSelector, (entities, selection) =>
    selection.map(uid => entities.get(uid))
)

/**
 * Action Creators
 * */

export function fetchAllEvents() {
    return {
        type: FETCH_ALL_REQUEST
    }
}

export function loadNextPage() {
    return {
        type: LOAD_NEXT_PAGE_REQUEST
    }
}

export function selectEvent(uid) {
    return {
        type: SELECT_EVENT,
        payload: { uid }
    }
}

/**
 * Sagas
 * */

export function* fetchAllSaga() {
    const ref = firebase.database().ref('events')

    yield put({
        type: FETCH_ALL_START
    })

    const snapshot = yield call([ref, ref.once], 'value')

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: snapshot.val()
    })
}

export function* fetchNextPageSaga() {
    while (true) {
        yield take(LOAD_NEXT_PAGE_REQUEST)

        const state = yield select(stateSelector)

        if (state.loading || state.loaded) continue

        yield put({
            type: LOAD_NEXT_PAGE_START
        })

        const lastEvent = state.entities.last()

        const ref = firebase.database().ref('events')
            .orderByKey()
            .limitToFirst(10)
            .startAt(lastEvent ? lastEvent.uid : '')

        const data = yield call([ref, ref.once], 'value')

        yield put({
            type: LOAD_NEXT_PAGE_SUCCESS,
            payload: data.val()
        })
    }
}

//lazy fetch FB
/*
firebase.database().ref('events')
    .orderByKey()
    .limitToFirst(10)
    .startAt(lastUid)

*/
export function* saga() {
    yield all([
        takeEvery(FETCH_ALL_REQUEST, fetchAllSaga),
        fetchNextPageSaga()
    ])
}