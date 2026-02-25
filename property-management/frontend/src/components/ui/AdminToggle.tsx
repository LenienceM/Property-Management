import { PropertyStatus } from "../../types/PropertyStatus";

type Props = {
  status: PropertyStatus;
  setStatus: (v: PropertyStatus) => void;
};

export default function AdminToggle({ status, setStatus }: Props) {
  return (
    <div className="flex justify-center gap-4 mt-8">
      {["ACTIVE", "ARCHIVED"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s as PropertyStatus)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition
            ${
              status === s
                ? "bg-[#C9A24D] text-black"
                : "bg-gray-200 hover:bg-gray-300"
            }
          `}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
