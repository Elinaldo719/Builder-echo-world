import { useState } from "react";
import { Bot, Settings, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import AISettings from "./AISettings";

interface AIHelperProps {
  currentVerse?: string;
  currentBook?: string;
  chapter?: number;
}

const AIHelper = ({ currentVerse, currentBook, chapter }: AIHelperProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([]);

  const handleSendQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const userMessage = question;
    setQuestion("");

    // Add user message to conversation
    setConversation((prev) => [
      ...prev,
      { type: "user", content: userMessage },
    ]);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = `Baseado em ${currentBook} ${chapter}, posso ajudar a explicar: "${currentVerse}". Esta passagem fala sobre...`;
      setConversation((prev) => [...prev, { type: "ai", content: aiResponse }]);
      setIsLoading(false);
    }, 2000);
  };

  const suggestedQuestions = [
    "Qual é o contexto histórico desta passagem?",
    "O que esta passagem significa para hoje?",
    "Como aplicar este versículo na vida prática?",
    "Há outras passagens relacionadas?",
  ];

  return (
    <Card className="border-l-3 border-l-sage-300 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-neutral-700 tracking-tight">
              Assistente IA
            </h3>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">Gemini</span>
            </div>
          </div>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 border-none">
              <DialogTitle className="sr-only">
                Configurações do Assistente IA
              </DialogTitle>
              <AISettings onClose={() => setShowSettings(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Conversation */}
        {conversation.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-sage-50 text-neutral-700 border border-sage-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-sage-50 text-neutral-700 border border-sage-200 rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">Pensando...</div>
                    <Bot className="h-3 w-3 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="Faça uma pergunta sobre este versículo ou capítulo..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendQuestion();
                }
              }}
              className="min-h-[80px] bg-white border-neutral-200 focus:border-sage-300 focus:ring-sage-100 rounded-lg resize-none"
            />
            <Button
              onClick={handleSendQuestion}
              disabled={!question.trim() || isLoading}
              className="self-end bg-blue-500 hover:bg-blue-600 text-white px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested Questions */}
          {conversation.length === 0 && (
            <div className="space-y-2">
              <span className="text-xs text-neutral-500">Sugestões:</span>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuestion(suggestion)}
                    className="text-left justify-start h-auto py-2 text-xs text-neutral-600 border-neutral-200 hover:bg-sage-50"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {currentVerse && (
          <div className="pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500">
              Contexto: {currentBook} {chapter}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIHelper;
