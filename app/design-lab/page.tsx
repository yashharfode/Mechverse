import { Metadata } from "next";
import DesignLabWorkspace from "@/components/design-lab/DesignLabWorkspace";

export const metadata: Metadata = {
  title: "Design Lab — MECHVERSE",
  description:
    "Don't just explore machines. Make them your own. Modify components, colors, materials, and configurations in real-time 3D CAD.",
};

export default function DesignLabPage() {
  return <DesignLabWorkspace />;
}
