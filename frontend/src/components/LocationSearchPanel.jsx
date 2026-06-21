import React from 'react'

const LocationSearchPanel = ({
  suggestions,
  handleSuggestionSelect,
  loading,
  error
}) => {

  const handleSuggestionClick = (suggestion) => {
    handleSuggestionSelect(suggestion)
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <span className="text-sm font-medium">Finding locations...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg">
          <i className="ri-error-warning-line text-lg animate-pulse"></i>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Helper text when suggestions list is empty */}
      {!loading && !error && suggestions.length === 0 && (
        <div className="text-gray-400 text-sm text-center py-4">
          Type at least 3 characters to search places...
        </div>
      )}

      {/* Display suggestions */}
      {!loading && suggestions.map(function(elem, idx) {
        return (
          <div 
            key={idx} 
            onClick={() => handleSuggestionClick(elem)} 
            className='flex border-2 p-3 border-gray-200 active:border-black rounded-xl gap-4 my-2 items-center justify-start cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200'
          >
            <h2>
              <i className='ri-map-pin-fill bg-[#eee] h-10 flex items-center justify-center w-10 rounded-full'></i>
            </h2>
            <h4 className='font-medium text-gray-800'>{elem}</h4>
          </div>
        )
      })}
    </div>
  )
}

export default LocationSearchPanel
