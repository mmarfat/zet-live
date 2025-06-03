import { useEffect, useState, useRef } from 'react';
import { FileDataContext } from './FileDataContext';
import { useTranslation } from 'react-i18next';

const INACTIVITY_LIMIT = 60000;

const FileDataProvider = ({ children }) => {
  const [fileData, setFileData] = useState([]);
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

    const events = ['mousemove', 'keydown', 'scroll', 'pointerdown', 'pointermove'];
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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    };

    checkActivity();
    const intervalId = setInterval(checkActivity, 10000);

    if (isInactive) {
      return () => {
        clearInterval(intervalId);
        isMountedRef.current = false;
      };
    }

    const socketUrl = `wss://zet-live.xyz`
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (isMountedRef.current) {
          setFileData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Invalid JSON from WebSocket:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed: ${event.reason}`);
      if (!isInactive) {
        setTimeout(() => {
          if (isMountedRef.current && !isInactive) {
            setFileData((prev) => prev);
          }
        }, 10000);
      }
    };

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
      socket.close();
    };
  }, [isInactive]);

  return (
    <FileDataContext.Provider value={fileData}>
      {children}
      {isInactive && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 transform bg-orange-600/90 text-white px-5 py-2.5 rounded z-[10000] font-bold pointer-events-none">
          {t('inactiveapp')}
        </div>
      )}
    </FileDataContext.Provider>
  );
};

export default FileDataProvider;
