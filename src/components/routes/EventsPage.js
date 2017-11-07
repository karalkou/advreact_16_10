import React, { Component } from 'react'
import EventsTable from '../events/EventTableVirtualizedInfiniteLoading'

class EventsPage extends Component {
    static propTypes = {

    };

    render() {
        return (
            <div>
                <EventsTable />
            </div>
        )
    }
}

export default EventsPage