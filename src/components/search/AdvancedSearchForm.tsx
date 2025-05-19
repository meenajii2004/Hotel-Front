import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import nlp from 'compromise';
import { MessageSquare, Calendar, Users, Search, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { getLocationSuggestions } from '../../data/mockData';
import "react-datepicker/dist/react-datepicker.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SearchMode {
  type: 'natural' | 'structured';
  label: string;
  icon: React.ReactNode;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

const parseToJSON = (responseString: string) => {
  try {
    const cleanedString = responseString
      .trim()
      .replace(/^```json\s*/g, "")
      .replace(/```\s*$/g, "");
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error("Gemini response JSON parse error:", error);
    return null;
  }
};

const searchModes: SearchMode[] = [
  { type: 'natural', label: 'Natural Language', icon: <MessageSquare size={20} /> },
  { type: 'structured', label: 'Basic Search', icon: <Search size={20} /> },
];

const AdvancedSearchForm: React.FC = () => {
  const { searchParams, updateSearchParams } = useSearch();
  const navigate = useNavigate();

  const [searchMode, setSearchMode] = useState<'natural' | 'structured'>('structured');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [location, setLocation] = useState(searchParams.location);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    searchParams.checkIn ?? null,
    searchParams.checkOut ?? null
  ]);
  const [guests, setGuests] = useState(
    searchParams.guests ?? { adults: 2, children: 0, rooms: 1 }
  );

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'natural' ? 'structured' : 'natural');
    setShowSuggestions(false);
  };

  const handleNaturalSearch = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Extract the city, price, rating, and amenities from the following text: ${naturalQuery}. Output should be a JSON (either you pass or fail) in the format - {"priceOperator": "greater", "price": 100, "ratingOperator": "greater", "rating": 5, "amenities": ["WiFi", "Pool", "Restaurant"], "city": "indore"}, if you did not find any key then just show an empty string but should be a JSON and no other text and in case of amenities an empty array, items in amenities can only contain these items : 'WiFi','Gym','Spa','Parking' 'Restaurant','Bar'. In priceOperator and ratingOperator only 1 out of these 4 values can be returned : 'greater', 'lower', 'equal', ''.`;

    try {
      const result = await model.generateContent(prompt);
      const rawText = await result.response.text();
      const parsed = parseToJSON(rawText);

      if (!parsed) {
        alert("Could not understand your query. Try a different phrase.");
        return;
      }

      updateSearchParams({
        location: parsed.city || '',
        price: parsed.price || null,
        priceOperator: parsed.priceOperator || '',
        rating: parsed.rating || null,
        ratingOperator: parsed.ratingOperator || '',
        amenities: parsed.amenities || [],
      });

      navigate('/search');
    } catch (error) {
      console.error("Gemini API error:", error);
      alert("Something went wrong processing your query.");
    }
  };

  const handleStructuredSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({
      location,
      checkIn: dateRange[0],
      checkOut: dateRange[1],
      guests
    });
    navigate('/search');
  };

  const getSampleQueries = () => [
    "2 nights in Paris next week",
    "London hotel for 3 people this weekend",
    "New York City from March 15 to March 20",
    "Beach resort in Miami for 4 adults",
    "Tokyo hotel near city center next month"
  ];

  const handleSampleQuery = (query: string) => {
    setNaturalQuery(query);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Toggle Mode */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {searchModes.map((mode) => (
            <button
              key={mode.type}
              onClick={() => setSearchMode(mode.type)}
              className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                searchMode === mode.type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {mode.icon}
              <span className="ml-2">{mode.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={toggleSearchMode}
          className="text-gray-600 hover:text-gray-800"
        >
          {searchMode === 'natural' ? (
            <ToggleRight size={24} />
          ) : (
            <ToggleLeft size={24} />
          )}
        </button>
      </div>

      {/* Natural Language Mode */}
      {searchMode === 'natural' ? (
        <div>
          <div className="relative">
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Try 'Find a hotel in Paris for 2 nights next week'"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {naturalQuery && (
              <button
                onClick={() => setNaturalQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {showSuggestions && (
            <div className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Try these examples:</h3>
              <div className="space-y-2">
                {getSampleQueries().map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuery(query)}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleNaturalSearch}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Search Hotels
          </button>
        </div>
      ) : (
        // Structured Mode
        <form onSubmit={handleStructuredSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you going?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date Picker */}
            <div className="relative col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in — Check-out</label>
              <div className="relative">
                <DatePicker
                  selected={dateRange[0]}
                  onChange={(dates) => setDateRange(dates as [Date | null, Date | null])}
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  selectsRange
                  minDate={new Date()}
                  monthsShown={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select dates"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <div className="relative">
                <select
                  value={guests?.adults ?? 2}
                  onChange={(e) =>
                    setGuests({
                      ...(guests || { adults: 2, children: 0, rooms: 1 }),
                      adults: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Search Hotels
          </button>
        </form>
      )}
    </div>
  );
};

export default AdvancedSearchForm;
