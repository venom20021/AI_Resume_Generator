import { ResumeProvider } from "@/lib/resume-context";
import { ResumeBuilder } from "@/components/resume-builder";

export default function Home() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}
