import { useState, useEffect } from 'react';

// Custom hook to fetch data from multiple endpoints
const useFetchDropdownData = () => {
    const [locations, setLocations] = useState([]);
    const [roles, setRoles] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define your API endpoint URLs here
    const API_URLS = {
        locations: "/api/locations", // Replace with your actual URL
        roles: "/api/roles", // Replace with your actual URL
        specialities: "/api/specialities", // Replace with your actual URL
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Helper function to fetch data from a single endpoint
                const get = async (url) => {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return await response.json();
                };

                // Fetch data from all endpoints concurrently
                const [locationsData, rolesData, specialitiesData] = await Promise.all([
                    get(API_URLS.locations),
                    get(API_URLS.roles),
                    get(API_URLS.specialities),
                ]);

                setLocations(locationsData);
                setRoles(rolesData);
                setSpecialities(specialitiesData);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { locations, roles, specialities, loading, error };
};

export default useFetchDropdownData;

