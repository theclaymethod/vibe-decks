import { TeamTemplate } from "@/templates";

export function Slide14Team() {
  return (
    <TeamTemplate
      eyebrow="The Team"
      title="Key Stakeholders"
      members={[
        { name: "Alex Chen", role: "Product Lead", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
        { name: "Sarah Kim", role: "Engineering", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face" },
        { name: "Mike Davis", role: "Design", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
        { name: "Emma Wilson", role: "Data Science", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face" },
      ]}
      columns={4}
      variant="light"
    />
  );
}
