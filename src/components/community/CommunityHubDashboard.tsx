import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import ArcNav from "./ArcNav";

// Lokale Kategorien und Subkategorien
const categories = [
  { key: "creators", label: "Creators", to: "/community?tab=creators", side: "left" },
  { key: "scans", label: "Scans", to: "/community?tab=scans", side: "left" },
  { key: "predictions", label: "Predictions", to: "/community?tab=predictions", side: "left" },
  { key: "news", label: "News", to: "/community?tab=news", side: "right" },
  { key: "feedback", label: "Feedback", to: "/community?tab=feedback", side: "right" },
];

const subcategories = {
  creators: [
    { key: "streamers", label: "Streamers", to: "/community?tab=creators&sub=streamers" },
    { key: "youtubers", label: "YouTubers", to: "/community?tab=creators&sub=youtubers" },
  ],
  scans: [
    { key: "uploads", label: "Uploads", to: "/community?tab=scans&sub=uploads" },
    { key: "downloads", label: "Downloads", to: "/community?tab=scans&sub=downloads" },
  ],
  predictions: [
    { key: "votes", label: "Votes", to: "/community?tab=predictions&sub=votes" },
    { key: "tipps", label: "Tipps", to: "/community?tab=predictions&sub=tipps" },
  ],
  news: [
    { key: "updates", label: "Updates", to: "/community?tab=news&sub=updates" },
    { key: "announcements", label: "Announcements", to: "/community?tab=news&sub=announcements" },
  ],
  feedback: [
    { key: "bugreports", label: "Bugreports", to: "/community?tab=feedback&sub=bugreports" },
    { key: "features", label: "Feature Requests", to: "/community?tab=feedback&sub=features" },
  ],
};

type Props = {
  logoSrc: string;
};

const CommunityHubDashboard: React.FC<Props> = ({ logoSrc }) => {
  const [params] = useSearchParams();
  const activeTab = params.get("tab") || null;

  const leftCats = useMemo(() => categories.filter(c => c.side === "left"), [categories]);
  const rightCats = useMemo(() => categories.filter(c => c.side === "right"), [categories]);

  const activeSub = activeTab ? subcategories[activeTab] ?? [] : [];
  const anchorSide = categories.find(c => c.key === activeTab)?.side ?? "right";

  // === exakte Zentrierung: Versatz aus realer Logo-Breite berechnen ===
  const logoRef = useRef<HTMLImageElement | null>(null);
  const [arcOffset, setArcOffset] = useState<number>(220);   // Fallback
  const [outerOffset, setOuterOffset] = useState<number>(440);

  useEffect(() => {
    const calc = () => {
      const w = logoRef.current?.offsetWidth ?? 380;          // geschätzte Breite
      const half = w / 2;
      const gap  = 60;                                        // Abstand zwischen Logo & Haupticons
      const mainOffset = Math.round(half + gap);
      const subOffset  = Math.round(mainOffset + 220);        // Sub außerhalb der Main-Bögen
      setArcOffset(mainOffset);
      setOuterOffset(subOffset);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <div className={styles.wrap}>
      {/* Zentrum: Logo (mit Link zurück zum Default-Index /community) */}
      <div className={styles.centerLogoWrap}>
        <Link to="/community" className={styles.centerLogoLink} aria-label="Community Hub Home">
          <img ref={logoRef} src={logoSrc} alt="Community Hub" className={styles.centerLogo} />
        </Link>
      </div>

      {/* Linker Halbkreis (Hauptkategorien) */}
      <ArcNav
        items={leftCats.map(c => ({ key: c.key, to: c.to, label: c.label, icon: c.icon }))}
        side="left"
        variant="main"
        arcOffset={arcOffset}
      />

      {/* Rechter Halbkreis (Hauptkategorien) */}
      <ArcNav
        items={rightCats.map(c => ({ key: c.key, to: c.to, label: c.label, icon: c.icon }))}
        side="right"
        variant="main"
        arcOffset={arcOffset}
      />

      {/* Unterkategorien – außen andocken, bleiben offen wenn tab aktiv */}
      {activeSub.length > 0 && (
        <ArcNav
          items={activeSub.map(s => ({ key: s.key, to: s.to, label: s.label, icon: s.icon }))}
          side="sub"
          anchorSide={anchorSide}
          compact
          variant="sub"
          outerOffset={outerOffset}
        />
      )}
    </div>
  );
};

export default CommunityHubDashboard;
