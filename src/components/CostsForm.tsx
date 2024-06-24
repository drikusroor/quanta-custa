import { Cost, NewCostForm, Participant } from "../App";
import classNames from "../util/classNames";

interface CostsFormProps {
  newCost: NewCostForm;
  setNewCost: (value: NewCostForm) => void;
  participants: Participant[];
  costs: Cost[];
  setCosts: (costs: Cost[]) => void;
}

const mapNewCostFormToCost = (newCost: NewCostForm): Cost => {
  return {
    item: newCost.item,
    amount: parseFloat(newCost.amount),
    cost: parseFloat(newCost.cost),
    paidBy: parseInt(newCost.paidBy),
    paidFor: newCost.paidFor.map((index) => parseInt(index)),
  };
}

const CostsForm = ({
  newCost,
  setNewCost,
  participants,
  costs,
  setCosts,
}: CostsFormProps) => {

  const addCost = () => {
    const newCostPayload = mapNewCostFormToCost(newCost);
    setCosts([...costs, newCostPayload]);
    setNewCost({ item: "", amount: "0", cost: "0", paidBy: "", paidFor: [] });
  };

  const handleCostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewCost({ ...newCost, [name]: value });
  };

  const handlePaidForChange = (index: string) => {
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

  const isDisabled = !participants.length || !newCost.item || !newCost.amount || !newCost.cost || !newCost.paidFor.length || newCost.paidBy === "";

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
                checked={newCost.paidFor.includes(index.toString())}
                onChange={() => handlePaidForChange(index.toString())}
                className="mr-2"
              />
              {participant.name}
            </label>
          ))}
          {!participants.length && <p className="text-slate-500">Add participants to add costs</p>}
        </div>
        <button className={classNames(
          "bg-blue-500 text-white w-full py-2 rounded-lg mt-4 hover:bg-blue-600 transition-opacity",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
          disabled={isDisabled}
        >
          Add Cost
        </button>
      </div>
    </form>
  );
};

export default CostsForm;
