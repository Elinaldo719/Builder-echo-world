import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Bookmark,
  Share2,
  Book,
  ChevronDown,
} from "lucide-react";
import { BibleBook } from "@/types/bible";
import { bibleApi } from "@/lib/bible-api";
import VerseCard from "./VerseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChapterReaderProps {
  book: BibleBook;
  initialChapter?: number;
  version?: string;
  onBack?: () => void;
}

const ChapterReader = ({
  book,
  initialChapter = 1,
  version = "nvi",
  onBack,
}: ChapterReaderProps) => {
  const [currentChapter, setCurrentChapter] = useState(initialChapter);

  const {
    data: chapterData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bible-chapter", version, book.abbrev.pt, currentChapter],
    queryFn: () => bibleApi.getChapter(version, book.abbrev.pt, currentChapter),
  });

  const canGoPrevious = currentChapter > 1;
  const canGoNext = currentChapter < book.chapters;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Erro ao carregar o capítulo
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Estudo da Bíblia
                  <ChevronDown className="h-4 w-4" />
                </h2>
                <p className="text-sm text-gray-600">
                  {book.name} - Capítulo {currentChapter} -{" "}
                  {version.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-800"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-800"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Verses */}
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : chapterData?.verses.map((verse) => (
              <VerseCard
                key={verse.number}
                verse={verse}
                book={chapterData.book}
                chapter={chapterData.chapter.number}
              />
            ))}
      </div>

      {/* Navigation Progress Bar */}
      <Card className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentChapter} / {book.chapters}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3">
        <Button
          size="icon"
          onClick={scrollToTop}
          className="rounded-full purple-gradient shadow-lg"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button size="icon" className="rounded-full purple-gradient shadow-lg">
          <Book className="h-4 w-4" />
        </Button>
        <Button size="icon" className="rounded-full purple-gradient shadow-lg">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterReader;
