import React from 'react';
import { MagazineNavbar } from '../../components/MagazineNavbar/MagazineNavbar';
import { MagazineHero } from '../../components/MagazineHero/MagazineHero';
import { ArticleCard } from '../../components/ArticleCard/ArticleCard';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const articles = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      date: 'Apr 2, 2025',
      title: 'Vestibulum sem non tortor rhoncus tempus.',
      authorName: 'John Marker',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
      date: 'Apr 2, 2025',
      title: 'Vestibulum sem non tortor rhoncus tempus.',
      authorName: 'John Marker',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1550614000-4b95d4662d08?auto=format&fit=crop&q=80&w=600',
      date: 'Apr 2, 2025',
      title: 'Vestibulum sem non tortor rhoncus tempus.',
      authorName: 'John Marker',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
      date: 'Apr 2, 2025',
      title: 'Vestibulum sem non tortor rhoncus tempus.',
      authorName: 'John Marker',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
    }
  ];

  return (
    <div className="mag-home">
      <MagazineNavbar />
      <MagazineHero />
      <section className="mag-home__articles-section">
        <div className="mag-home__grid">
          {articles.map(article => (
            <ArticleCard 
              key={article.id}
              imageUrl={article.imageUrl}
              date={article.date}
              title={article.title}
              authorName={article.authorName}
              authorAvatar={article.authorAvatar}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
