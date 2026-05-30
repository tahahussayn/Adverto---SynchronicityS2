"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();
 
  useEffect(() => {
    const checkConnection = async () => {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setStatus("error");
        setErrorMsg("Missing Supabase environment variables.");
        return;
      }
      
      try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (error) throw error;
        setStatus("connected");
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Failed to connect to Supabase.");
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-100">Admin Debug Dashboard</h1>
        
        <div className="bg-slate-950 rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">System Status</h2>
          
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${
              status === "checking" ? "bg-yellow-400 animate-pulse" :
              status === "connected" ? "bg-green-500" : "bg-red-500"
            }`}></div>
            <div>
              <p className="font-medium text-slate-100">Supabase Connection</p>
              <p className="text-sm text-white">
                {status === "checking" && "Verifying connection..."}
                {status === "connected" && "Connected successfully to project."}
                {status === "error" && `Error: ${errorMsg}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Environment Setup Instructions</h2>
          <ol className="list-decimal pl-5 space-y-3 text-slate-100 text-sm">
            <li>Ensure you have run the <code className="bg-slate-900 px-1 rounded text-slate-100">0001_initial_schema.sql</code> script in your Supabase SQL Editor.</li>
            <li>Copy <code className="bg-slate-900 px-1 rounded text-slate-100">.env.local.example</code> to <code className="bg-slate-900 px-1 rounded text-slate-100">.env.local</code> and fill in your API keys.</li>
            <li>Verify the RLS policies and Realtime publications are enabled correctly.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
