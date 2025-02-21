import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Shield, Network, ArrowRight, Cpu } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  icon: JSX.Element;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Tailscale Manager! 👋",
    description: "Let's take a quick tour of your new infrastructure management dashboard.",
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
  },
  {
    title: "Monitor Node Health 🖥️",
    description: "Watch your nodes' CPU, memory, and network status in real-time with animated health indicators.",
    icon: <Cpu className="w-8 h-8 text-primary" />,
    highlight: "node-monitor"
  },
  {
    title: "Network Status 🌐",
    description: "Keep track of your Tailscale network connectivity and packet loss with live updates.",
    icon: <Network className="w-8 h-8 text-primary" />,
    highlight: "network-status"
  },
  {
    title: "Access Control 🔐",
    description: "Manage roles and permissions to keep your infrastructure secure.",
    icon: <Shield className="w-8 h-8 text-primary" />,
    highlight: "role-manager"
  }
];

export function TourGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    const toured = localStorage.getItem("tourCompleted");
    if (!toured) {
      setIsOpen(true);
      setHasSeenTour(false);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOpen(false);
      localStorage.setItem("tourCompleted", "true");
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem("tourCompleted", "true");
  };

  if (hasSeenTour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <div className="flex items-center gap-4">
                {tourSteps[currentStep].icon}
                <DialogTitle className="text-xl">
                  {tourSteps[currentStep].title}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="py-6">
              <p className="text-muted-foreground">
                {tourSteps[currentStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            {Array.from({ length: tourSteps.length }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
