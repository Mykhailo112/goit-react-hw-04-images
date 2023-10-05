import { useState, useEffect } from 'react';
import { fetchImages } from './API/api.js';
import { ButtonLoadMore } from './Button/Button.js';
import { SearchBar } from './SearchBar/SearchBar.js';
import { ImageGallery } from './ImageGallery/ImageGallery.js';
import { Loader } from './Loader/Loader.js';
import { ErrorMsg } from './App.styled.js';

export const App = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);
  const [searchFailed, setSearchFailed] = useState(false);

  useEffect(() => {
    async function getQuery() {
      if (!query) {
        return;
      }
      try {
        setLoading(true);
        setError(false);

        const { hits, totalHits } = await fetchImages(query, page);

        const filteredNeedsValues = () => {
          setImages(
            prevState => [...prevState, ...hits],
            setShowLoadMoreButton(false)
          );
        };

        if (page === Math.ceil(totalHits / 12)) {
          filteredNeedsValues();
          return;
        }

        if (hits.length === 0) {
          setSearchFailed(true);
        }

        filteredNeedsValues();
        setShowLoadMoreButton(true);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getQuery();
  }, [query, page]);

  const handleSubmit = item => {
    setQuery(item);
    setImages([]);
    setPage(1);
    setError(false);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSubmit} />
      {loading && <Loader />}
      {images.length > 0 && <ImageGallery hits={images} />}
      {searchFailed && images.length === 0 && !loading && (
        <ErrorMsg>
          Such images was not found, try find something else 😉
        </ErrorMsg>
      )}
      {error && !loading && (
        <ErrorMsg>❌ Something went wrong,try reload page</ErrorMsg>
      )}
      {images.length > 0 && showLoadMoreButton && !loading && (
        <ButtonLoadMore loadMore={handleLoadMore} />
      )}
    </div>
  );
};
