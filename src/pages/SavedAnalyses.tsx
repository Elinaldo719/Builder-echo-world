import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Calendar, Trash2, Share2 } from "lucide-react";
import BibleHeader from "@/components/BibleHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SavedAnalysis {
  id: string;
  verses: Array<{
    text: string;
    reference: string;
  }>;
  analysis: string;
  date: string;
  title: string;
}

const SavedAnalyses = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    // Carregar análises salvas do localStorage
    const saved = localStorage.getItem("saved_analyses");
    if (saved) {
      setAnalyses(JSON.parse(saved));
    }
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  const deleteAnalysis = (id: string) => {
    const updated = analyses.filter((analysis) => analysis.id !== id);
    setAnalyses(updated);
    localStorage.setItem("saved_analyses", JSON.stringify(updated));
  };

  const formatAnalysisText = (text: string) => {
    // Remove asteriscos, hashtags e tags markdown
    let cleanText = text
      .replace(/\*\*/g, "") // Remove **
      .replace(/\*/g, "") // Remove *
      .replace(/###/g, "") // Remove ###
      .replace(/##/g, "") // Remove ##
      .replace(/#/g, "") // Remove #
      .replace(/\[.*?\]/g, "") // Remove tags [texto]
      .replace(/<.*?>/g, "") // Remove tags HTML
      .trim();

    // Quebra o texto em seções
    const sections = cleanText.split(/\n\s*\n/);

    return sections.map((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      // Identifica títulos principais (palavras em MAIÚSCULA ou títulos comuns)
      if (
        trimmed.match(/^[A-ZÀ-Ù\s]{3,}:?\s*$/) ||
        trimmed.match(
          /^(ANÁLISE|CONTEXTO|SIGNIFICADO|APLICAÇÃO|CONEXÕES|REFLEXÃO|VERSÍCULOS|CONCLUSÃO)/i,
        )
      ) {
        return (
          <div key={index} className="mb-4 first:mt-0">
            <h2 className="text-lg font-bold text-blue-700 mb-2 pb-1 border-b border-blue-200">
              {trimmed.replace(/:/g, "")}
            </h2>
          </div>
        );
      }

      // Identifica subtítulos (linha que termina com : e tem menos de 80 caracteres)
      if (
        trimmed.endsWith(":") &&
        trimmed.length < 80 &&
        !trimmed.includes(".")
      ) {
        return (
          <h3
            key={index}
            className="text-base font-semibold text-purple-700 mb-2 mt-3 first:mt-0"
          >
            {trimmed.replace(/:/g, "")}
          </h3>
        );
      }

      // Identifica listas (linhas que começam com -, •, ou números)
      if (trimmed.match(/^[\-•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        const items = trimmed
          .split("\n")
          .filter((line) => line.trim().match(/^[\-•\d]/));

        return (
          <div key={index} className="mb-3">
            <ul className="space-y-1">
              {items.map((item, i) => {
                const cleanItem = item.replace(/^[\-•\d\.\s]+/, "").trim();
                return (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                    <span>{cleanItem}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }

      // Identifica citações bíblicas (contém nome de livro e números)
      if (trimmed.match(/\b[A-ZÀ-Ù][a-zà-ù]+\s+\d+:\d+/)) {
        return (
          <blockquote
            key={index}
            className="border-l-3 border-green-400 bg-green-50 pl-3 py-2 my-3 italic text-gray-800 text-sm rounded-r-md"
          >
            {trimmed}
          </blockquote>
        );
      }

      // Texto normal
      return (
        <div key={index} className="mb-3">
          <p className="text-gray-800 leading-relaxed text-sm">
            {trimmed.split("\n").map((line, lineIndex) => (
              <span key={lineIndex}>
                {line.trim()}
                {lineIndex < trimmed.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen modern-gradient">
      <BibleHeader onMenuClick={handleBack} hideMenuButton={true} />

      <div className="px-2 sm:px-4 lg:px-6 py-8 pb-24 max-w-none mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-medium text-neutral-700 tracking-tight">
                Análises Salvas
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Histórico de estudos bíblicos com IA
              </p>
            </div>
          </div>

          {/* Analyses List */}
          {analyses.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/50">
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-2">
                  Nenhuma análise salva
                </h3>
                <p className="text-neutral-500 mb-4">
                  Quando você analisar versículos com IA, eles aparecerão aqui.
                </p>
                <Button
                  onClick={handleBack}
                  className="bg-sage-500 hover:bg-sage-600 text-white"
                >
                  Começar Estudo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 pb-8">
              {analyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="bg-white/80 backdrop-blur-sm border-neutral-200/50"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-neutral-700">
                            {analysis.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(analysis.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAnalysis(analysis.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Selected Verses */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {analysis.verses.length} versículo
                          {analysis.verses.length > 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {analysis.verses.map((verse, index) => (
                          <div
                            key={index}
                            className="p-3 bg-sage-50 rounded-lg border border-sage-200"
                          >
                            <p className="text-sm text-neutral-700 italic">
                              "{verse.text}"
                            </p>
                            <p className="text-xs text-sage-600 mt-1 font-medium">
                              {verse.reference}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Content */}
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="w-full">
                        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-lg border border-blue-200 p-4 shadow-sm">
                          <div className="prose prose-sm max-w-none">
                            <div className="font-serif leading-relaxed">
                              {formatAnalysisText(analysis.analysis)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAnalyses;
