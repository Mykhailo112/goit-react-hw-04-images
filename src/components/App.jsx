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
  const [totalImages, setTotalImages] = useState(0);
  const [searchFailed, setSearchFailed] = useState(false);

  useEffect(() => {
    if (!query) return;
    async function getQuery() {
      try {
        setLoading(true);
        setError(false);

        const { hits, totalHits } = await fetchImages(query, page);
        if (!totalHits) return setSearchFailed(true);

        setImages(prevState => [...prevState, ...hits]);
        setTotalImages(totalHits);
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
    setTotalImages(0);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSubmit} />
      {images.length > 0 && <ImageGallery hits={images} />}
      {searchFailed && images.length === 0 && !loading && (
        <ErrorMsg>
          Such images was not found, try find something else 😉
        </ErrorMsg>
      )}
      {error && !loading && (
        <ErrorMsg>❌ Something went wrong,try reload page</ErrorMsg>
      )}
      {images.length !== totalImages && !loading && (
        <ButtonLoadMore loadMore={handleLoadMore} />
      )}
      {loading && <Loader />}
    </div>
  );
};
