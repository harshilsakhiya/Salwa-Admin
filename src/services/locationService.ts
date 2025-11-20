import { apiRequest } from "./httpClient";

const BASE_URL = "https://apisalwa.rushkarprojects.in/api/Account";

export interface LookupOption {
  id: number;
  name: string;
}

const mapOptions = (payload: unknown): LookupOption[] => {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const maybeId =
          (item as { id?: number; countryId?: number; stateId?: number }).id ??
          (item as { countryId?: number }).countryId ??
          (item as { stateId?: number }).stateId;
        const maybeName =
          (
            item as {
              name?: string;
              countryName?: string;
              stateName?: string;
              cityName?: string;
            }
          ).name ??
          (item as { countryName?: string }).countryName ??
          (item as { stateName?: string }).stateName ??
          (item as { cityName?: string }).cityName;
        if (typeof maybeId === "number" && typeof maybeName === "string") {
          return { id: maybeId, name: maybeName };
        }
        return null;
      })
      .filter((item): item is LookupOption => Boolean(item));
  }

  const data =
    (payload as { data?: unknown })?.data ??
    (payload as { result?: unknown })?.result;
  if (Array.isArray(data)) {
    return mapOptions(data);
  }

  return [];
};

export const fetchCountries = async () => {
  const response = await apiRequest<unknown>(`${BASE_URL}/GetAllCountry`, {
    method: "GET",
  });
  return mapOptions(response);
};

export const fetchStates = async (countryId: number) => {
  if (!countryId) {
    return [];
  }
  const response = await apiRequest<unknown>(
    `${BASE_URL}/GetAllState?countryId=${encodeURIComponent(countryId)}`,
    { method: "GET" }
  );
  return mapOptions(response);
};

export const fetchCities = async (countryId: number, stateId: number) => {
  if (!countryId || !stateId) {
    return [];
  }
  const response = await apiRequest<unknown>(
    `${BASE_URL}/GetAllCity?countryId=${encodeURIComponent(
      countryId
    )}&stateId=${encodeURIComponent(stateId)}`,
    { method: "GET" }
  );
  return mapOptions(response);
};
