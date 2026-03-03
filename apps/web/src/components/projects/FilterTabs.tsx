import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface FilterTabsProps {
  active: string;
  onChange: (tab: string) => void;
}

const TABS = ["All", "In Progress", "Validated"];

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <Tabs value={active} onValueChange={onChange}>
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
