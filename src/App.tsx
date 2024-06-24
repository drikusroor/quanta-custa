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
  cost: number;
  paidBy: number;
  paidFor: number[];
}

export interface NewCostForm {
  item: string;
  amount: string;
  cost: string;
  paidBy: string;
  paidFor: string[];
}

interface Data {
  u: string[];
  c: [string, number, number | string, number, number[]][];
}

const ExpenseTracker: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [newCost, setNewCost] = useState<NewCostForm>({
    item: "",
    amount: "0",
    cost: "0.00",
    paidBy: "0",
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
      }
    }
  }, []);

  const decodeData = (urlSafeBase64String: string): Data | null => {
    try {
      const base64 = urlSafeBase64String.replace(/-/g, "+").replace(/_/g, "/");
      const compressed = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const decompressed = pako.inflate(compressed, { to: "string" });
      return JSON.parse(decompressed) as Data;
    } catch (error) {
      console.error("Failed to decode data", error);
      return null;
    }
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
    const compressed = pako.deflate(jsonString) as unknown as number[];
    const base64String = btoa(String.fromCharCode.apply(null, compressed));
    const urlSafeBase64String = base64String
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    const url = `${window.location.origin}${window.location.pathname}?d=${urlSafeBase64String}`;
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard: " + url);
  };

  const getReadableCost = (cost: Cost) => {
    const paidByName = participants[cost.paidBy].name;
    const paidForNames = cost.paidFor.map((i) => participants[i].name).join(", ");
    const price = cost.cost.toFixed(2);
    const total = (cost.amount * cost.cost).toFixed(2);
    return `${paidByName} bought ${cost.item} - ${cost.amount} x ${price} = ${total} for ${paidForNames}`;
  }

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
              } ${amount.toFixed(2)}`
            );
            balances[i] -= amount;
            balances[j] += amount;
          }
        });
      }
    });

    return payments;
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
        <h2 className="text-xl font-semibold mb-1">Costs</h2>
        <ul className="list-disc list-inside text-gray-700">
          {costs.map((cost, index) => (
            <li className="text-sm" key={index}>
              {getReadableCost(cost)}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-1">Payments</h2>
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

      <footer className="mt-8 text-gray-300">
        <p>
          Made by{" "}
          <a
            href="https://kokokoding.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Koko Koding
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ExpenseTracker;
