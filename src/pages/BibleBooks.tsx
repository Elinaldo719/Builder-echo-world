import { BibleBook } from "@/types/bible";
import BibleHeader from "@/components/BibleHeader";
import BooksList from "@/components/BooksList";

interface BibleBooksProps {
  onBookSelect?: (book: BibleBook) => void;
  onRandomVerse?: () => void;
}

const BibleBooks = ({ onBookSelect, onRandomVerse }: BibleBooksProps) => {
  return (
    <div className="min-h-screen modern-gradient">
      <BibleHeader onRandomVerse={onRandomVerse} />
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <BooksList onBookSelect={onBookSelect} />
      </div>
    </div>
  );
};

export default BibleBooks;
