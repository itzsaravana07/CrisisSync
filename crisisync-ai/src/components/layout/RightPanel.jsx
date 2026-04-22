import { PropertyMap }        from '../dashboard/PropertyMap';
import { EvacuationProgress } from '../dashboard/EvacuationProgress';
import { AlertsBroadcast }    from '../dashboard/AlertsBroadcast';

export function RightPanel() {
  return (
    <aside className="w-80 shrink-0 bg-crisis-surface border-l border-crisis-border flex flex-col overflow-y-auto">
      <PropertyMap />
      <EvacuationProgress />
      <AlertsBroadcast />
    </aside>
  );
}
