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
  onVerseSelect?: (verse: any, book?: any, chapter?: number) => void;
  isVerseSelected?: (verse: any, chapter?: number) => boolean;
}

const ChapterReader = ({
  book,
  initialChapter = 1,
  version = "nvi",
  onBack,
  onVerseSelect,
  isVerseSelected,
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
      <Card className="border-l-3 border-l-sage-300 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-lg font-medium text-neutral-700 flex items-center gap-2 tracking-tight">
                  <div className="p-1.5 bg-sage-100 rounded-md">
                    <Book className="h-4 w-4 text-sage-600" />
                  </div>
                  Estudo da Bíblia
                  <ChevronDown className="h-3 w-3 text-neutral-400" />
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {book.name} - Capítulo {currentChapter} •{" "}
                  {version.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg transition-all duration-200"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg transition-all duration-200"
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
                onSelect={onVerseSelect}
                isSelected={isVerseSelected?.(
                  verse,
                  chapterData.chapter.number,
                )}
              />
            ))}
        ;
      </div>

      {/* Navigation Progress Bar */}
      <Card className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-neutral-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 disabled:bg-neutral-100 disabled:text-neutral-400 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs bg-white border-neutral-200 text-neutral-600 px-3 py-1"
              >
                {currentChapter} / {book.chapters}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              disabled={!canGoNext}
              className="rounded-full bg-sage-50 hover:bg-sage-100 text-sage-600 disabled:bg-neutral-100 disabled:text-neutral-400 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          size="icon"
          onClick={scrollToTop}
          className="rounded-full bg-white/90 hover:bg-sage-50 text-sage-600 shadow-lg border border-neutral-200/50 backdrop-blur-sm transition-all duration-200"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="rounded-full bg-white/90 hover:bg-sage-50 text-sage-600 shadow-lg border border-neutral-200/50 backdrop-blur-sm transition-all duration-200"
        >
          <Book className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="rounded-full bg-white/90 hover:bg-sage-50 text-sage-600 shadow-lg border border-neutral-200/50 backdrop-blur-sm transition-all duration-200"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterReader;
