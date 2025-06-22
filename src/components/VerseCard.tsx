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
}

const VerseCard = ({
  verse,
  book,
  chapter,
  className,
  showNumber = true,
}: VerseCardProps) => {
  return (
    <Card
      className={cn(
        "border-l-3 border-l-sage-300 bg-white/80 backdrop-blur-sm",
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {showNumber && (
            <div className="flex-shrink-0 w-7 h-7 bg-sage-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-sage-600">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
