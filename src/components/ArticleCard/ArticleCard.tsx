import React from 'react';
import './ArticleCard.css';

interface ArticleCardProps {
  imageUrl: string;
  date: string;
  title: string;
  authorName: string;
  authorAvatar: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  imageUrl,
  date,
  title,
  authorName,
  authorAvatar
}) => {
  return (
    <article className="article-card">
      <div className="article-card__image-wrapper">
        <img src={imageUrl} alt={title} className="article-card__image" />
      </div>
      <div className="article-card__content">
        <div className="article-card__date">{date}</div>
        <h3 className="article-card__title">{title}</h3>
        <div className="article-card__author">
          <img src={authorAvatar} alt={authorName} className="article-card__avatar" />
          <span className="article-card__author-name">{authorName}</span>
        </div>
      </div>
    </article>
  );
};
