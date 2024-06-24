import { Participant } from "../App";
import classNames from "../util/classNames";

interface ParticipantsFormProps {
  newParticipant: string;
  setNewParticipant: (value: string) => void;
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
}

const ParticipantsForm = ({
  newParticipant,
  setNewParticipant,
  participants,
  setParticipants,
}: ParticipantsFormProps) => {
  const addParticipant = () => {
    setParticipants([...participants, { name: newParticipant }]);
    setNewParticipant("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newParticipant) {
      return;
    }

    addParticipant();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold mb-4">Add Participants</h2>
      <div className="flex">
        <input
          type="text"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Participant name"
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
        />
        <button
          className={classNames("bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-opacity", !newParticipant && "opacity-50 cursor-not-allowed")}
          disabled={!newParticipant}
        >
          Add
        </button>
      </div>
      <ul className="list-disc list-inside mt-2">
        {participants.map((participant, index) => (
          <li key={index} className="text-gray-700">
            {participant.name}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default ParticipantsForm;
