import Modal from 'react-modal';
import { useState } from 'react';
import {
  ImageGalleryLi,
  ImageGalleryLiImg,
} from './ImageGalleryItem.styled.js';

Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export const ImageGalleryItem = ({ webformatURL, largeImageURL, tags, id }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <ImageGalleryLi key={id} id={id} onClick={openModal}>
        <ImageGalleryLiImg src={webformatURL} alt={tags} />
      </ImageGalleryLi>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <img src={largeImageURL} alt={tags} width={600} height={400} />
      </Modal>
    </div>
  );
};
