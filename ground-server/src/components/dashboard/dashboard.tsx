import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";
import { type Widget } from '@/lib/definitions';

import { WidgetHandle } from './widget-handle';
import { DashboardWidget } from './dashboard-widget';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export function Dashboard({ 
  widgets,
  setWidgets,
}: {
  widgets: Widget[], 
  setWidgets: Dispatch<SetStateAction<Widget[]>>
}) {
  const onLayoutChange = (layout: Layout[]) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) => {
        const updatedLayout = layout.find((l) => l.i === widget.layout.i);
        if (updatedLayout) {
          return { ...widget, layout: updatedLayout };
        }
        return widget;
      })
    );
  }

  const children = useMemo(() => {
    return widgets.map(widget => (
      <DashboardWidget key={widget.layout.i}>
        {widget.children}
      </DashboardWidget>
    ))
  }, [widgets]);

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        draggableCancel='.widget-handle'
        layouts={{
          lg: widgets.map((widget) => widget.layout)
        }}
        cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
        rowHeight={50}
        autoSize={false}
        onLayoutChange={onLayoutChange}
        resizeHandle={<WidgetHandle />}
      >
        {children}
      </ResponsiveReactGridLayout>
    </div>
  )
}