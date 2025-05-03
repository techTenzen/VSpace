import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

interface FlashcardProps {
  question: string;
  answer: string;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  currentIndex: number;
  totalCards: number;
}

export default function Flashcard({
  question,
  answer,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  currentIndex,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrev = () => {
    setIsFlipped(false);
    onPrev();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl aspect-[3/2] perspective-1000 relative mb-8">
        <motion.div
          className={cn(
            "w-full h-full relative preserve-3d transition-transform duration-500 rounded-xl cursor-pointer",
            isFlipped ? "rotate-y-180" : ""
          )}
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Front (Question) */}
          <Card className="absolute w-full h-full backface-hidden rounded-xl shadow-xl border-2 border-accent/20">
            <CardContent className="flex flex-col justify-center items-center h-full p-8">
              <div className="absolute top-4 right-4 text-sm text-muted-foreground">
                {currentIndex + 1}/{totalCards}
              </div>
              <p className="text-2xl md:text-3xl font-medium text-center">
                {question}
              </p>
              <p className="mt-4 text-muted-foreground text-center">Click to see answer</p>
            </CardContent>
          </Card>

          {/* Back (Answer) */}
          <Card className="absolute w-full h-full backface-hidden rounded-xl shadow-xl border-2 border-primary/20 rotate-y-180">
            <CardContent className="flex flex-col justify-center h-full p-8 overflow-auto">
              <div className="absolute top-4 right-4 text-sm text-muted-foreground">
                {currentIndex + 1}/{totalCards}
              </div>
              <p className="text-xl md:text-2xl text-center">
                {answer}
              </p>
              <p className="mt-4 text-muted-foreground text-center">Click to see question</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="h-10 w-10"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous card</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleFlip}
          className="h-10 w-10"
        >
          <RotateCw className="h-5 w-5" />
          <span className="sr-only">Flip card</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={!canGoNext}
          className="h-10 w-10"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next card</span>
        </Button>
      </div>
    </div>
  );
}
