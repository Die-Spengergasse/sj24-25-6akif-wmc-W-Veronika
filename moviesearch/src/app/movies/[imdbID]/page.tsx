"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MovieDetail } from "@/app/types/MovieDetail";
import MovieDetailView from "../MovieDetailView";
import styles from "@/app/movies/MovieDetailView.module.css"; 

const MovieDetailPage = () => {
  const params = useParams();
  const router = useRouter(); // Next.js Router für bessere Navigation
  const imdbID = params.imdbID as string;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null); // Fehlerzustand hinzufügen
  const [loading, setLoading] = useState(true); // Loading-Status

  useEffect(() => {
    if (!imdbID) {
      setError("Ungültige Film-ID.");
      setLoading(false);
      return;
    }

    fetch(`https://www.omdbapi.com/?apikey=cd2aa4ca&i=${imdbID}&plot=full`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "False") {
          setError(data.Error || "Film nicht gefunden.");
          setMovie(null);
        } else {
          setMovie(data);
          setError(null);
        }
      })
      .catch(() => setError("Fehler beim Laden der Daten."))
      .finally(() => setLoading(false));
  }, [imdbID]);

  if (loading) return <p>Loading...</p>; // Ladeanzeige

  if (error) return <p style={{ color: "red" }}>{error}</p>; // Fehleranzeige

  return (
    <div>
      {movie && <MovieDetailView movie={movie} />}
      <button onClick={() => router.back()} className={styles.backButton}>Zurück</button> {/* Sicherere Navigation */}
    </div>
  );
};

export default MovieDetailPage;
