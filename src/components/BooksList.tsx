import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Book } from "lucide-react";
import { BibleBook } from "@/types/bible";
import { bibleApi } from "@/lib/bible-api";
import SearchBar from "./SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Book className="h-5 w-5" />
          Livros da Bíblia
        </h2>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <SearchBar
        placeholder="Pesquisar livros..."
        value={searchTerm}
        onChange={setSearchTerm}
        icon="book"
      />

      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))
          : filteredBooks?.map((book) => (
              <Card
                key={book.abbrev.pt}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onBookSelect?.(book)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{book.name}</h3>
                      <p className="text-sm text-gray-600">
                        {book.author} • {book.group}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {book.chapters} cap.
                      </Badge>
                      <Badge
                        variant={
                          book.testament === "VT" ? "secondary" : "default"
                        }
                        className="text-xs"
                      >
                        {book.testament}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
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
