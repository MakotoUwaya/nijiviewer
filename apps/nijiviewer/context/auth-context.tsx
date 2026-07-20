import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type PasskeyInfo = {
  id: string;
  friendly_name?: string;
  created_at: string;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Passkey methods
  signInWithPasskey: () => Promise<void>;
  registerPasskey: () => Promise<PasskeyInfo>;
  listPasskeys: () => Promise<PasskeyInfo[]>;
  updatePasskey: (id: string, friendlyName: string) => Promise<void>;
  deletePasskey: (id: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // セッションの初期化と認証状態の監視
    const initializeAuth = async () => {
      setIsLoading(true);

      // 現在のセッションを取得
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      // 認証状態の変更を監視
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

      setIsLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  // メールとパスワードでサインイン
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  // メールとパスワードで新規登録
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  // サインアウト
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Passkey でサインイン
  const signInWithPasskey = async () => {
    const { error } = await supabase.auth.signInWithPasskey();
    if (error) throw error;
  };

  // Passkey を登録
  const registerPasskey = async (): Promise<PasskeyInfo> => {
    const { data, error } = await supabase.auth.registerPasskey();
    if (error) throw error;
    return data;
  };

  // 登録済み Passkeys 一覧を取得
  const listPasskeys = async (): Promise<PasskeyInfo[]> => {
    const { data, error } = await supabase.auth.passkey.list();
    if (error) throw error;
    return data ?? [];
  };

  // Passkey のフレンドリー名を更新
  const updatePasskey = async (id: string, friendlyName: string) => {
    const { error } = await supabase.auth.passkey.update({
      passkeyId: id,
      friendlyName: friendlyName,
    });
    if (error) throw error;
  };

  // Passkey を削除
  const deletePasskey = async (id: string) => {
    const { error } = await supabase.auth.passkey.delete({ passkeyId: id });
    if (error) throw error;
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithPasskey,
    registerPasskey,
    listPasskeys,
    updatePasskey,
    deletePasskey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 認証コンテキストを使用するためのカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Provide a safe fallback for SSR where context isn't matched
    return {
      user: null,
      session: null,
      isLoading: true,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
      signInWithPasskey: async () => {},
      registerPasskey: async () => ({
        id: '',
        friendly_name: '',
        created_at: '',
      }),
      listPasskeys: async () => [],
      updatePasskey: async () => {},
      deletePasskey: async () => {},
    };
  }
  return context;
};
