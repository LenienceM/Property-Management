
type Props = {
  suburb: string;
  setSuburb: (v: string) => void;
  bedrooms: string;
  setBedrooms: (v: string) => void;
  priceRange: string;
  setPriceRange: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
};


export default function FilterBar({
  suburb,
  setSuburb,
  bedrooms,
  setBedrooms,
  priceRange,
  setPriceRange,
  sort,
  setSort,
}: Props)



 {
  return (

        <div className="bg-white shadow-md -mt-12 relative z-20 rounded-xl">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        

        <input
          type="text"
          placeholder="Suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
        />

        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

       

        <select
  value={priceRange}
  onChange={(e) => setPriceRange(e.target.value)}
  className="border rounded-lg px-3 py-2"
>
  <option value="">Any Price</option>
  <option value="UNDER_5">Under R5 000 </option>
  <option value="5_10">R5 000 – R10 000</option>
  <option value="10_20">R10 000  – R20 000</option>
  <option value="OVER_20">R20 000+</option>
</select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Sort</option>
          <option value="price,asc">Price ↑</option>
          <option value="price,desc">Price ↓</option>       
        </select>

<button
  onClick={() => {
    setSuburb("");
    setBedrooms("");
    setPriceRange("");
    setSort("");
  }}
  className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
>
  Clear Filters
</button>
      </div>
    </div>
  );
}
