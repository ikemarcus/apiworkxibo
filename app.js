const app = Vue.createApp({
    data() {
        return {
            locations: [],
            parkOpeningTimes: null,
            parkLoadingError: false,
            locationsLoadingError: false,
            showParkLoadingMessage: true,
            showLocationsLoadingMessage: true,
            selectedArea: '',
            searchText: '', // Ensure searchText is defined
        };
    },
    computed: {
        filteredLocations() {
            return this.locations.filter(location => {
                const areaMappings = {
                    'Magische Vallei': [4, 11, 10],
                    'Land van Toos': [8],
                    'Avalon': [15, 1],
                    'Ithaka': [3, 12],
                    'Port Laguna': [13, 5, 6],
                    'Wunderwald': [2, 14, 9, 7],
                };

                const isInSelectedArea = !this.selectedArea || areaMappings[this.selectedArea]?.includes(location.id);
                const matchesSearchText = !this.searchText || location.name.toLowerCase().includes(this.searchText.toLowerCase());

                return isInSelectedArea && matchesSearchText;
            });
        },
    },
    mounted() {
        const fetchOpeningHours = () => {
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
                this.parkLoadingError = false;
                this.showParkLoadingMessage = false;
            })
            .catch(error => {
                console.error('Error fetching park opening hours for today:', error);
                this.parkLoadingError = true;
                this.showParkLoadingMessage = false;
            });

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
                this.locationsLoadingError = false;
                this.showLocationsLoadingMessage = false;
            })
            .catch(error => {
                console.error('Error fetching Horeca data:', error);
                this.locationsLoadingError = true;
                this.showLocationsLoadingMessage = false;
            });
        };

        setTimeout(() => {
            fetchOpeningHours();

            setInterval(() => {
                fetchOpeningHours();
            }, 60000);
        }, 5000);
    }
});

const vm = app.mount('#app');