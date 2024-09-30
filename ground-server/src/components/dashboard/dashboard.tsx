import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";
import { type Widget } from '@/lib/definitions';

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
        layouts={{
          lg: widgets.map((widget) => widget.layout)
        }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        autoSize={false}
        onLayoutChange={onLayoutChange}
      >
        {children}
      </ResponsiveReactGridLayout>
    </div>
  )
}