import { BibleVerse, BibleBookInfo } from "@/types/bible";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VerseCardProps {
  verse: BibleVerse;
  book?: BibleBookInfo;
  chapter?: number;
  className?: string;
  showNumber?: boolean;
  isSelected?: boolean;
  onSelect?: (
    verse: BibleVerse,
    book?: BibleBookInfo,
    chapter?: number,
  ) => void;
}

const VerseCard = ({
  verse,
  book,
  chapter,
  className,
  showNumber = true,
  isSelected,
  onSelect,
}: VerseCardProps) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(verse, book, chapter);
    }
  };

  return (
    <Card
      className={cn(
        "border-l-3 bg-white/80 backdrop-blur-sm transition-all duration-200",
        isSelected
          ? "border-l-blue-500 bg-blue-50/70 shadow-lg ring-2 ring-blue-200"
          : "border-l-sage-300 hover:shadow-md hover:bg-white/90",
        onSelect && "cursor-pointer select-none active:scale-[0.98]",
        className,
      )}
      onClick={handleClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {showNumber && (
            <div
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                isSelected ? "bg-blue-100" : "bg-sage-100",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-blue-600" : "text-sage-600",
                )}
              >
                {verse.number}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-neutral-700 leading-relaxed text-base font-normal">
              {verse.text}
            </p>
            {book && chapter && (
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <p className="text-sm text-neutral-500 font-medium">
                  {book.name} - Capítulo {chapter}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {book.version?.toUpperCase()}
                </p>
              </div>
            )}
            {isSelected && (
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 text-xs font-medium"
                >
                  ✓ Selecionado
                </Badge>
                <span className="text-xs text-blue-600">
                  Toque novamente para desmarcar
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
