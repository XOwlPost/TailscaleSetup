import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Widget {
  id: string;
  type: 'node-monitor' | 'network-status' | 'system-resources' | 'services';
  title: string;
  config?: Record<string, any>;
  position: number;
}

interface WidgetStore {
  widgets: Widget[];
  addWidget: (widget: Omit<Widget, "id">) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: number) => void;
  updateWidgetConfig: (id: string, config: Record<string, any>) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: [],
      addWidget: (widget) => set((state) => ({
        widgets: [...state.widgets, { ...widget, id: Math.random().toString(36).slice(2) }]
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
      }))
    }),
    {
      name: 'dashboard-widgets'
    }
  )
);
