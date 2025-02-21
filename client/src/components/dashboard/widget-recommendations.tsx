import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWidgetStore } from "./widget-store";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WIDGET_TITLES = {
  'node-monitor': 'Node Monitor',
  'network-status': 'Network Status',
  'system-resources': 'System Resources',
  'services': 'Services Monitor'
};

export function WidgetRecommendations() {
  const { getRecommendedWidgets, addWidget, widgets } = useWidgetStore();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    setRecommendations(getRecommendedWidgets());
  }, [widgets, getRecommendedWidgets]);

  if (recommendations.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Recommended Widgets</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((type) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      addWidget({
                        type: type as any,
                        title: WIDGET_TITLES[type as keyof typeof WIDGET_TITLES],
                        position: widgets.length,
                      });
                      setRecommendations(prev => prev.filter(t => t !== type));
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add {WIDGET_TITLES[type as keyof typeof WIDGET_TITLES]}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
