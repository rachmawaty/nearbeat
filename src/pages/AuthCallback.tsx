import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const TOKEN_KEY = "nb_token";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      navigate("/", { replace: true });
    } else if (error) {
      navigate(`/?auth_error=${error}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Signing you in…
        </div>
      </div>
    </div>
  );
}
