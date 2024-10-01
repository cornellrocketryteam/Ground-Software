import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { type Dispatch, type SetStateAction } from "react";
import { WidthProvider, Responsive, type Layout } from "react-grid-layout";
import { type Widget } from "@/lib/definitions";

import { WidgetHandle } from "./widget-handle";
import { DashboardWidget } from "./dashboard-widget";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export function Dashboard({
  widgets,
  setWidgets,
}: {
  widgets: Widget[];
  setWidgets: Dispatch<SetStateAction<Widget[]>>;
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
  };

  // TODO for performance improvement, find a way that widgets does not rely on layout (then we can memoize the children and avoid re-rendering)
  const children = widgets.map((widget) => {
    const deleteWidget = () =>
      setWidgets((prevWidgets) =>
        prevWidgets.filter((w) => w.layout.i !== widget.layout.i)
      );

    return (
      <DashboardWidget key={widget.layout.i} deleteWidget={deleteWidget}>
        {widget.children}
      </DashboardWidget>
    );
  });

  return (
    <div>
      <ResponsiveReactGridLayout
        className="layout"
        draggableCancel=".drag-ignore"
        layouts={{
          lg: widgets.map((widget) => widget.layout),
        }}
        cols={{ lg: 24, md: 20, sm: 14, xs: 10, xxs: 6 }}
        rowHeight={50}
        autoSize={false}
        onLayoutChange={onLayoutChange}
        resizeHandle={<WidgetHandle />}
      >
        {children}
      </ResponsiveReactGridLayout>
    </div>
  );
}
