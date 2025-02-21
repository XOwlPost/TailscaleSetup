import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Widget {
  id: string;
  type: 'node-monitor' | 'network-status' | 'system-resources' | 'services';
  title: string;
  config?: Record<string, any>;
  position: number;
  lastInteraction?: string;
  interactionCount?: number;
}

interface WidgetStore {
  widgets: Widget[];
  addWidget: (widget: Omit<Widget, "id">) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: number) => void;
  updateWidgetConfig: (id: string, config: Record<string, any>) => void;
  recordInteraction: (id: string) => void;
  getRecommendedWidgets: () => Widget['type'][];
}

const COMMON_COMBINATIONS = [
  ['node-monitor', 'network-status'],
  ['system-resources', 'services'],
  ['node-monitor', 'services', 'network-status'],
];

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set, get) => ({
      widgets: [],
      addWidget: (widget) => set((state) => ({
        widgets: [...state.widgets, { 
          ...widget, 
          id: Math.random().toString(36).slice(2),
          interactionCount: 0,
        }]
      })),
      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter((w) => w.id !== id)
      })),
      updateWidgetPosition: (id, position) => set((state) => ({
        widgets: state.widgets.map((w) => 
          w.id === id ? { ...w, position } : w
        )
      })),
      updateWidgetConfig: (id, config) => set((state) => ({
        widgets: state.widgets.map((w) =>
          w.id === id ? { ...w, config: { ...w.config, ...config } } : w
        )
      })),
      recordInteraction: (id) => set((state) => ({
        widgets: state.widgets.map((w) =>
          w.id === id ? { 
            ...w, 
            lastInteraction: new Date().toISOString(),
            interactionCount: (w.interactionCount || 0) + 1
          } : w
        )
      })),
      getRecommendedWidgets: () => {
        const state = get();
        const existingTypes = new Set(state.widgets.map(w => w.type));
        const recommendations: Widget['type'][] = [];

        // Check for common combinations
        for (const combination of COMMON_COMBINATIONS) {
          const missing = combination.filter(type => !existingTypes.has(type));
          if (missing.length > 0 && combination.some(type => existingTypes.has(type))) {
            recommendations.push(...missing);
          }
        }

        // Add essential widgets if missing
        const essentialWidgets: Widget['type'][] = ['node-monitor', 'network-status'];
        for (const widget of essentialWidgets) {
          if (!existingTypes.has(widget)) {
            recommendations.push(widget);
          }
        }

        // Remove duplicates and limit to 3 recommendations
        return [...new Set(recommendations)].slice(0, 3);
      }
    }),
    {
      name: 'dashboard-widgets'
    }
  )
);