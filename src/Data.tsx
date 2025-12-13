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

import type { ReactNode } from "react";
import { Link } from "react-router";
import { useDataAdmin } from "./hooks/useDataAdmin";
import { API_BASE, logoutUser } from "./lib/apiClient";
import type { User } from "./types/dataAdmin";

const inputClassNames =
  "me-2 my-1 rounded-md border border-gray-300 p-1 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400";

const buttonClassNames =
  "rounded-full bg-violet-600 px-2 py-1 text-white dark:bg-violet-400";

const SectionCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`mb-4 overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900 ${className ?? ""}`}
  >
    <h2 className="mb-2 text-xl font-bold">{title}</h2>
    {children}
  </div>
);

const UserInformationPanel = ({ user }: { user: User | null }) => {
  const handleLogoutClick = async () => {
    await logoutUser();
    window.location.href = "/data";
  };

  if (!user) {
    return (
      <div className="text-center">
        <a href={`${API_BASE}/auth/github`} className={buttonClassNames}>
          Login with GitHub
        </a>
      </div>
    );
  }

  const hasEditAccess = user.role === "admin" || user.role === "editor";

  return (
    <div className="text-center">
      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt="User Avatar"
          className="mx-auto mb-2 size-20 rounded-full"
        />
      )}
      <h2 className="text-lg">
        Welcome, <span className="font-medium">{user.username}</span>
      </h2>
      {hasEditAccess ? (
        <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">
          Role: {user.role.toUpperCase()} (You have edit access)
        </p>
      ) : (
        <p className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
          Role: {user.role.toUpperCase()} (You have view-only access)
        </p>
      )}
      <button onClick={handleLogoutClick} className={buttonClassNames}>
        Logout
      </button>
    </div>
  );
};

export default function Data() {
  const {
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
  } = useDataAdmin();

  return (
    <div>
      <div className="mt-4 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[14.5fr_5.5fr]">
        <div className="">
          {errorMessage && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-950">
              {errorMessage}
            </div>
          )}
          <div className="mb-4 block lg:hidden">
            <SectionCard title="User Information" className="mb-0">
              <UserInformationPanel user={user} />
            </SectionCard>
          </div>
          <div>
            <SectionCard title="Countries & Regions">
              {user && (
                <>
                  <h3 className="my-1 text-lg font-medium">Add new country</h3>
                  <form onSubmit={handleAddCountry}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Country name"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="code"
                      placeholder="Country code"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="emoji"
                      placeholder="Emoji"
                      className={inputClassNames}
                    />
                    <button type="submit" className={buttonClassNames}>
                      Add Country
                    </button>
                  </form>
                </>
              )}
              {loading.countries ? (
                <p className="px-2 py-1">Loading countries...</p>
              ) : countries.length > 0 ? (
                <>
                  <h3 className="my-1 text-lg font-medium">Select Country</h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {countries.map((country) => (
                      <li key={country.code}>
                        <button
                          onClick={() => selectCountry(country)}
                          className={`${
                            selectedCountry?.code === country.code
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          } text-nowrap rounded-full px-4 py-2`}
                        >
                          {country.name} {country.emoji}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {user && selectedCountry && (
                    <>
                      <h3 className="my-1 text-lg font-medium">
                        Add Party for {selectedCountry.name}
                      </h3>
                      <form onSubmit={handleAddParty}>
                        <input
                          type="text"
                          name="name"
                          placeholder="Party name"
                          className={inputClassNames}
                          required
                        />
                        <input
                          type="text"
                          name="shortName"
                          placeholder="Short Name"
                          className={inputClassNames}
                          required
                        />
                        <input
                          type="text"
                          name="colour"
                          placeholder="Colour (hex code)"
                          className={inputClassNames}
                          required
                        />
                        <input
                          type="number"
                          min={-100}
                          max={100}
                          step={25}
                          name="position"
                          placeholder="Position (-100 to 100)"
                          className={inputClassNames}
                          required
                        />
                        <label className="mr-2">
                          <input type="checkbox" name="isIndependent" className="mr-1" />
                          Independent
                        </label>
                        <button type="submit" className={buttonClassNames}>
                          Add Party
                        </button>
                      </form>
                    </>
                  )}
                  {loading.parties ? (
                    <p className="px-2 py-1">Loading parties...</p>
                  ) : (
                    countryParties.length > 0 && (
                      <div>
                        <h3 className="my-1 text-lg font-medium">
                          Parties in {selectedCountry?.name}
                        </h3>
                        <ul className="flex flex-wrap items-center gap-2">
                          {countryParties.map((party) => (
                            <li
                              key={party.id}
                              className="flex items-center gap-1 text-nowrap rounded-full bg-gray-200 px-2 py-1 dark:bg-gray-700"
                            >
                              <span
                                className="size-3 flex-shrink-0 rounded-full"
                                style={{
                                  backgroundColor: party.colour || "#999999",
                                }}
                              ></span>
                              {party.shortName} ({party.id})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </>
              ) : (
                <p className="px-2 py-1">No countries available</p>
              )}
            </SectionCard>
            <SectionCard title="Chambers">
              {user && selectedCountry && (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Add Chamber for {selectedCountry.name}
                  </h3>
                  <form onSubmit={handleAddChamber}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Chamber name"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="shortName"
                      placeholder="Short Name"
                      className={inputClassNames}
                    />
                    <input
                      type="number"
                      name="totalSeats"
                      placeholder="Total Seats"
                      className={inputClassNames}
                      required
                    />
                    <button type="submit" className={buttonClassNames}>
                      Add Chamber
                    </button>
                  </form>
                </>
              )}
              {loading.chambers ? (
                <p className="px-2 py-1">Loading chambers...</p>
              ) : chambers.length > 0 ? (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Chambers in {selectedCountry?.name}
                  </h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {chambers.map((chamber) => (
                      <li key={chamber.id}>
                        <button
                          onClick={() => selectChamber(chamber)}
                          className={`${
                            selectedChamber?.id === chamber.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          } text-nowrap rounded-full px-4 py-2`}
                        >
                          {chamber.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="px-2 py-1">No chambers available</p>
              )}
            </SectionCard>
            <SectionCard title="Election & Polls">
              {user && selectedChamber && (
                <>
                  <h3 className="my-1 text-lg font-medium">
                    Add Poll for {selectedCountry?.name} - {selectedChamber.name}
                  </h3>
                  <form onSubmit={handleAddPoll}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Poll name"
                      className={inputClassNames}
                      required
                    />
                    <input
                      type="text"
                      name="date"
                      placeholder="Poll date"
                      className={inputClassNames}
                      required
                    />
                    <div>
                      {countryParties.length > 0 ? (
                        countryParties.map((party) => (
                          <div key={party.id}>
                            <label className="me-2 flex flex-wrap items-center">
                              <p className="flex w-full items-center sm:w-auto">
                                <span
                                  className="mr-2 inline-block h-4 w-4 flex-shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: party.colour || "#999999",
                                  }}
                                ></span>
                                <span className="me-2 text-wrap">{party.name}</span>
                              </p>
                              <input
                                type="number"
                                min="0"
                                placeholder={`Seats (${party.shortName})`}
                                className={inputClassNames}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  const seats = value === "" ? NaN : Number(value);
                                  handleSeatChange(party.id, seats);
                                }}
                              />
                            </label>
                          </div>
                        ))
                      ) : (
                        <p>No parties available for this country.</p>
                      )}
                    </div>
                    <button type="submit" className={buttonClassNames}>
                      Add Poll
                    </button>
                  </form>
                </>
              )}
              {loading.polls ? (
                <p className="px-2 py-1">Loading polls...</p>
              ) : polls.length > 0 ? (
                <div>
                  <h3 className="my-1 text-lg font-medium">
                    Polls for {selectedCountry?.name} - {selectedChamber?.name}
                  </h3>
                  <ul className="flex flex-wrap items-start gap-2">
                    {polls.map((poll) => (
                      <li key={poll.id}>
                        <button
                          onClick={() => selectPoll(poll)}
                          className={`${
                            selectedPoll?.id === poll.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          } text-nowrap rounded-full px-4 py-2`}
                        >
                          {poll.name} - {new Date(poll.date).toLocaleDateString()}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="px-2 py-1">No polls available</p>
              )}
            </SectionCard>
            {parties.length > 0 && (
              <SectionCard title="Selected Poll Result">
                <ul>
                  {parties.map((party, index) => (
                    <li key={index} className="mb-1 flex items-center">
                      <span
                        className="mr-2 inline-block h-4 w-4 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor: party.colour || "#999999",
                        }}
                      ></span>
                      {party.name} - Seats: {party.seats}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/"
                  className="mt-2 inline-block text-violet-600 hover:underline dark:text-violet-400"
                >
                  Go to Seat Simulator
                </Link>
              </SectionCard>
            )}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-4 h-[80vh] w-full overflow-auto rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <SectionCard title="User Information" className="mb-0 border-none p-0 shadow-none">
              <UserInformationPanel user={user} />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
