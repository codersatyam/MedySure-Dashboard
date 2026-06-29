import { KpiCards } from "./KpiCards";
import { Widgets } from "./Widgets";
import { ActivityFeed } from "./ActivityFeed";

/** Composes the operational overview dashboard from its data-driven widgets. */
export function OverviewPage() {
  return (
    <div className="space-y-8">
      <KpiCards />
      <Widgets />
      <ActivityFeed />
    </div>
  );
}
