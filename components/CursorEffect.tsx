"use client";

import { useEffect, useState } from "react";

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        !!target.closest('a, button, [class*="cursor-pointer"]')
      );
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Avoid hydration mismatch by not rendering until client has mounted
  if (!mounted) return <div className="pointer-events-none fixed inset-0 z-[100] opacity-0" />;

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <div className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Spotlight Glow */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(14, 165, 233, 0.08), transparent 80%)`
        }}
      />
      
      {/* Custom Cursor Dot */}
      <div 
        className={`absolute z-50 w-3 h-3 bg-electric-blue rounded-full transition-transform duration-75 ease-out shadow-[0_0_10px_rgba(14,165,233,0.5)] ${isPointer ? 'bg-white' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      />
      
      {/* Cursor Ring */}
      <div 
        className="absolute z-50 w-10 h-10 border border-electric-blue/40 rounded-full transition-transform duration-300 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 0.5 : 1})`,
          opacity: isPointer ? 0 : 1,
          transitionProperty: 'transform, opacity',
        }}
      />
    </div>
    </>
  );
}
