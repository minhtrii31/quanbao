import NavHeader from "./header/nav-header";
import TopHeader from "./header/top-header";

export default function HeaderPublic() {
  return (
    <>
      <header className="w-full">
        <div className="mx-auto w-full max-w-7xl">
          <TopHeader />
        </div>
        <div className="w-full border-t border-border" />
      </header>
      <NavHeader />
    </>
  );
}
