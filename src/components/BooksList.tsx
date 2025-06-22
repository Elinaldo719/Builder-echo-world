import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Book } from "lucide-react";
import { BibleBook } from "@/types/bible";
import { bibleApi } from "@/lib/bible-api";
import SearchBar from "./SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BooksListProps {
  onBookSelect?: (book: BibleBook) => void;
}

const BooksList = ({ onBookSelect }: BooksListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: books,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bible-books"],
    queryFn: bibleApi.getBooks,
  });

  const filteredBooks = books?.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.group.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Erro ao carregar os livros da Bíblia
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-neutral-700 tracking-tight">
          Livros da Bíblia
        </h2>
        <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
          <ChevronRight className="h-3 w-3 text-sage-600" />
        </div>
      </div>

      <SearchBar
        placeholder="Pesquisar livros..."
        value={searchTerm}
        onChange={setSearchTerm}
        icon="book"
      />

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))
          : filteredBooks?.map((book) => (
              <Card
                key={book.abbrev.pt}
                className="cursor-pointer hover:bg-sage-50/50 transition-all duration-200 border-neutral-200/50 bg-white/80 backdrop-blur-sm"
                onClick={() => onBookSelect?.(book)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-700">
                        {book.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {book.author} • {book.group}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="text-xs bg-sage-50 text-sage-600 border-sage-200"
                      >
                        {book.chapters} cap.
                      </Badge>
                      <Badge
                        variant={
                          book.testament === "VT" ? "secondary" : "default"
                        }
                        className={cn(
                          "text-xs",
                          book.testament === "VT"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-neutral-100 text-neutral-600 border-neutral-200",
                        )}
                      >
                        {book.testament}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default BooksList;
