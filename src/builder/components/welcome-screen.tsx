import { useNavigate } from "@tanstack/react-router";

const ONBOARDING_KEY = "pls-fix-onboarding-complete";

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

export function completeOnboarding(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
}

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const navigate = useNavigate();

  const handleCreateDesignSystem = () => {
    completeOnboarding();
    navigate({ to: "/builder/create-design-system" });
  };

  const handleExploreExamples = () => {
    completeOnboarding();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Welcome to pls-fix
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Build beautiful slide decks with AI. Start by creating a design system
            that defines your colors, typography, and visual personality — then
            create slides that use it.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCreateDesignSystem}
            className="w-full px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Create Your Design System
          </button>
          <button
            onClick={handleExploreExamples}
            className="w-full px-6 py-3 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Explore Example Deck
          </button>
        </div>

        <p className="text-xs text-neutral-400">
          The example deck shows what's possible. You can clear it anytime and start fresh.
        </p>
      </div>
    </div>
  );
}
