import { useEffect, useState, useRef } from "react";
import { mergeData } from "@/utils/merge-utils";
import { fetchGTFS } from "@/utils/gtfs-fetch";
import { FileDataContext } from "./FileDataContext";
import { useTranslation } from "react-i18next";

const INACTIVITY_LIMIT = 60000;

const FileDataProvider = ({ children }) => {
  const [fileData, setFileData] = useState(null);
  const [isInactive, setIsInactive] = useState(false);

  const lastActiveRef = useRef(Date.now());
  const isTabVisibleRef = useRef(true);
  const isMountedRef = useRef(true);

  const { t } = useTranslation();

  useEffect(() => {
    const updateActivity = () => {
      lastActiveRef.current = Date.now();
      if (isInactive) setIsInactive(false);
    };

    const events = ["mousemove", "keydown", "scroll", "pointerdown", "pointermove"];

    events.forEach((event) => window.addEventListener(event, updateActivity));

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
    };
  }, [isInactive]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (isTabVisibleRef.current) {
        lastActiveRef.current = Date.now();
        if (isInactive) setIsInactive(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isInactive]);

  useEffect(() => {
    isMountedRef.current = true;

    const checkActivity = () => {
      if (!isMountedRef.current) return;

      const now = Date.now();
      const inactiveTime = now - lastActiveRef.current;

      if (inactiveTime >= INACTIVITY_LIMIT && !isInactive) {
        setIsInactive(true);
      }

      if (inactiveTime < INACTIVITY_LIMIT && isTabVisibleRef.current) {
        fetchGTFS().then(feed => {
          if (feed && isMountedRef.current) {
            mergeData(feed.entity).then(merged => {
              setFileData(merged);
            });
          }
        });
      }
    };

    checkActivity();
    const intervalId = setInterval(checkActivity, 20000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [isInactive]);

  return (
    <FileDataContext.Provider value={fileData}>
      {children}
      {isInactive && (
        <div style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(255, 69, 0, 0.9)",
          color: "white",
          padding: "10px 20px",
          borderRadius: 8,
          zIndex: 10000,
          fontWeight: "bold",
          pointerEvents: "none"
        }}>
          {t("inactiveapp")}
        </div>
      )}
    </FileDataContext.Provider>
  );
};

export default FileDataProvider;
