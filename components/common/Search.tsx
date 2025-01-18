'use client'

interface SearchProps
{
  placeholder: string;
}

export default function Search({placeholder}: SearchProps) {
  return (
    <div className="row-start-2 col-span-2 border-[0.3px] border-slate-100 md:border flex shadow-md hover:shadow-sm transition-all md:rounded-full items-center px-2  ">
      <div className="grid md:grid-cols-3 lg:grid-cols-7 gap-4 divide-x py-2 md:px-2 flex-grow">
        <input
          type="text"
          placeholder={placeholder}
          className="px-3 bg-transparent focus:outline-none lg:col-span-3 text-violet-500 placeholder:text-sm"
        />
      </div>
      <button className="bg-cyan-600 w-9 h-9 rounded-full grid place-items-center text-sm text-center transition-all hover:brightness-90 shrink-0">
        <i className="fas fa-search text-slate-200" />
      </button>
    </div>
  );
}
