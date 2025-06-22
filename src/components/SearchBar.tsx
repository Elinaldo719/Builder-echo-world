import { Search, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  icon?: "search" | "book";
}

const SearchBar = ({
  placeholder = "Pesquisar...",
  value,
  onChange,
  className,
  icon = "search",
}: SearchBarProps) => {
  const IconComponent = icon === "search" ? Search : Book;

  return (
    <div className={cn("relative", className)}>
      <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-10 bg-white border-neutral-200 focus:border-sage-300 focus:ring-sage-100 rounded-lg transition-all duration-200 text-neutral-700 placeholder:text-neutral-400"
      />
    </div>
  );
};

export default SearchBar;
