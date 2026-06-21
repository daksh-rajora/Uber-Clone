const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const mapService = require('./services/maps.services');

(async () => {
    try {
        console.log('--- Test Autocomplete for "Gidderbaha" ---');
        const s1 = await mapService.getAutoCompleteSuggestions('Gidderbaha');
        console.log('Suggestions:', s1);

        console.log('--- Test Autocomplete for "delhi" ---');
        const s2 = await mapService.getAutoCompleteSuggestions('delhi');
        console.log('Suggestions:', s2);

        console.log('--- Test Coordinate for "Gidderbaha" ---');
        const c1 = await mapService.getAddressCoordinate('Gidderbaha');
        console.log('Coordinates:', c1);
    } catch (err) {
        console.error('ERROR OCCURRED:', err);
    }
})();
