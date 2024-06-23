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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCost.item || !newCost.amount || !newCost.cost) {
      return;
    }

    addCost();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold mb-4">Add Cost</h2>
      <div className="">
        <label className="block mt-2 text-sm text-slate-500">Item</label>
        <input
          type="text"
          name="item"
          value={newCost.item}
          onChange={handleCostChange}
          placeholder="Item"
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none"
        />
        <label className="block mt-2 text-sm text-slate-500">Amount</label>
        <input
          type="number"
          name="amount"
          value={newCost.amount}
          onChange={handleCostChange}
          placeholder="Amount"
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none"
        />
        <label className="block mt-2 text-sm text-slate-500">Cost</label>
        <input
          type="number"
          name="cost"
          value={newCost.cost}
          onChange={handleCostChange}
          placeholder="Cost"
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none"
          step="0.01"
        />
        <label className="block mt-2 text-sm text-slate-500">Paid By</label>
        <select
          name="paidBy"
          value={newCost.paidBy}
          onChange={handleCostChange}
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none"
        >
          {participants.map((participant, index) => (
            <option key={index} value={index}>
              {participant.name}
            </option>
          ))}
        </select>
        <label className="block mt-2 text-sm text-slate-500">Paid For</label>
        <div className="flex flex-wrap mt-1">
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
          { !participants.length && <p className="text-slate-500">Add participants to add costs</p>}
        </div>
        <button className="bg-blue-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-blue-600">
          Add Cost
        </button>
      </div>
    </form>
  );
};

export default CostsForm;
