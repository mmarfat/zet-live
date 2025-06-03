import { useState, useMemo } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { useFileData } from '@/contexts/FileDataContext/FileDataContext';
import Fuse from 'fuse.js';
import TypeAvatar from './TypeAvatar';
import { FIELD_MAP } from '@/utils/fieldMap';

const CustomSearchControl = ({ onSelect }) => {
  
  // States, refs, hooks...
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState([]);
  const { fileData } = useFileData();

  // Handlers
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchResults(searchWithFallback(value));
    setIsOpen(Boolean(value))
  };

  const handleSearchSelect = (item) => {
    setSearchValue(`${item?.[FIELD_MAP.routeLongName] ?? ''}, ${item?.[FIELD_MAP.routeId] ?? ''}`);
    setIsOpen(false);
    onSelect(item?.[FIELD_MAP.id]);
  }
  
  // Utils
  const fuse = useMemo(() => {
    if (!fileData) return null;

    return new Fuse(fileData, {
      keys: [FIELD_MAP.routeId, FIELD_MAP.routeLongName],
      threshold: 1,
      ignoreLocation: true
    });
  }, [fileData]);

  const searchWithFallback = (query, limit = 10) => {
    if (!fuse || !query) return [];
    
    const results = fuse.search(query).slice(0, limit).map(r => r.item);

    return results;
  };

  const renderSearchItem = (item) => (
    <div className="flex items-center gap-3">
      <TypeAvatar type={item?.[FIELD_MAP.routeType]} />
      <div>
        <div className="font-medium">{item?.[FIELD_MAP.routeId]}</div>
        <div className="text-sm text-muted-foreground">{item?.[FIELD_MAP.routeLongName]}</div>
      </div>
    </div>
  )

  return (
    <div className="pt-2.5 pointer-events-auto flex flex-col w-full sm:w-md transition-[width] ease-in-out duration-300 touch-manipulation">
      <div className="pl-2.5 pr-2.5 flex flex-1 w-full gap-2 sm:w-md">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            name="search"
            autoComplete="off"
            value={searchValue}
            onFocus={() => setIsOpen(Boolean(searchValue))}
            onBlur={() => setIsOpen(false)}
            onChange={handleInputChange}
            placeholder={t("ui.search")}
            className="rounded-2xl pl-10 w-full h-12 shadow-xl/20"
          />
        </div>
      </div>
      {isOpen && (
        <div className="pl-2.5 pr-2.5 flex flex-1 w-full sm:w-md">
          <Card
            className="mt-2 w-full max-h-80 pt-0 pb-0 touch-manipulation"
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col overflow-y-hidden">
              <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b rounded-t-md bg-card sticky">
                {t("search.searchResults")}
              </div>

              <div className="overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={item?.[FIELD_MAP.id]}
                    onMouseDown={() => handleSearchSelect(item)}
                    className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                  >
                    {renderSearchItem(item)}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomSearchControl;

