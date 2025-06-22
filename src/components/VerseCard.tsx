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
    <Card className={cn("border-l-4 border-l-primary", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {showNumber && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {verse.number}
            </Badge>
          )}
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed text-sm md:text-base">
              {verse.text}
            </p>
            {book && chapter && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {book.name} - Capítulo {chapter} -{" "}
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
