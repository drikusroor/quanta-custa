import { Cost, Participant } from "../App";

interface CostsFormProps {
  newCost: Cost;
  setNewCost: (value: Cost) => void;
  participants: Participant[];
  costs: Cost[];
  setCosts: (costs: Cost[]) => void;
}

const CostsForm = ({
  newCost,
  setNewCost,
  participants,
  costs,
  setCosts,
}: CostsFormProps) => {
  const addCost = () => {
    setCosts([...costs, newCost]);
    setNewCost({ item: "", amount: 0, cost: 0, paidBy: 0, paidFor: [] });
  };

  const handleCostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Add Cost</h2>
      <div className="space-y-4">
        <label className="block mt-2">Item</label>
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
          step="0.01"
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
        <button
          onClick={addCost}
          className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
        >
          Add Cost
        </button>
      </div>
    </>
  );
};

export default CostsForm;
