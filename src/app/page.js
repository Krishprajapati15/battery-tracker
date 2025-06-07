import BatteryDisplay from "../components/BatteryDisplay";
import { ToastContainer } from "../components/ui/toast";

export default function Home() {
  return (
    <>
      <BatteryDisplay />
      <ToastContainer />
    </>
  );
}
