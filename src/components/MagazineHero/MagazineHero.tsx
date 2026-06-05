import React from 'react';
import './MagazineHero.css';

export const MagazineHero: React.FC = () => {
  return (
    <section className="mag-hero">
      <div className="mag-hero__content">
        <div className="mag-hero__subheading">HEADING HERE</div>
        <h1 className="mag-hero__heading">
          Hot Takes & Bold Opinions:<br/>
          The Stories You Can't Ignore
        </h1>
        <p className="mag-hero__description">
          Donec ultrices, diam sed efficitur semper, diam lectus malesuada nisl, eget congue magna
        </p>
        <button className="mag-hero__button">
          Check Now
        </button>
      </div>
    </section>
  );
};
