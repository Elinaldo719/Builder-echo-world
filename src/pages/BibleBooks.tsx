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
      <div className="px-4 py-8 max-w-none mx-auto">
        <BooksList onBookSelect={onBookSelect} />
      </div>
    </div>
  );
};

export default BibleBooks;
