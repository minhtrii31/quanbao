import { getSiteSettings } from "@/lib/settings";
import NavHeader from "./header/nav-header";

export default async function HeaderPublic() {
  const { company } = await getSiteSettings();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-[0_2px_12px_#25221105]">
      <NavHeader phone={company.phone} phoneRaw={company.phoneRaw} />
    </header>
  );
}
