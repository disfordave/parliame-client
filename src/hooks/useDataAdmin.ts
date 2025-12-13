/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  createChamber,
  createCountry,
  createParty,
  createPoll,
  getChambers,
  getCountries,
  getCountryParties,
  getPollDetails,
  getPolls,
  getUser,
} from "../lib/apiClient";
import { useParties, useSelectedParties } from "../lib/zustandStore";
import type {
  Chamber,
  Country,
  CountryParty,
  CreateChamberPayload,
  CreateCountryPayload,
  CreatePartyPayload,
  CreatePollPayload,
  LoadingKey,
  LoadingState,
  PollResultInput,
  PollSummary,
  User,
} from "../types/dataAdmin";

export function useDataAdmin() {
  const { parties, setParties } = useParties();
  const { setSelectedParties } = useSelectedParties();

  const [user, setUser] = useState<User | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryParties, setCountryParties] = useState<CountryParty[]>([]);
  const [chambers, setChambers] = useState<Chamber[]>([]);
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(null);
  const [polls, setPolls] = useState<PollSummary[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<PollSummary | null>(null);
  const [newPollResults, setNewPollResults] = useState<PollResultInput[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    countries: false,
    parties: false,
    chambers: false,
    polls: false,
  });

  const updateLoading = useCallback((key: LoadingKey, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApiError = useCallback((error: unknown, fallbackMessage: string) => {
    const message = error instanceof Error ? error.message : fallbackMessage;
    setErrorMessage(message);
    console.error(error);
  }, []);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      setErrorMessage(null);
      updateLoading("countries", true);
      try {
        const data = await getCountries();
        if (!active) return;
        setCountries(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load countries.");
        }
      } finally {
        if (active) {
          updateLoading("countries", false);
        }
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, [handleApiError, updateLoading]);

  useEffect(() => {
    if (!selectedCountry) {
      setCountryParties([]);
      return;
    }

    let active = true;

    const loadParties = async () => {
      updateLoading("parties", true);
      try {
        const data = await getCountryParties(selectedCountry.code);
        if (!active) return;
        setCountryParties(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load parties for this country.");
        }
      } finally {
        if (active) {
          updateLoading("parties", false);
        }
      }
    };

    loadParties();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedCountry, updateLoading]);

  useEffect(() => {
    if (!selectedCountry) {
      setChambers([]);
      return;
    }

    let active = true;

    const loadChambers = async () => {
      updateLoading("chambers", true);
      try {
        const data = await getChambers(selectedCountry.code);
        if (!active) return;
        setChambers(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load chambers.");
        }
      } finally {
        if (active) {
          updateLoading("chambers", false);
        }
      }
    };

    loadChambers();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedCountry, updateLoading]);

  useEffect(() => {
    if (!selectedChamber) {
      setPolls([]);
      return;
    }

    let active = true;

    const loadPolls = async () => {
      updateLoading("polls", true);
      try {
        const data = await getPolls(selectedChamber.id);
        if (!active) return;
        setPolls(data);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load polls.");
        }
      } finally {
        if (active) {
          updateLoading("polls", false);
        }
      }
    };

    loadPolls();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedChamber, updateLoading]);

  useEffect(() => {
    if (!selectedPoll) {
      setParties([]);
      setSelectedParties([]);
      return;
    }

    let active = true;

    const loadPollDetails = async () => {
      try {
        const data = await getPollDetails(selectedPoll.id);
        if (!active) return;
        const partyData = data.results.map((item) => ({
          name: item.party.name,
          shortName: item.party.shortName,
          seats: item.seats,
          colour: item.party.colour ?? "#999999",
          position: item.party.position,
          isIndependent: false,
        }));
        setParties(partyData);
        setSelectedParties(partyData);
      } catch (error) {
        if (active) {
          handleApiError(error, "Failed to load poll results.");
        }
      }
    };

    loadPollDetails();

    return () => {
      active = false;
    };
  }, [handleApiError, selectedPoll, setParties, setSelectedParties]);

  const selectCountry = useCallback(
    (country: Country) => {
      setSelectedCountry(country);
      setSelectedChamber(null);
      setSelectedPoll(null);
      setChambers([]);
      setPolls([]);
      setCountryParties([]);
      setNewPollResults([]);
      setParties([]);
      setSelectedParties([]);
    },
    [setParties, setSelectedParties],
  );

  const selectChamber = useCallback(
    (chamber: Chamber) => {
      setSelectedChamber(chamber);
      setSelectedPoll(null);
      setPolls([]);
      setNewPollResults([]);
      setParties([]);
      setSelectedParties([]);
    },
    [setParties, setSelectedParties],
  );

  const selectPoll = useCallback((poll: PollSummary) => {
    setSelectedPoll(poll);
  }, []);

  const handleSeatChange = useCallback((partyId: string, seats: number) => {
    setNewPollResults((prev) => {
      if (!Number.isFinite(seats) || seats < 0) {
        return prev.filter((item) => item.partyId !== partyId);
      }

      const exists = prev.some((item) => item.partyId === partyId);
      return exists
        ? prev.map((item) =>
            item.partyId === partyId ? { ...item, seats } : item,
          )
        : [...prev, { partyId, seats }];
    });
  }, []);

  const handleAddCountry = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload: CreateCountryPayload = {
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        emoji: (formData.get("emoji") as string) || undefined,
      };

      try {
        setErrorMessage(null);
        const addedCountry = await createCountry(payload);
        setCountries((prev) => [...prev, addedCountry]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add country.");
      }
    },
    [handleApiError],
  );

  const handleAddParty = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedCountry) {
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const colour = (formData.get("colour") as string) || "";

      if (colour && !colour.startsWith("#")) {
        alert("Colour must be a valid hex code starting with #");
        return;
      }

      const payload: CreatePartyPayload = {
        name: formData.get("name") as string,
        shortName: formData.get("shortName") as string,
        colour,
        position: Number(formData.get("position")),
        country: selectedCountry.code,
      };

      try {
        setErrorMessage(null);
        const addedParty = await createParty(payload);
        setCountryParties((prev) => [...prev, addedParty]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add party.");
      }
    },
    [handleApiError, selectedCountry],
  );

  const handleAddChamber = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedCountry) {
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload: CreateChamberPayload = {
        name: formData.get("name") as string,
        country: selectedCountry.code,
        shortName: (formData.get("shortName") as string) || undefined,
        totalSeats: Number(formData.get("totalSeats")),
      };

      try {
        setErrorMessage(null);
        const addedChamber = await createChamber(payload);
        setChambers((prev) => [...prev, addedChamber]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add chamber.");
      }
    },
    [handleApiError, selectedCountry],
  );

  const handleAddPoll = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedCountry || !selectedChamber) {
        return;
      }

      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload: CreatePollPayload = {
        name: formData.get("name") as string,
        date: formData.get("date") as string,
        country: selectedCountry.code,
        chamber: selectedChamber.id,
        type: "election",
        results: newPollResults,
      };

      try {
        setErrorMessage(null);
        const addedPoll = await createPoll(payload);
        setPolls((prev) => [...prev, addedPoll]);
        setNewPollResults([]);
        form.reset();
      } catch (error) {
        handleApiError(error, "Unable to add poll.");
      }
    },
    [handleApiError, newPollResults, selectedChamber, selectedCountry],
  );

  return {
    user,
    parties,
    errorMessage,
    loading,
    countries,
    selectedCountry,
    selectCountry,
    handleAddCountry,
    countryParties,
    handleAddParty,
    chambers,
    selectedChamber,
    selectChamber,
    handleAddChamber,
    polls,
    selectedPoll,
    selectPoll,
    handleAddPoll,
    handleSeatChange,
  };
}
