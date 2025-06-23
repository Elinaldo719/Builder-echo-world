import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BibleBook, BibleVerse, BibleBookInfo } from "@/types/bible";
import BibleHeader from "@/components/BibleHeader";
import DailyVerse from "@/components/DailyVerse";
import BooksList from "@/components/BooksList";
import ChapterReader from "@/components/ChapterReader";

import MenuDrawer from "@/components/MenuDrawer";
import VerseAnalysis from "@/components/VerseAnalysis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

type AppState = "home" | "books" | "reading";

const Index = () => {
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>("home");
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [dailyVerseKey, setDailyVerseKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<
    Array<{
      verse: BibleVerse;
      book: BibleBookInfo;
      chapter: number;
    }>
  >([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setAppState("reading");
    setSelectedVerses([]); // Clear selections when changing books
  };

  const handleRandomVerse = () => {
    setDailyVerseKey((prev) => prev + 1);
    setAppState("home");
  };

  const handleBackToBooks = () => {
    setAppState("home");
    setSelectedBook(null);
    setSelectedVerses([]);
  };

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleVerseSelect = (
    verse: BibleVerse,
    book?: BibleBookInfo,
    chapter?: number,
  ) => {
    if (!book || !chapter) return;

    const verseData = { verse, book, chapter };
    const isAlreadySelected = selectedVerses.some(
      (selected) =>
        selected.verse.number === verse.number && selected.chapter === chapter,
    );

    if (isAlreadySelected) {
      setSelectedVerses((prev) =>
        prev.filter(
          (selected) =>
            !(
              selected.verse.number === verse.number &&
              selected.chapter === chapter
            ),
        ),
      );
    } else {
      setSelectedVerses((prev) => [...prev, verseData]);
    }
  };

  const isVerseSelected = (verse: BibleVerse, chapter?: number) => {
    return selectedVerses.some(
      (selected) =>
        selected.verse.number === verse.number && selected.chapter === chapter,
    );
  };

  const handleStartAnalysis = () => {
    setShowAnalysis(true);
  };

  return (
    <div className="min-h-screen modern-gradient">
      <BibleHeader
        onRandomVerse={handleRandomVerse}
        onMenuClick={handleMenuClick}
      />

      <MenuDrawer
        open={menuOpen}
        onOpenChange={setMenuOpen}
        onNavigateToSettings={() => navigate("/settings")}
        onNavigateToAnalyses={() => navigate("/analyses")}
        onNavigateToHome={() => {
          setAppState("home");
          setSelectedBook(null);
          setSelectedVerses([]);
        }}
        onNavigateToBooks={() => setAppState("books")}
      />

      <div className="px-4 py-8 max-w-none mx-auto">
        {/* Selected Verses Analysis Bar */}
        {selectedVerses.length > 0 && !showAnalysis && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {selectedVerses.length} versículo
                  {selectedVerses.length > 1 ? "s" : ""} selecionado
                  {selectedVerses.length > 1 ? "s" : ""}
                </Badge>
                <span className="text-sm text-blue-700">
                  Clique em "Analisar" para gerar insights com IA
                </span>
              </div>
              <Button
                onClick={handleStartAnalysis}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="sm"
              >
                <Bot className="h-4 w-4 mr-2" />
                Analisar
              </Button>
            </div>
          </div>
        )}

        {/* Verse Analysis Modal */}
        {showAnalysis && selectedVerses.length > 0 && (
          <div className="mb-6">
            <VerseAnalysis
              selectedVerses={selectedVerses}
              onClose={() => setShowAnalysis(false)}
            />
          </div>
        )}

        {appState === "home" && (
          <div className="space-y-6">
            <DailyVerse key={dailyVerseKey} onRefresh={handleRandomVerse} />
            <BooksList onBookSelect={handleBookSelect} />
          </div>
        )}

        {appState === "books" && <BooksList onBookSelect={handleBookSelect} />}

        {appState === "reading" && selectedBook && (
          <ChapterReader
            book={selectedBook}
            onBack={handleBackToBooks}
            onVerseSelect={handleVerseSelect}
            isVerseSelected={isVerseSelected}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
