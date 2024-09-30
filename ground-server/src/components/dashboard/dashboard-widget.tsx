import { forwardRef, type ReactNode, type MouseEvent, type TouchEvent, type CSSProperties } from 'react';

import { cn } from '@/lib/utils';


interface DashboardWidgetProps {
  style?: CSSProperties
  className?: string, 
  onMouseDown?: (event: MouseEvent) => void, 
  onMouseUp?: (event: MouseEvent) => void, 
  onTouchEnd?: (event: TouchEvent) => void, 
  children: ReactNode
}

export const DashboardWidget = forwardRef<HTMLDivElement, DashboardWidgetProps>(({
  style,
  className, 
  onMouseDown, 
  onMouseUp, 
  onTouchEnd, 
  children, 
}, ref) => {
  return (
    <div style={style} className={cn("border border-gray-200 rounded p-2", className)} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
      {children} 
    </div>
  );
})

DashboardWidget.displayName = 'DashboardWidget'; 
