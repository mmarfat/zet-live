import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button'; // Adjust the import path based on your project structure
import CustomControl from '../CustomControl'; // Ensure this path points to your CustomControl component
import { Clock, FilterIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

const CustomSearchControl = () => {
  const map = useMap();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [previousSearches, setPreviousSearches] = useState([
    { id: "11", type: "tram", name: "11", route: "Črnomerec - Dubec" },
    { id: "102", type: "bus", name: "102", route: "Savski most - Utrine" },
    { id: "13", type: "tram", name: "13", route: "Žitnjak - Kvaternikov trg" },
  ])


  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <CustomControl position="topleft">
      <div className="flex flex-1 gap-2 max-w-full sm:max-w-lg w-full transition-all duration-300">
        <div className="max-w-full sm:max-w-lg w-full">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              name="search"
              autoComplete="off"
              value={searchValue}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              onChange={handleInputChange}
              placeholder={t("ui.search")}
              className="rounded-2xl pl-10 w-full h-12 shadow-xl/20"
            />
          </div>
          {isOpen && (previousSearches.length > 0 || searchValue) && (
            <Card className="relative mt-2 w-full max-h-80 overflow-y-auto pt-0 pb-0">
              {previousSearches.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("search.previousSearches")}
                  </div>
                  {
                  previousSearches.slice(0, 5).map((route) => (
                    <button
                      key={`prev-${route.id}`}
                      //onClick={() => handleSearchSelect(route)}
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            route.type === "bus"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {route.type === "bus" ? "BUS" : "TRAM"}
                        </div>
                        <div>
                          <div className="font-medium">{route.name}</div>
                          <div className="text-sm text-muted-foreground">{route.route}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
        <Button
          size="icon"
          className="rounded-2xl h-12 w-12 shadow-xl/20"
        >
          <FilterIcon />
        </Button>
      </div>
    </CustomControl>
  );
};

export default CustomSearchControl;
