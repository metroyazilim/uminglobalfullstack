import SectionHeading from "./ui/SectionHeading";
import ProcessSteps from "./ProcessSteps";

export default function ProcessSection() {
  return (
    <>
      <SectionHeading
        eyebrow= "How we work"
        title= "Build, grow, scale"
        lead= "Four stages, one team. Each stage ends with something you can use, not a document."
      />
      <div className= "pt-10">
        <ProcessSteps />
      </div>
    </>
  );
}
