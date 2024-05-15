const app = Vue.createApp({
    data() {
        return {
            locations: [],
            parkOpeningTimes: null,
            parkLoadingError: false,
            locationsLoadingError: false,
            showParkLoadingMessage: true,
            showLocationsLoadingMessage: true,
            selectedArea: '', // Initialiseer met een lege string
        };
    },
    computed: {
        filteredLocations() {
            if (!this.selectedArea) {
                return this.locations; // Geen filter toegepast
            } else {
                // Filter locaties op geselecteerde gebied
                return this.locations.filter(location => {
                    // Mapping van gebieden naar bijbehorende IDs
                    const areaMappings = {
                        'Magische Vallei': [4, 11, 10],
                        'Land van Toos': [8],
                        'Avalon': [15, 1],
                        'Ithaka': [3, 12],
                        'Port Laguna': [13, 5, 6],
                        'Wunderwald': [2, 14, 9, 7],
                    };

                    // Controleer of het huidige gebied overeenkomt met de geselecteerde
                    return areaMappings[this.selectedArea]?.includes(location.id);
                });
            }
        },
    },
    mounted() {
        const fetchOpeningHours = () => {
            // Fetch park opening hours for today
            axios.get('https://portal.toverland.nl/api/opening_times/today/?format=json', {
                headers: {
                    'Authorization': 'Bearer 19e1e644d42d1d9028f39bc295bb5b3148faa2e2'
                }
            })
            .then(response => {
                const parkToday = response.data[0];
                this.parkOpeningTimes = {
                    open: parkToday.opening_time,
                    close: parkToday.closing_time
                };
                this.parkLoadingError = false; // Reset error state
                this.showParkLoadingMessage = false; // Hide loading message
            })
            .catch(error => {
                console.error('Error fetching park opening hours for today:', error);
                this.parkLoadingError = true; // Set error state
                this.showParkLoadingMessage = false; // Hide loading message
            });

            // Fetch horeca locations data
            axios.get('https://portal.toverland.nl/api/horeca/?format=json', {
                headers: {
                    'Authorization': 'Bearer 19e1e644d42d1d9028f39bc295bb5b3148faa2e2'
                }
            })
            .then(response => {
                this.locations = response.data.map(location => ({
                    id: location.id,
                    name: location.name,
                    opening_times_start: location.opening_times_start,
                    opening_times_end: location.opening_times_end,
                    is_open: location.is_open,
                }));
                this.locationsLoadingError = false; // Reset error state
                this.showLocationsLoadingMessage = false; // Hide loading message
            })
            .catch(error => {
                console.error('Error fetching Horeca data:', error);
                this.locationsLoadingError = true; // Set error state
                this.showLocationsLoadingMessage = false; // Hide loading message
            });
        };

        // Call fetchOpeningHours after 15 seconds delay
        setTimeout(() => {
            fetchOpeningHours();

            // Set interval to fetch updated data every minute
            setInterval(() => {
                fetchOpeningHours();
            }, 60000); // 60000 milliseconds = 1 minute
        }, 5000); // 5000 milliseconds = 15 seconds delay
    }
});

const vm = app.mount('#app');
