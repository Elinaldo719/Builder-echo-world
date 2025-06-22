import { BibleBook } from "@/types/bible";
import BibleHeader from "@/components/BibleHeader";
import BooksList from "@/components/BooksList";

interface BibleBooksProps {
  onBookSelect?: (book: BibleBook) => void;
  onRandomVerse?: () => void;
}

const BibleBooks = ({ onBookSelect, onRandomVerse }: BibleBooksProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BibleHeader onRandomVerse={onRandomVerse} />
      <div className="px-4 py-6">
        <BooksList onBookSelect={onBookSelect} />
      </div>
    </div>
  );
};

export default BibleBooks;
