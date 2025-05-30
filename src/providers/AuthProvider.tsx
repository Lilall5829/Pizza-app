import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const previousSessionRef = useRef<Session | null>(null);

  // 获取用户 profile 的函数
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("Initial session:", session);
      setSession(session);
      previousSessionRef.current = session;

      if (session) {
        // 获取用户 profile
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        console.log("Profile loaded:", profileData);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    fetchSession();

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      const previousSession = previousSessionRef.current;

      setSession(session);
      previousSessionRef.current = session;

      if (session) {
        // 每次认证状态变化时都重新获取 profile
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        console.log("Profile refreshed:", profileData);

        // 只在从无会话状态变为有会话状态时显示成功消息
        // 这样避免了页面刷新时也显示成功消息
        if (!previousSession && event === "SIGNED_IN") {
          toast.success("Successfully signed in!");
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // 清理订阅
    return () => subscription.unsubscribe();
  }, []);

  console.log("Current auth state:", {
    userEmail: session?.user?.email,
    userRole: profile?.group,
    isAdmin: profile?.group === "ADMIN",
  });

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
        isAdmin: profile?.group === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
