import React, { Component } from 'react'
import {Table, Column} from 'react-virtualized'
import {connect} from 'react-redux'
import {
    fetchAllEvents,
    selectEvent,
    selectedEventsSelector,
    eventListSelector,
    loadedSelector,
    loadingSelector
} from '../../ducks/events'
import Loader from '../common/Loader'
import 'react-virtualized/styles.css'

class EventTableVirtualized extends Component {
    static propTypes = {

    };
    componentDidMount() {
        this.props.fetchAllEvents()
        console.log('---', 'load events')
    }

    render() {
        if (this.props.loading) return <Loader />
        return (
            <Table
                height={500}
                width = {700}
                rowHeight={40}
                rowHeaderHeight={40}
                rowGetter={this.rowGetter}
                rowCount={this.props.events.length}
                overscanRowCount={0}
                onRowClick={({ rowData }) => this.props.selectEvent(rowData.uid)}
            >
                <Column
                    dataKey = 'title'
                    width={300}
                    label = 'title'
                />
                <Column
                    dataKey = 'where'
                    width={200}
                    label = 'where'
                />
                <Column
                    dataKey = 'when'
                    width={200}
                    label = 'when'
                />
            </Table>
        )
    }

    rowGetter = ({ index }) => {
        return this.props.events[index];}
}

export default connect((state, props) => ({
    events: eventListSelector(state, props),
    loading: loadingSelector(state),
    loaded: loadedSelector(state),
    selected: selectedEventsSelector(state)
}), { fetchAllEvents, selectEvent })(EventTableVirtualized)