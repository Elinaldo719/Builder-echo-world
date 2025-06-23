import { useState } from "react";
import { Bot, Sparkles, Send, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  // Verificar configurações da API
  const hasApiKey = localStorage.getItem("gemini_api_key");
  const hasCustomPrompt = localStorage.getItem("gemini_custom_prompt");

  const handleSaveAnalysis = () => {
    if (!analysis) return;

    const analysisData = {
      id: Date.now().toString(),
      title: `Estudo de ${selectedVerses.length} versículo${selectedVerses.length > 1 ? "s" : ""}`,
      verses: selectedVerses.map(({ verse, book, chapter }) => ({
        text: verse.text,
        reference: `${book.name} ${chapter}:${verse.number}`,
      })),
      analysis: analysis,
      date: new Date().toISOString(),
    };

    // Salvar no localStorage
    const existingAnalyses = JSON.parse(
      localStorage.getItem("saved_analyses") || "[]",
    );
    existingAnalyses.unshift(analysisData); // Adiciona no início da lista
    localStorage.setItem("saved_analyses", JSON.stringify(existingAnalyses));

    toast({
      title: "Análise salva com sucesso!",
      description: "Você pode acessá-la na seção 'Análises Salvas'.",
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    try {
      // Obter configurações salvas
      const apiKey = localStorage.getItem("gemini_api_key");
      const customPrompt =
        localStorage.getItem("gemini_custom_prompt") ||
        "Analise os versículos bíblicos fornecidos considerando contexto histórico, significado teológico e aplicação prática.";

      const aiSettings = JSON.parse(
        localStorage.getItem("ai_model_settings") || "{}",
      );

      // Preparar versículos para análise
      const versesText = selectedVerses
        .map(
          ({ verse, book, chapter }) =>
            `${book.name} ${chapter}:${verse.number} - "${verse.text}"`,
        )
        .join("\n\n");

      // Construir prompt completo
      const fullPrompt = `${customPrompt}

VERSÍCULOS PARA ANÁLISE:
${versesText}

Por favor, forneça uma análise detalhada e bem estruturada destes versículos.`;

      if (apiKey && apiKey.trim()) {
        // Fazer chamada real para a API do Gemini
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${aiSettings.model || "gemini-2.5-flash"}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: fullPrompt,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: aiSettings.temperature
                    ? aiSettings.temperature[0]
                    : 1,
                  maxOutputTokens: 2048,
                },
              }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            const generatedText =
              data.candidates?.[0]?.content?.parts?.[0]?.text ||
              "Não foi possível gerar a análise.";

            // Remove asteriscos e formata o texto
            const cleanAnalysis = generatedText.replace(/\*/g, "");
            setAnalysis(cleanAnalysis);
            setIsAnalyzing(false);
            return;
          } else {
            throw new Error(`Erro da API: ${response.status}`);
          }
        } catch (apiError) {
          console.error("Erro na API do Gemini:", apiError);
          toast({
            title: "Erro na API",
            description:
              "Não foi possível conectar com o Gemini. Usando análise local.",
            variant: "destructive",
          });
        }
      }

      // Fallback: Análise local melhorada baseada no prompt personalizado
      setTimeout(() => {
        const analysisTemplate = `Análise dos Versículos Selecionados

Versículos Analisados:
${versesText}

Baseado no prompt personalizado: "${customPrompt}"

Esta análise foi gerada localmente pois não foi possível conectar com a API do Gemini.
Para obter análises mais detalhadas e personalizadas, verifique:
- Se sua chave da API está correta nas configurações
- Se você tem conexão com a internet
- Se as configurações do modelo estão adequadas

Análise básica dos versículos:
Os versículos selecionados contêm ensinamentos importantes que podem ser aplicados em nossa vida diária.
Cada passagem carrega significado teológico e histórico que merece reflexão cuidadosa.

Configure sua chave da API do Gemini nas configurações para análises mais profundas e personalizadas.`;

        setAnalysis(analysisTemplate);
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Erro na análise:", error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a análise. Tente novamente.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
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
            <div className="mb-4">
              <p className="text-sm text-neutral-600 mb-2">
                Clique no botão abaixo para gerar uma análise detalhada dos
                versículos selecionados.
              </p>

              {/* Status das configurações */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${hasApiKey ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-xs text-neutral-500">
                    API Key {hasApiKey ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${hasCustomPrompt ? "bg-green-500" : "bg-yellow-500"}`}
                  ></div>
                  <span className="text-xs text-neutral-500">
                    Prompt {hasCustomPrompt ? "Personalizado" : "Padrão"}
                  </span>
                </div>
              </div>

              {!hasApiKey && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md mb-2">
                  ⚠️ Configure sua API key do Gemini nas configurações para
                  análises mais detalhadas
                </p>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              {hasApiKey ? "Analisar com Gemini" : "Análise Local"}
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
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 text-neutral-700 whitespace-pre-line">
                  {analysis}
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleSaveAnalysis}
                className="border-green-200 hover:bg-green-50 text-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
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
