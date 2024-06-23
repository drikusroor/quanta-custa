import React, { useEffect, useState } from "react";
import pako from "pako";
import ParticipantsForm from "./components/ParticipantsForm";
import Tile from "./components/Tile";
import CostsForm from "./components/CostsForm";

export interface Participant {
  name: string;
}

export interface Cost {
  item: string;
  amount: number;
  cost: number | string;
  paidBy: number;
  paidFor: number[];
}

interface Data {
  u: string[];
  c: [string, number, number | string, number, number[]][];
}

const ExpenseTracker: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [newCost, setNewCost] = useState<Cost>({
    item: "",
    amount: 0,
    cost: 0,
    paidBy: 0,
    paidFor: [],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get("d");
    if (dataParam) {
      const data = decodeData(dataParam);
      if (data) {
        setParticipants(data.u.map((name) => ({ name })));
        setCosts(
          data.c.map((item) => ({
            item: item[0] as string,
            amount: item[1] as number,
            cost: item[2] as number,
            paidBy: item[3] as number,
            paidFor: item[4] as number[],
          }))
        );
        console.log("Parsed data: ", data);
      }
    }
  }, []);

  const decodeData = (urlSafeBase64String: string): Data | null => {
    try {
      const base64 = urlSafeBase64String.replace(/-/g, "+").replace(/_/g, "/");
      const compressed = atob(base64);
      // @ts-expect-error will be fixed in the next step
      const decompressedJsonString = pako.inflate(compressed, { to: "string" });
      return JSON.parse(decompressedJsonString) as Data;
    } catch (error) {
      console.error("Failed to decode data", error);
      return null;
    }
  };

  const calculatePayments = () => {
    const balances = participants.map(() => 0);

    costs.forEach((cost) => {
      // @ts-expect-error will be fixed in the next step
      const totalCost = parseFloat(cost.cost) * cost.amount;
      const share = totalCost / cost.paidFor.length;
      cost.paidFor.forEach((index) => {
        balances[index] -= share;
      });
      balances[cost.paidBy] += totalCost;
    });

    const payments: string[] = [];
    balances.forEach((balance, i) => {
      if (balance > 0) {
        participants.forEach((_, j) => {
          if (balances[j] < 0) {
            const amount = Math.min(balance, -balances[j]);
            payments.push(
              `${participants[j].name} pays ${
                participants[i].name
              } ${amount.toFixed(2)} doubloons`
            );
            balances[i] -= amount;
            balances[j] += amount;
          }
        });
      }
    });

    return payments;
  };

  const shareUrl = () => {
    const data: Data = {
      u: participants.map((p) => p.name),
      c: costs.map((cost) => [
        cost.item,
        cost.amount,
        cost.cost,
        cost.paidBy,
        cost.paidFor,
      ]),
    };
    const jsonString = JSON.stringify(data);
    // @ts-expect-error will be fixed in the next step
    const compressedString = pako.deflate(jsonString, { to: "string" });
    // @ts-expect-error will be fixed in the next step
    const base64String = btoa(compressedString);
    const urlSafeBase64String = base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const url = `${window.location.origin}${window.location.pathname}?d=${urlSafeBase64String}`;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard: " + url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow">
        Quanto Custa
      </h1>

      <Tile>
        <ParticipantsForm
          newParticipant={newParticipant}
          setNewParticipant={setNewParticipant}
          participants={participants}
          setParticipants={setParticipants}
        />
      </Tile>
      <Tile>
        <CostsForm
          costs={costs}
          newCost={newCost}
          participants={participants}
          setNewCost={setNewCost}
          setCosts={setCosts}
        />
      </Tile>

      <Tile>
        <h2 className="text-xl font-semibold mb-4">Payments</h2>
        <ul className="list-disc list-inside text-gray-700">
          {calculatePayments().map((payment, index) => (
            <li key={index}>{payment}</li>
          ))}
          {participants.length === 0 ? (
            <li>Add participants to calculate payments</li>
          ) : costs.length === 0 ? (
            <li>Add costs to calculate payments</li>
          ) : null}
        </ul>
      </Tile>

      <button
        onClick={shareUrl}
        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Share URL
      </button>
    </div>
  );
};

export default ExpenseTracker;
