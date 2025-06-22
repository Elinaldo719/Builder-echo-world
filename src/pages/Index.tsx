import { useState } from "react";
import { BibleBook } from "@/types/bible";
import BibleHeader from "@/components/BibleHeader";
import DailyVerse from "@/components/DailyVerse";
import BooksList from "@/components/BooksList";
import ChapterReader from "@/components/ChapterReader";

type AppState = "home" | "books" | "reading";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("home");
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [dailyVerseKey, setDailyVerseKey] = useState(0);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setAppState("reading");
  };

  const handleRandomVerse = () => {
    setDailyVerseKey((prev) => prev + 1);
    setAppState("home");
  };

  const handleBackToBooks = () => {
    setAppState("home");
    setSelectedBook(null);
  };

  const handleMenuClick = () => {
    if (appState === "home") {
      setAppState("books");
    } else {
      setAppState("home");
    }
  };

  return (
    <div className="min-h-screen modern-gradient">
      <BibleHeader
        onRandomVerse={handleRandomVerse}
        onMenuClick={handleMenuClick}
      />

      <div className="px-6 py-8 max-w-4xl mx-auto">
        {appState === "home" && (
          <div className="space-y-6">
            <DailyVerse key={dailyVerseKey} onRefresh={handleRandomVerse} />
            <BooksList onBookSelect={handleBookSelect} />
          </div>
        )}

        {appState === "books" && <BooksList onBookSelect={handleBookSelect} />}

        {appState === "reading" && selectedBook && (
          <ChapterReader book={selectedBook} onBack={handleBackToBooks} />
        )}
      </div>
    </div>
  );
};

export default Index;
