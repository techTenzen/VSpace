import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import Flashcard from "@/components/learning/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface FlashcardDeck {
  id: number;
  name: string;
  subject: string;
}

interface FlashcardItem {
  id: number;
  deckId: number;
  question: string;
  answer: string;
}

export default function LearningPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { data: decks = [], isLoading: decksLoading } = useQuery<FlashcardDeck[]>({
    queryKey: ["/api/flashcard-decks"],
  });

  const { data: cards = [], isLoading: cardsLoading } = useQuery<FlashcardItem[]>({
    queryKey: [`/api/flashcard-decks/${selectedDeckId}/cards`],
    enabled: selectedDeckId !== null,
  });

  // Set the first deck as selected when decks are loaded
  useEffect(() => {
    if (decks.length > 0 && selectedDeckId === null) {
      setSelectedDeckId(decks[0].id);
    }
  }, [decks, selectedDeckId]);

  // Reset card index when changing decks
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [selectedDeckId]);

  const handleDeckChange = (deckId: number) => {
    setSelectedDeckId(deckId);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Get current deck name
  const currentDeck = decks.find(deck => deck.id === selectedDeckId);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <MobileNav />
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Learning</h1>
            <p className="text-muted-foreground mt-2">
              Review flashcards for core subjects to strengthen your knowledge.
            </p>
          </div>

          {/* Deck Selector */}
          {decksLoading ? (
            <div className="mb-8">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="mb-8">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 p-1">
                  {decks.map((deck) => (
                    <Button
                      key={deck.id}
                      variant={selectedDeckId === deck.id ? "default" : "outline"}
                      className="px-4 py-2"
                      onClick={() => handleDeckChange(deck.id)}
                    >
                      {deck.subject}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}

          {/* Flashcard Section */}
          <div className="mb-8">
            {cardsLoading || !selectedDeckId ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-16">
                  <Skeleton className="h-64 w-full max-w-3xl" />
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Skeleton className="h-10 w-36" />
                </CardFooter>
              </Card>
            ) : cards.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-secondary border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">{currentDeck?.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8">
                    <Flashcard
                      question={cards[currentCardIndex].question}
                      answer={cards[currentCardIndex].answer}
                      onNext={handleNextCard}
                      onPrev={handlePrevCard}
                      canGoNext={currentCardIndex < cards.length - 1}
                      canGoPrev={currentCardIndex > 0}
                      currentIndex={currentCardIndex}
                      totalCards={cards.length}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                      Click on the card to flip it or use the controls below
                    </div>
                  </CardFooter>
                </Card>

                {/* Mobile Card Navigation */}
                <div className="mt-4 flex justify-between items-center md:hidden">
                  <Button
                    variant="outline"
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm">
                    {currentCardIndex + 1} / {cards.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextCard}
                    disabled={currentCardIndex === cards.length - 1}
                    className="flex items-center gap-1"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <h2 className="text-xl font-semibold mb-2">No Flashcards Available</h2>
                  <p className="text-muted-foreground text-center">
                    This deck doesn't have any flashcards yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Learning Tips */}
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle>Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active-recall">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="active-recall">Active Recall</TabsTrigger>
                  <TabsTrigger value="spaced-repetition">Spaced Repetition</TabsTrigger>
                </TabsList>
                <TabsContent value="active-recall" className="mt-4">
                  <div className="space-y-4">
                    <p>
                      <strong>Active recall</strong> is one of the most effective study techniques. It involves 
                      actively stimulating your memory during learning, rather than passively reading notes.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Try to answer the question before flipping the card</li>
                      <li>Explain the concept out loud as if teaching someone else</li>
                      <li>Write down your answer before checking</li>
                      <li>Create your own questions from study material</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="spaced-repetition" className="mt-4">
                  <div className="space-y-4">
                    <p>
                      <strong>Spaced repetition</strong> is a technique where you review material at 
                      increasing intervals over time, which helps move information into long-term memory.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Review new concepts within 24 hours of first learning them</li>
                      <li>Review again after 3 days, then 1 week, then 2 weeks</li>
                      <li>Focus more time on difficult concepts</li>
                      <li>Short, frequent study sessions are better than cramming</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
