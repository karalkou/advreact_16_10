import React, { Component } from 'react'
import {Table, Column, InfiniteLoader} from 'react-virtualized'
import {connect} from 'react-redux'
import {
    fetchAllEvents,
    loadNextPage,
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
        this.props.loadNextPage()
        console.log('---', 'load events')
    }

    render() {
        const { events } = this.props;

        if (this.props.loading) return <Loader />
        return (
            <InfiniteLoader
                isRowLoaded = {this.isRowLoaded} /* чекает, нужно ли ещё грузить */
                loadMoreRows = {this.loadMoreRows}
                rowCount = { this.props.loaded ? events.length : events.length + 1 }/* чтобы можно было прокрутить */
            >
                { ({onRowsRendered, registerChild}) => (
                    <Table
                        ref={registerChild}
                        onRowsRendered={onRowsRendered}
                        rowGetter={this.rowGetter}
                        height={500}
                        width = {700}
                        rowHeight={40}
                        rowHeaderHeight={40}
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
                ) }

            </InfiniteLoader>
        )
    }

    isRowLoaded = ({ index }) => {
        return index < this.props.events.length
    }

    loadMoreRows = () => {
        this.props.loadNextPage()
    }

    rowGetter = ({ index }) => {
        return this.props.events[index];}
}

export default connect((state, props) => ({
    events: eventListSelector(state, props),
    loading: loadingSelector(state),
    loaded: loadedSelector(state),
    selected: selectedEventsSelector(state)
}), { fetchAllEvents, selectEvent, loadNextPage })(EventTableVirtualized)