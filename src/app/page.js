import BatteryDisplay from "../components/BatteryDisplay";
import ThemeHeader from "../components/ThemeHeader";
import { ToastContainer } from "../components/ui/toast";

export default function Home() {
  return (
    <div className="fixed inset-0 w-full h-full bg-background text-foreground select-none">
      <ThemeHeader />
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <BatteryDisplay />
        <ToastContainer />
      </div>
    </div>
  );
}
