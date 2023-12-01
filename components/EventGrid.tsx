import { useEffect, useState } from 'react'
import _ from 'lodash'
import EventModal from './EventModal';
import useCurrentUser from '../hooks/useCurrentUser';

const EventGrid = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});
    const { loggedIn, addr } = useCurrentUser()
    const [refresh, setRefresh] = useState(false);
    const [userEvents, setUserEvents] = useState([]);

    const openModal = (event) => {
        setModalOpen(true);
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent({});
    };

    const getTicket = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"eventId": event.id, "userId": addr})
        };
        fetch(process.env.REDIS_API_URL, requestOptions)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(`HTTP error! Status: ${resp.status}`);
                }
                return resp.json();
            })
            .then (data => {
                if (data.message === "Success") {
                    setRefresh(!refresh);
                }
            })
            .catch(error => {
                console.error('Update error:', error);
                throw new Error(`Update error: ${error}`);
            });
    }
  
    useEffect(() => {
        fetch(process.env.KINTONE_API_GW_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const param = loggedIn ? {"ids": _.map(data, "id"), "loginId": addr} : {"ids": _.map(data, "id")};
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(param)
                };
                fetch(process.env.REDIS_API_URL, requestOptions)
                    .then(resp => {
                        if (!resp.ok) {
                            throw new Error(`HTTP error! Status: ${resp.status}`);
                        }
                        return resp.json();
                    })
                    .then(da => {
                        console.log(da);
                        const combinedData = _.zipWith(data, da.data, function(item, value) {
                            item.remainingTicket = value ? item.numberOfTickets - value : item.numberOfTickets;
                            return item;
                        });
                        setEvents(combinedData);   
                        if (loggedIn && da.events) {
                            setUserEvents(da.events);             
                        }
                        //console.log(combinedData);
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        throw new Error(`Fetch error: ${error}`);
                    });
                
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, [refresh, loggedIn])

    return (
        <div className="event-grid">
        {events.map((event) => (
            <div key={event.id} className="event-card">
                <div className="event-image-container">
                    <img className="event-image" src={event.imageUrl} alt={event.title} />
                </div>
                <h2 onClick={() => openModal(event)} style={{cursor: 'pointer'}}>{event.title}</h2>
                <div className="event-text">
                    <p>
                        <strong>Date / Time:</strong> {event.datetime.substring(0,10)} {event.datetime.substring(11,16)}
                    </p>
                    <p>
                        <strong>Duration:</strong> {event.duration} hours
                    </p>
                    <p>
                        <strong>Venue:</strong> {event.venue.length > 33 ? `${event.venue.substring(0, 33)} ...` : event.venue}
                    </p>
                    <p>
                        <strong>Price:</strong> {event.ticketPrice} Flow
                    </p>
                    <p>
                        <strong>Tickets Left:</strong> {event.remainingTicket} of {event.numberOfTickets}
                    </p>
                </div>
                {!loggedIn && <p style={{color: 'red'}}>Login to get your NFT tickets</p>}
                {loggedIn && event.remainingTicket > 0 && userEvents.indexOf(String(event.id)) === -1 && <button onClick={() => getTicket(event)}>Get Ticket</button>}
                {loggedIn && userEvents.indexOf(String(event.id)) !== -1 && <p style={{color: 'green'}}>Congratz, you have got the NFT ticket</p>}
            </div>
        ))}
        <style jsx>{`
            .event-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }

            .event-card {
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                overflow: hidden;
            }

            .event-text {
                text-align: justify;
            }

            .event-image {
                max-width: 100%;
                object-fit: cover;
                border-radius: 4px;
            }

            .event-image-container {
                height: 210px;
                margin-bottom: 30px;
            }

            @media (max-width: 767px) {
                .event-grid {
                    grid-template-columns: 1fr;
                }
            }
        `}</style>
        <EventModal isModalOpen={isModalOpen} closeModal={closeModal} event={selectedEvent} />
        </div>
    );
};

export default EventGrid;

