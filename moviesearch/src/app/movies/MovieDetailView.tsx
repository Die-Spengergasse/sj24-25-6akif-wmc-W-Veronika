"use client";

import { MovieDetail } from "@/app/types/MovieDetail";
import styles from "./MovieDetailView.module.css";  

type MovieDetailViewProps = {
  movie: MovieDetail;
};

export default function MovieDetailView({ movie }: MovieDetailViewProps) {
    return (
      <div className={styles.movieDetailContainer}>
        <div className={styles.movieHeader}>
          <h1 className={styles.movieTitle}>{movie.Title}</h1>
          <h2 className={styles.movieYear}>({movie.Year})</h2>
        </div>
  
        <p className={styles.moviePlot}>{movie.Plot}</p>
  
        <div className={styles.movieRatings}>
          <h3>Ratings:</h3>
          <ul>
            {movie.Ratings.map((rating, index) => (
              <li key={index}>
                <strong>{rating.Source}:</strong> {rating.Value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}