import { Input } from "@heroui/react";
import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useDeferredValue, useState } from "react";

export function UserSearchInput() {
  const routeApi = getRouteApi("/");
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const [value, setValue] = useState(search.q);
  const deferredValue = useDeferredValue(value);

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);

      navigate({
        search: (prev) => ({
          ...prev,
          q: newValue,
          skip: 0,
        }),
      });
    },
    [navigate],
  );

  const handleClear = useCallback(() => {
    setValue("");
    navigate({ search: (prev) => ({ ...prev, q: "", skip: 0 }) });
  }, [navigate]);

  return (
    <Input
      classNames={{ base: "max-w-md" }}
      isClearable
      onClear={handleClear}
      onValueChange={handleValueChange}
      placeholder="ユーザーを検索..."
      startContent={<span className="pointer-events-none text-default-400">&#x1F50D;</span>}
      type="search"
      value={deferredValue}
    />
  );
}
