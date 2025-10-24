// Utility function to get the token directly from localStorage
function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
}

// Function to handle automatic logout
type LogoutFunction = () => void;

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {},
    logoutHandler: LogoutFunction): Promise<Response> {
    const token = getAuthToken();
    const headers = new Headers(options.headers ?? {});

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        ...options,
        headers,
    });

    // Check for common auth errors
    if (response.status === 401 || response.status === 403) {
        console.error('Authentication error, logging out...');
        logoutHandler();
        throw new Error('Unauthorized: Please log in again.')
    }

    return response;
}