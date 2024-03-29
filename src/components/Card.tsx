type Prop = {
  value: number;
  handleIsSelected: (value: number) => void;
  isSelect: boolean;
};

export const Card = ({ value, handleIsSelected, isSelect }: Prop) => {
  return (
    <div
      onClick={() => {
        handleIsSelected(value);
      }}
      className={`relative cursor-pointer transition-transform ease-in-out w-20 h-28 rounded-lg box-border bg-white text-black py-1 px-2 flex border-4  flex-col justify-between select-none hover:-translate-y-2 shadow-lg ${
        isSelect
          ? "border-emerald-200 -translate-y-2 shadow-xl"
          : "border-grey-400"
      }`}
    >
      <div className="flex flex-col items-center self-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          width={20}
          height={20}
          viewBox="0 0 296.473 296.473"
        >
          <path d="M148.237 0C66.368 0 .001 66.367.001 148.236s66.367 148.236 148.236 148.236c81.867 0 148.234-66.367 148.234-148.236S230.104 0 148.237 0zm48.252 202.12c-15.776 5.042-30.059.176-39.122-9.254.711 13.167 2.653 29.335 7.702 38.37h-33.666c5.049-9.035 6.991-25.202 7.702-38.369-9.063 9.43-23.347 14.295-39.121 9.253-27.906-8.921-57.13-68.825 48.253-136.071 105.382 67.246 76.158 127.15 48.252 136.071z" />
        </svg>
      </div>
      <h3 className="text-4xl self-center">{value}</h3>
      <div className="flex flex-col items-center self-end rotate-180">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          width={20}
          height={20}
          viewBox="0 0 296.473 296.473"
        >
          <path d="M148.237 0C66.368 0 .001 66.367.001 148.236s66.367 148.236 148.236 148.236c81.867 0 148.234-66.367 148.234-148.236S230.104 0 148.237 0zm48.252 202.12c-15.776 5.042-30.059.176-39.122-9.254.711 13.167 2.653 29.335 7.702 38.37h-33.666c5.049-9.035 6.991-25.202 7.702-38.369-9.063 9.43-23.347 14.295-39.121 9.253-27.906-8.921-57.13-68.825 48.253-136.071 105.382 67.246 76.158 127.15 48.252 136.071z" />
        </svg>
      </div>
    </div>
  );
};
