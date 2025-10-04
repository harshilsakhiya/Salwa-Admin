export type AgentRow = {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  status: "Active" | "Inactive" | "On Hold";
};

export type TabKey = "individual" | "business";

export const individualAgents: AgentRow[] = Array.from({ length: 18 }, (_, index) => ({
  id: `#${(index + 3).toString().padStart(4, "0")}`,
  name: "Ahmed Mohammed Alsalami",
  code: `AHMED${1234 + index}`,
  email: "adsalam@gmail.com",
  phone: "+966 077 099 004",
  country: "Saudi Arabia",
  region: `Region ${((index % 4) + 1).toString()}`,
  city: `City ${(index % 4) + 1}`,
  status: index % 5 === 0 ? "Inactive" : index % 7 === 0 ? "On Hold" : "Active",
}));

export const businessAgents: AgentRow[] = Array.from({ length: 14 }, (_, index) => ({
  id: `#B${(index + 23).toString().padStart(3, "0")}`,
  name: "Fahad Al Otaibi",
  code: `FAHAD${4321 + index}`,
  email: "fahadotaibi@gmail.com",
  phone: "+966 055 887 770",
  country: "Saudi Arabia",
  region: `Region ${((index % 3) + 1).toString()}`,
  city: `City ${(index % 4) + 1}`,
  status: index % 4 === 0 ? "Inactive" : "Active",
}));
