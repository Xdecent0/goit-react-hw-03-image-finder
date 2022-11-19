import { Searchbar } from './Searchbar/Searchbar';
import axios from 'axios';
import css from 'components/App.module.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import Modal from './Modal/Modal';
import { useState } from 'react';
import { useEffect } from 'react';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export function App() {
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [totalHits, setTotalHits] = useState(null);
  const [status, setStatus] = useState('idle');

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const searchQuery = searchWord => {
    setQuery(searchWord);
    setGallery([]);
    setPage(1);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (query === '') {
      return;
    }

    const searchOnWord = async () => {
      try {
        const response = await axios.get(
          `?key=29459076-7b0904589e5cd507ddf684d97&q=${query}&image_type=photo&orientation=horizontal&per_page=12&page=${page}`
        );

        setGallery(prevGallery => [...prevGallery, ...response.data.hits]);
        setTotalHits(response.data.totalHits);
      } catch (error) {
        setError('Something went wrong, please reboot the page');
      } finally {
        setStatus('resolved');
      }
    };

    setStatus('pending');
    searchOnWord();
  }, [query, page]);

  useEffect(() => {
    if (status !== 'pending' && page !== 1) {
      window.scrollBy({
        top: 630,
        behavior: 'smooth',
      });
    }
  }, [status, page]);

  const onImageClick = event => {
    const openImage = gallery.find(image => {
      return image.webformatURL === event.currentTarget.src;
    }).largeImageURL;

    setModalImage(openImage);
    setShowModal(true);
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={searchQuery} />
      {error && <h2 className={css.Error}>{error}</h2>}

      <ImageGallery photos={gallery} onClick={onImageClick} />

      {status !== 'pending' &&
        gallery.length > 0 &&
        gallery.length !== totalHits && <Button onClick={loadMore} />}
      {showModal && <Modal modalImage={modalImage} closeModal={toggleModal} />}
    </div>
  );
}
