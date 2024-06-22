import React, { useState } from 'react';
import pako from 'pako';

interface Participant {
  name: string;
}

interface Cost {
  item: string;
  amount: number;
  cost: number | string;
  paidBy: number;
  paidFor: number[];
}

interface Data {
  u: string[];
  c: (string | number | number[])[];
}

const ExpenseTracker: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [newCost, setNewCost] = useState<Cost>({ item: '', amount: 0, cost: 0, paidBy: 0, paidFor: [] });

  const addParticipant = () => {
    setParticipants([...participants, { name: newParticipant }]);
    setNewParticipant('');
  };

  const addCost = () => {
    setCosts([...costs, newCost]);
    setNewCost({ item: '', amount: 0, cost: 0, paidBy: 0, paidFor: [] });
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCost({ ...newCost, [name]: value });
  };

  const handlePaidForChange = (index: number) => {
    const newPaidFor = [...newCost.paidFor];
    if (newPaidFor.includes(index)) {
      newPaidFor.splice(newPaidFor.indexOf(index), 1);
    } else {
      newPaidFor.push(index);
    }
    setNewCost({ ...newCost, paidFor: newPaidFor });
  };

  const calculatePayments = () => {
    const balances = participants.map(() => 0);

    costs.forEach(cost => {
      const totalCost = parseFloat(cost.cost);
      const share = totalCost / cost.paidFor.length;
      cost.paidFor.forEach(index => {
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
            payments.push(`${participants[j].name} pays ${participants[i].name} ${amount.toFixed(2)} doubloons`);
            balances[i] -= amount;
            balances[j] += amount;
          }
        });
      }
    });

    console.log({ balances, payments })


    return payments;
  };

  const shareUrl = () => {
    const data: Data = {
      u: participants.map(p => p.name),
      c: costs.map(cost => [cost.item, cost.amount, cost.cost, cost.paidBy, cost.paidFor])
    };
    const jsonString = JSON.stringify(data);
    const compressedString = pako.deflate(jsonString, { to: 'string' });
    const base64String = btoa(compressedString);
    const urlSafeBase64String = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const url = `${window.location.origin}${window.location.pathname}?d=${urlSafeBase64String}`;
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard: ' + url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow">Quanta Custa</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Participants</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newParticipant}
            onChange={e => setNewParticipant(e.target.value)}
            placeholder="Participant name"
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
          />
          <button onClick={addParticipant} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">Add</button>
        </div>
        <ul className="list-disc list-inside">
          {participants.map((participant, index) => (
            <li key={index} className="text-gray-700">{participant.name}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Cost</h2>
        <div className="space-y-4">
          <label className="block mt-2">
            Item
          </label>
          <input
            type="text"
            name="item"
            value={newCost.item}
            onChange={handleCostChange}
            placeholder="Item"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <label className="block mt-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={newCost.amount}
            onChange={handleCostChange}
            placeholder="Amount"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <label className="block mt-2">Cost</label>
          <input
            type="number"
            name="cost"
            value={newCost.cost}
            onChange={handleCostChange}
            placeholder="Cost"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <label className="block mt-2">Paid By</label>
          <select
            name="paidBy"
            value={newCost.paidBy}
            onChange={handleCostChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          >
            {participants.map((participant, index) => (
              <option key={index} value={index}>
                {participant.name}
              </option>
            ))}
          </select>
          <label className="block mt-2">Paid For</label>
          <div className="flex flex-wrap">
            {participants.map((participant, index) => (
              <label key={index} className="mr-4">
                <input
                  type="checkbox"
                  checked={newCost.paidFor.includes(index)}
                  onChange={() => handlePaidForChange(index)}
                  className="mr-2"
                />
                {participant.name}
              </label>
            ))}
          </div>
          <button onClick={addCost} className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600">Add Cost</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Payments</h2>
        <ul className="list-disc list-inside text-gray-700">
          {calculatePayments().map((payment, index) => (
            <li key={index}>{payment}</li>
          ))}
          {participants.length === 0 ? <li>Add participants to calculate payments</li> : costs.length === 0 ? <li>Add costs to calculate payments</li> : null}

        </ul>
      </div>

      <button onClick={shareUrl} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
        Share URL
      </button>
    </div>
  );
};

export default ExpenseTracker;