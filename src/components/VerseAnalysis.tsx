import { useState } from "react";
import { Bot, Sparkles, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BibleVerse, BibleBookInfo } from "@/types/bible";

interface VerseAnalysisProps {
  selectedVerses: Array<{
    verse: BibleVerse;
    book: BibleBookInfo;
    chapter: number;
  }>;
  onClose?: () => void;
}

const VerseAnalysis = ({ selectedVerses, onClose }: VerseAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Simular análise da IA (substituir por chamada real da API)
    setTimeout(() => {
      const versesText = selectedVerses
        .map(
          ({ verse, book, chapter }) =>
            `${book.name} ${chapter}:${verse.number} - "${verse.text}"`,
        )
        .join("\n\n");

      const mockAnalysis = `**Análise dos Versículos Selecionados**

${versesText}

**Contexto Histórico:**
Estes versículos fazem parte de uma passagem fundamental que revela aspectos importantes da fé e da relação com Deus.

**Significado Teológico:**
A mensagem central dessas escrituras aponta para a importância da confiança e da fé nas promessas divinas.

**Aplicação Prática:**
Para os dias de hoje, estes versículos nos ensinam sobre:
- A importância da perseverança na fé
- Como aplicar os princípios bíblicos na vida cotidiana
- O valor da meditação nas escrituras

**Conexões Bíblicas:**
Estes versículos se relacionam com outras passagens que abordam temas similares de fé, esperança e confiança em Deus.

*Análise gerada pelo assistente IA Gemini*`;

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm border-neutral-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-neutral-700 tracking-tight">
              Análise de Versículos
            </h3>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">Gemini</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selected Verses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-600">
              Versículos Selecionados
            </h4>
            <Badge
              variant="outline"
              className="bg-white border-neutral-200 text-neutral-600"
            >
              {selectedVerses.length} versículo
              {selectedVerses.length > 1 ? "s" : ""}
            </Badge>
          </div>

          <ScrollArea className="max-h-40 w-full">
            <div className="space-y-2">
              {selectedVerses.map(({ verse, book, chapter }, index) => (
                <div
                  key={index}
                  className="p-3 bg-sage-50 rounded-lg border border-sage-200"
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant="secondary"
                      className="mt-0.5 text-xs bg-sage-100 text-sage-700"
                    >
                      {verse.number}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {verse.text}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {book.name} {chapter}:{verse.number}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Analysis Section */}
        {!analysis && !isAnalyzing && (
          <div className="text-center py-6">
            <p className="text-sm text-neutral-600 mb-4">
              Clique no botão abaixo para gerar uma análise detalhada dos
              versículos selecionados.
            </p>
            <Button
              onClick={handleAnalyze}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              Analisar Versículos
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-3">
              <Bot className="h-8 w-8 mx-auto text-blue-500 animate-bounce" />
              <p className="text-sm text-neutral-600">
                Analisando versículos com IA...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-neutral-600">
              Análise Gerada
            </h4>
            <ScrollArea className="max-h-96 w-full">
              <div className="prose prose-sm max-w-none">
                <div className="p-4 bg-white rounded-lg border border-neutral-200 text-neutral-700 whitespace-pre-line">
                  {analysis}
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setAnalysis("")}
                className="border-neutral-200 hover:bg-sage-50"
              >
                Nova Análise
              </Button>
              <Button
                variant="outline"
                className="border-neutral-200 hover:bg-sage-50"
              >
                Compartilhar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerseAnalysis;
