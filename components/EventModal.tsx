import Modal from 'react-modal'

const EventModal = ({ isModalOpen, closeModal, event }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Item Modal"
            style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                  top: '50%',
                  left: '50%',
                  right: 'auto',
                  bottom: 'auto',
                  marginRight: '-50%',
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '800px', // Adjust the maximum width as needed
                },
            }}
        >
        <h2>{event.title}</h2>
        <p><pre>{event.eventDescription}</pre></p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    )
}

export default EventModal;