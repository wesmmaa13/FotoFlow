import React, { useEffect, useState, useRef } from 'react';
import './App.css';

const accessKey = 'M6ry1_WfoX4tRWDHf6gXxS27SDY-Fb2IEgyvrasBSDg';

const categories = [
  { name: 'Öne Çıkan', query: '' },
  { name: 'Duvar Kağıtları', query: 'wallpaper' },
  { name: 'Doğa', query: 'nature' },
  { name: '3D Renderlar', query: '3d render' },
  { name: 'Dokular', query: 'texture' },
  { name: 'Seyahat', query: 'travel' },
  { name: 'Film', query: 'film' },
];

function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const loader = useRef(null);

  const fetchPhotos = async () => {
    let url = '';
    if (selectedCategory === '') {
      url = `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=${accessKey}`;
    } else {
      url = `https://api.unsplash.com/search/photos?page=${page}&per_page=10&query=${encodeURIComponent(selectedCategory)}&client_id=${accessKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (selectedCategory === '') {
      setPhotos((prev) => [...prev, ...data]);
    } else {
      setPhotos((prev) => [...prev, ...data.results]);
    }
  };

  useEffect(() => {
    setPhotos([]);
    setPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    fetchPhotos();
  }, [page, selectedCategory]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    }, options);

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, []);

  return (
    <div>
     
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="logo">FotoFlow</h1>
        </div>
        <div className="topbar-right">
          <input
            type="text"
            placeholder="Fotoğraf ara..."
            className="search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSelectedCategory(e.target.value);
              }
            }}
          />
        </div>
      </header>

      
      <div className="container">
       
        <aside className="sidebar">
          <div className="profile">
            <h2>Esma Öztürk</h2>
            <p>@esma</p>
          </div>
          <nav>
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat.name}
                  className={selectedCategory === cat.query ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat.query)}
                  style={{ cursor: 'pointer' }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        
        <main className="content">
          <div className="photo-grid">
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.urls.small}
                alt={photo.alt_description || 'Fotoğraf'}
                className="photo"
              />
            ))}
          </div>
          <div ref={loader} className="loading">
            <p>Yükleniyor...</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

